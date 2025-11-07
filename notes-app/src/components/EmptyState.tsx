import { MdNoteAdd } from "react-icons/md";

const EmptyState = () => {
  return (
    <div className="flex flex-col items-center justify-center text-center py-20">
      <div className="bg-gray-100 rounded-full p-6 mb-4">
        <MdNoteAdd className="text-gray-500 text-6xl" />
      </div>
      <h2 className="text-xl font-semibold text-gray-700">No Notes Yet</h2>
      <p className="text-gray-500 mt-2">
        Create your first note to get started.
      </p>
    </div>
  );
};

export default EmptyState;
