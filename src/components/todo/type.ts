export enum TodoStatus {
  UNREAD = "UNREAD",
  READING = "READING",
  COMPLETED = "COMPLETED"
}

export interface TodoList {
  id: string;
  title: string;
  url: string;
  text: string;
  status: TodoStatus;
  category: string;
  dueDate: Date;
  isPublic: boolean;
  isFavorite: boolean;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
  completedAt: Date;
  sharedAt: Date;
}

export interface CategorySearchProps {
  todos: TodoList[];
  selectedCategories?: string[];
  onCategoryChange?: (categories: string[]) => void;
  onSortChange?: (sort: "asc" | "desc") => void;
  sort?: "asc" | "desc" | null;
  label?: string;
}
