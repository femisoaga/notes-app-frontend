import  { useState } from "react";
import type {  KeyboardEvent, ChangeEvent } from "react";
import { MdAdd, MdClose } from "react-icons/md";

interface TagInputProps {
  tags: string[];
  setTags: React.Dispatch<React.SetStateAction<string[]>>;
}

const TagInput: React.FC<TagInputProps> = ({ tags, setTags }) => {
  const [inputValue, setInputValue] = useState<string>("");

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>): void => {
    setInputValue(e.target.value);
  };

  const AddNewTag = (): void => {
    if (inputValue.trim() !== "") {
      setTags([...tags, inputValue.trim()]);
      setInputValue("");
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>): void => {
    if (e.key === "Enter") {
      e.preventDefault();
      AddNewTag();
    }
  };

  const handleRemoveTag = (tagToRemove: string): void => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  return (
    <div>
      {tags.length > 0 && (
        <div>
          {tags?.map((tag, index) => (
            <span
              key={index}
              className="inline-block bg-slate-200 text-slate-800 text-xs px-2 py-1 rounded-full mr-2 mb-2"
            >
              #{tag}
              <button
                onClick={() => handleRemoveTag(tag)}
                className="ml-1 text-slate-500 hover:text-slate-800 font-bold"
                type="button"
              >
                <MdClose className="inline-block text-sm" />
              </button>
            </span>
          ))}
        </div>
      )}

      <div className="flex items-center gap-4 mt-3">
        <input
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          type="text"
          placeholder="Add tags"
          className="text-sm bg-transparent border px-3 py-2 rounded outline-none"
        />
        <button
          onClick={AddNewTag}
          className="w-8 h-8 flex items-center justify-center rounded border border-slate-700 hover:bg-slate-700 transition-colors"
          type="button"
        >
          <MdAdd className="text-2xl text-slate-950 hover:text-white" />
        </button>
      </div>
    </div>
  );
};

export default TagInput;