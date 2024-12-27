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

export interface CreateTodoInput {
  title: string;
  url: string;
  status: TodoStatus;
  dueDate: Date;
  category?: string;
  isPublic: boolean;
  isFavorite: boolean;
}

export interface CategorySearchProps {
  todos: TodoList[];
  selectedCategories?: string[];
  onCategoryChange?: (categories: string[]) => void;
  onSortChange?: (sort: "asc" | "desc") => void;
  sort?: "asc" | "desc" | null;
  label?: string;
}
