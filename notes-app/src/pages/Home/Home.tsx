import { MdAdd } from "react-icons/md";
import NoteCard from "../../components/Cards/NoteCard";
import Navbar from "../../components/Navbar/Navbar";
import AddEditNotes from "./AddEditNotes";
import { useEffect, useState, useCallback } from "react";
import Modal from "react-modal";
import type { EditAddModalState, NoteData } from "../../utils/types";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";
import EmptyState from "../../components/EmptyState";
import { motion } from "framer-motion";
import ToastContainer from "../../components/Toast";
import type { ToastItem } from "../../components/Toast";

const Home = () => {
  const [openEditAddModal, setOpenEditAddModal] = useState<EditAddModalState>({
    isShown: false,
    type: "add",
    data: null,
  });

  const [userInfo, setUserInfo] = useState(null);
  const [allNotes, setAllNotes] = useState<NoteData[]>([]);

  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const navigate = useNavigate();

  // toast helpers
  const addToast = useCallback(
    (message: string, type: ToastItem["type"] = "info", duration = 3000) => {
      const id = `${Date.now().toString(36)}-${Math.random()
        .toString(36)
        .slice(2, 8)}`;
      setToasts((prev) => [{ id, message, type, duration }, ...prev]);
      return id;
    },
    []
  );

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const showToast = (
    message: string,
    type: ToastItem["type"] = "info",
    duration = 3000
  ) => {
    addToast(message, type, duration);
  };

  const getUserInfo = async () => {
    try {
      const response = await axiosInstance.get("/get-user");
      if (response.data && response.data.user) {
        setUserInfo(response.data.user);
      }
    } catch (error: any) {
      if (error?.response?.status === 401) {
        localStorage.clear();
        navigate("/login");
      } else {
        console.error("getUserInfo error:", error);
        showToast("Failed to fetch user info.", "error");
      }
    }
  };

  const getAllNotes = async () => {
    try {
      const response = await axiosInstance.get("/get-all-notes");
      if (response.data && response.data.notes) {
        setAllNotes(response.data.notes);
      }
    } catch (error: any) {
      console.error("An unexpected error occured. Please try again", error);
      showToast("Failed to load notes. Please try again.", "error");
    }
  };

  useEffect(() => {
    getAllNotes();
    getUserInfo();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleEdit = (note: NoteData): void => {
    setOpenEditAddModal({
      isShown: true,
      type: "edit",
      data: note,
    });
  };

  const handleDelete = async (note: NoteData): Promise<void> => {
    const id = (note as any)?._id ?? (note as any)?.id;
    if (!id) {
      console.error("Cannot delete note: missing id", note);
      showToast("Unable to delete note (missing id).", "error");
      return;
    }

    const confirmed = window.confirm(
      "Are you sure you want to delete this note?"
    );
    if (!confirmed) return;

    try {
      const response = await axiosInstance.delete(`/delete-note/${id}`);
      if (response.status === 200) {
        setAllNotes((prev) =>
          prev.filter((n) => ((n as any)?._id ?? (n as any)?.id) !== id)
        );
        showToast("Note deleted", "success");
        getAllNotes();
      } else {
        console.error("Unexpected delete response:", response);
        showToast("Failed to delete note. Please try again.", "error");
      }
    } catch (error: any) {
      const msg =
        error?.response?.data?.message ||
        error?.message ||
        "Failed to delete note.";
      console.error("delete note error:", error);
      showToast(msg, "error");
    }
  };

  const handlePinNote = async (note: NoteData): Promise<void> => {
    const id = (note as any)?._id ?? (note as any)?.id;
    if (!id) {
      console.error("Cannot toggle pin: missing id", note);
      showToast("Unable to toggle pin (missing id).", "error");
      return;
    }

    try {
      const response = await axiosInstance.patch(`/toggle-pin-note/${id}`);
      if (response.status === 200) {
        setAllNotes((prev) =>
          prev.map((n) =>
            ((n as any)?._id ?? (n as any)?.id) === id
              ? { ...n, isPinned: !n.isPinned }
              : n
          )
        );

        const newPinnedState = !note.isPinned;
        showToast(newPinnedState ? "Note pinned" : "Note unpinned", "success");

        getAllNotes();
      } else {
        console.error("Unexpected toggle pin response:", response);
        showToast("Unable to toggle pin. Please try again.", "error");
      }
    } catch (error: any) {
      console.error("toggle pin error:", error);
      const msg =
        error?.response?.data?.message ||
        error?.message ||
        "Failed to toggle pin.";
      showToast(msg, "error");
    }
  };

  return (
    <>
      <Navbar userInfo={userInfo} />

      {/* Toasts */}
      <ToastContainer toasts={toasts} onRemove={removeToast} />

      <div className="container mx-auto px-4">
        {allNotes.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <EmptyState />
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-8">
            {allNotes.map((note, index) => (
              <NoteCard
                key={note._id || index}
                title={note.title}
                date={note.date}
                tags={note.tags}
                content={note.content}
                isPinned={note.isPinned ?? false}
                onEdit={() => handleEdit(note)}
                onDelete={() => handleDelete(note)}
                onPinNote={() => handlePinNote(note)}
              />
            ))}
          </div>
        )}
      </div>

      <button
        onClick={() =>
          setOpenEditAddModal({ isShown: true, type: "add", data: null })
        }
        className="w-16 h-16 flex items-center justify-center rounded-xl bg-primary hover:bg-blue-600 absolute right-10 bottom-10 transition-colors shadow-lg"
        aria-label="Add new note"
      >
        <MdAdd className="text-[32px] text-white" />
      </button>

      <Modal
        isOpen={openEditAddModal.isShown}
        onRequestClose={() =>
          setOpenEditAddModal({ isShown: false, type: "add", data: null })
        }
        style={{
          overlay: { backgroundColor: "rgba(0, 0, 0, 0.2)", zIndex: 1000 },
          content: {
            border: "none",
            borderRadius: "8px",
            padding: "20px",
            boxShadow: "0 10px 25px rgba(0, 0, 0, 0.2)",
          },
        }}
        contentLabel={
          openEditAddModal.type === "add" ? "Add New Note" : "Edit Note"
        }
        className="w-[90%] max-w-2xl max-h-[85vh] bg-white rounded-md mx-auto mt-14 p-5 overflow-auto"
        appElement={document.getElementById("root") as HTMLElement}
      >
        <AddEditNotes
          type={openEditAddModal.type}
          noteData={openEditAddModal.data}
          onClose={() =>
            setOpenEditAddModal({ isShown: false, type: "add", data: null })
          }
          getAllNotes={getAllNotes}
          showToast={showToast}
        />
      </Modal>
    </>
  );
};

export default Home;
