import { useState, useEffect } from "react";
import TagInput from "../../components/Inputs/TagInput";
import {
  defaultValidationRules,
  type AddEditNotesProps,
  type ValidationErrors,
} from "../../utils/types";
import {
  validateField,
  validateForm,
  isFormValid,
  getTitleValidationStatus,
  getContentValidationStatus,
} from "../../utils/helper";
import axiosInstance from "../../utils/axiosInstance";

type ShowToastFn = (
  message: string,
  type?: "success" | "error" | "info"
) => void;

type LocalAddEditProps = AddEditNotesProps & {
  showToast?: ShowToastFn;
};

const AddEditNotes: React.FC<LocalAddEditProps> = ({
  noteData,
  getAllNotes,
  type,
  onClose,
  showToast,
}) => {
  const [title, setTitle] = useState<string>(noteData?.title || "");
  const [content, setContent] = useState<string>(noteData?.content || "");
  const [tags, setTags] = useState<string[]>(noteData?.tags || []);
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [touched, setTouched] = useState({
    title: false,
    content: false,
    tags: false,
  });
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const titleValidation = getTitleValidationStatus(title);
  const contentValidation = getContentValidationStatus(content);

  useEffect(() => {
    if (touched.title)
      setErrors((prev) => ({ ...prev, title: validateField("title", title) }));
    if (touched.content)
      setErrors((prev) => ({
        ...prev,
        content: validateField("content", content),
      }));
    if (touched.tags)
      setErrors((prev) => ({ ...prev, tags: validateField("tags", tags) }));
  }, [title, content, tags, touched]);

  useEffect(() => {
    setTitle(noteData?.title ?? "");
    setContent(noteData?.content ?? "");
    setTags(noteData?.tags ?? []);
    setErrors({});
    setTouched({ title: false, content: false, tags: false });
    setIsSubmitting(false);
  }, [noteData]);

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value);
    if (!touched.content) setTouched((prev) => ({ ...prev, content: true }));
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
    if (!touched.title) setTouched((prev) => ({ ...prev, title: true }));
  };

  const handleTagsChange = (value: React.SetStateAction<string[]>) => {
    setTags(value);
    if (!touched.tags) setTouched((prev) => ({ ...prev, tags: true }));
  };

  const handleBlur = (field: keyof typeof touched) =>
    setTouched((prev) => ({ ...prev, [field]: true }));

  const notify = (
    message: string,
    kind: "success" | "error" | "info" = "info"
  ) => {
    try {
      if (typeof showToast === "function") {
        showToast(message, kind);
      } else {
        // eslint-disable-next-line no-console
        console.log(`[toast:${kind}] ${message}`);
      }
    } catch {
      // eslint-disable-next-line no-empty
    }
  };

  const addNewNote = async () => {
    try {
      const normalizedTags = tags.map((t) => t.trim()).filter(Boolean);
      const response = await axiosInstance.post("/add-note", {
        title: title.trim(),
        content: content.trim(),
        tags: normalizedTags,
      });

      if (response.data && response.data.note) {
        if (typeof getAllNotes === "function") getAllNotes();
        notify("Note added", "success");
        onClose();
      } else {
        const msg = "Unexpected response from server when adding note.";
        setErrors((prev) => ({ ...prev, form: msg }));
        notify(msg, "error");
      }
    } catch (error: any) {
      const msg =
        error?.response?.data?.message ||
        error?.message ||
        "Failed to add note. Please try again.";
      setErrors((prev) => ({ ...prev, form: msg }));
      notify(msg, "error");
      // eslint-disable-next-line no-console
      console.error("addNewNote error:", error);
    }
  };

  const editNote = async (): Promise<void> => {
    const id = (noteData as any)?._id ?? (noteData as any)?.id;
    if (!id) {
      const msg = "Cannot update note: missing note id.";
      setErrors((prev) => ({ ...prev, form: msg }));
      notify(msg, "error");
      return;
    }

    try {
      const normalizedTags = tags.map((t) => t.trim()).filter(Boolean);
      const response = await axiosInstance.put(`/edit-note/${id}`, {
        title: title.trim(),
        content: content.trim(),
        tags: normalizedTags,
      });

      if (response.data && (response.data.note || response.data.updated)) {
        if (typeof getAllNotes === "function") getAllNotes();
        notify("Note updated", "success");
        onClose();
      } else {
        const msg = "Unexpected response from server when updating note.";
        setErrors((prev) => ({ ...prev, form: msg }));
        notify(msg, "error");
      }
    } catch (error: any) {
      const msg =
        error?.response?.data?.message ||
        error?.message ||
        "Failed to update note. Please try again.";
      setErrors((prev) => ({ ...prev, form: msg }));
      notify(msg, "error");
      // eslint-disable-next-line no-console
      console.error("editNote error:", error);
    }
  };

  const handleAddNote = async (): Promise<void> => {
    setTouched({ title: true, content: true, tags: true });

    const formErrors = validateForm(title, content, tags);
    setErrors(formErrors);

    if (!isFormValid(formErrors)) return;

    setIsSubmitting(true);
    try {
      if (type === "edit") await editNote();
      else await addNewNote();
    } catch (err) {
      const msg = "Failed to save note. Please try again.";
      setErrors((prev) => ({ ...prev, form: msg }));
      notify(msg, "error");
      // eslint-disable-next-line no-console
      console.error("Error saving note:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const formIsValid = isFormValid(errors);

  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-slate-800">
          {type === "edit" ? "Edit Note" : "Add New Note"}
        </h2>
        <button
          onClick={onClose}
          className="text-slate-500 hover:text-slate-700 transition-colors text-xl"
          disabled={isSubmitting}
          aria-label="Close dialog"
        >
          ✕
        </button>
      </div>

      {errors.form && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 text-sm rounded-lg border border-red-200">
          {errors.form}
        </div>
      )}

      <div className="flex flex-col gap-2">
        <div className="flex justify-between items-center">
          <label className="input-label">TITLE</label>
          <span
            className={`text-xs ${
              !titleValidation.isValid ? "text-red-500" : "text-slate-500"
            }`}
          >
            {titleValidation.length}/{defaultValidationRules.maxTitleLength}
          </span>
        </div>
        <input
          type="text"
          className={`text-2xl text-slate-950 outline-none border-b-2 pb-2 transition-colors ${
            errors.title && touched.title
              ? "border-red-500"
              : "border-slate-200 focus:border-primary"
          }`}
          placeholder="Go to gym at 5"
          value={title}
          onChange={handleTitleChange}
          onBlur={() => handleBlur("title")}
          disabled={isSubmitting}
        />
        {errors.title && touched.title && (
          <p className="text-red-500 text-xs mt-1">{errors.title}</p>
        )}
      </div>

      <div className="flex flex-col gap-2 my-4">
        <div className="flex justify-between items-center">
          <label className="input-label">CONTENT</label>
          <span
            className={`text-xs ${
              !contentValidation.isValid ? "text-red-500" : "text-slate-500"
            }`}
          >
            {contentValidation.length}/{defaultValidationRules.maxContentLength}
          </span>
        </div>
        <textarea
          className={`text-sm text-slate-950 outline-none bg-slate-50 p-2 rounded border transition-colors ${
            errors.content && touched.content
              ? "border-red-500"
              : "border-slate-200 focus:border-primary"
          }`}
          rows={10}
          placeholder="Write your note content here..."
          value={content}
          onChange={handleContentChange}
          onBlur={() => handleBlur("content")}
          disabled={isSubmitting}
        />
        {errors.content && touched.content && (
          <p className="text-red-500 text-xs mt-1">{errors.content}</p>
        )}
      </div>

      <div className="mt-3">
        <label className="input-label">TAGS</label>
        <TagInput tags={tags} setTags={handleTagsChange} />
        {errors.tags && touched.tags && (
          <p className="text-red-500 text-xs mt-1">{errors.tags}</p>
        )}
      </div>

      <button
        className="btn-primary font-medium mt-5 p-3 rounded-lg w-full disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        onClick={handleAddNote}
        disabled={!formIsValid || isSubmitting || !touched.title}
      >
        {isSubmitting ? (
          <span className="flex items-center justify-center">
            <svg
              className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V4a8 8 0 00-8 8h4z"
              />
            </svg>
            {type === "edit" ? "UPDATING..." : "ADDING..."}
          </span>
        ) : type === "edit" ? (
          "UPDATE"
        ) : (
          "ADD"
        )}
      </button>
    </div>
  );
};

export default AddEditNotes;
