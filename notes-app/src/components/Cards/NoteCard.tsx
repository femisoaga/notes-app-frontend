import { MdCreate, MdDelete, MdOutlinePushPin } from "react-icons/md";
import type { NoteCardProps } from "../../utils/types";
import { formattedDate } from "../../utils/helper";

const NoteCard: React.FC<NoteCardProps> = ({
  title,
  date,
  tags,
  content,
  isPinned,
  onEdit,
  onDelete,
  onPinNote,
}) => {
  return (
    <div className="bg-white rounded p-4 border hover:shadow-xl transition-all ease-in-out">
      <div className="flex justify-between items-center mb-3">
        <div>
          <h6 className="text-sm font-medium">{title}</h6>
          <span className="text-xs text-slate-500">{formattedDate(date)}</span>
        </div>
        <MdOutlinePushPin
          className={`icon-btn ${
            isPinned ? "text-primary" : "text-slate-300 hover:text-slate-600"
          }`}
          onClick={onPinNote}
        />
      </div>

      <p className="text-sm text-slate-700 mb-3">{content?.slice(0, 60)}...</p>

      <div className="flex items-center justify-between mt-2">
        <div className="text-sm text-slate-500">
          {tags?.map((tag) => `#${tag}`).join(" ")}
        </div>

        <div className="flex items-center gap-2">
          <MdCreate onClick={onEdit} className=" hover:text-blue-600 transition-colors" />
          <MdDelete onClick={onDelete} className=" hover:text-red-600 transition-colors" />
        </div>
      </div>
    </div>
  );
};

export default NoteCard;
