export type ValidationResult = {
  valid: boolean;
  message?: string;
};

export interface SearchBarProps {
  value: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleSearch: () => void;
  onClearSearch: () => void;
}

export interface NoteCardProps {
  title: string;
  date: string | Date;
  tags?: string[];
  content: string;
  isPinned: boolean;
  onEdit: () => void;
  onDelete: () => void;
  onPinNote: () => void;
}

export interface ProfileCardProps {
  userInfo?: any;
  handleLogout: () => void;
}
export interface NoteData {
  _id?: string;
  title: string;
  content: string;
  tags: string[];
  date: string;
  isPinned?: boolean;
  createdOn?: string;
}

export interface AddEditNotesProps {
  noteData?: NoteData | null;
  type: "add" | "edit";
  onClose: () => void;
  getAllNotes: () => void;
}


export interface ValidationErrors {
  title?: string;
  content?: string;
  tags?: string;
  form?: string;
}

export interface ValidationRules {
  minTitleLength: number;
  maxTitleLength: number;
  minContentLength: number;
  maxContentLength: number;
  maxTags: number;
  minTagLength: number;
  maxTagLength: number;
}

export const defaultValidationRules: ValidationRules = {
  minTitleLength: 3,
  maxTitleLength: 100,
  minContentLength: 10,
  maxContentLength: 2000,
  maxTags: 10,
  minTagLength: 2,
  maxTagLength: 20,
};

export interface NoteData {
  id?: string;
  title: string;
  date: string;
  tags: string[];
  content: string;
  isPinned?: boolean | undefined;
}

export interface EditAddModalState {
  isShown: boolean;
  type: "add" | "edit";
  data: NoteData | null;
}
