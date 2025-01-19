export enum TodoStatus {
  UNREAD = "UNREAD",
  READING = "READING",
  COMPLETED = "COMPLETED",
}

export interface User {
  id: string;
  name: string | null;
  email: string;
  avatarUrl: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface TodoList {
  id: string;
  title: string;
  url: string;
  text: string | "";
  status: TodoStatus;
  category: string | "";
  dueDate: Date;
  isPublic: boolean;
  isFavorite: boolean;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
  completedAt: Date;
  sharedAt: Date;
  isToday: boolean;
  likes: Like[];
}

export interface Like {
  id: string;
  userId: string;
  todoId: string;
}

export interface CreateTodoInput {
  title: string;
  url: string;
  status: TodoStatus;
  dueDate: Date;
  category?: string;
  isPublic: boolean;
  isFavorite: boolean;
  isToday: boolean;
}

export interface EditTodoInput {
  id?: string;
  title: string;
  url: string;
  dueDate: Date;
  category?: string;
  text?: string;
  isToday: boolean;
}

export interface CategorySearchProps {
  todos: TodoList[];
  selectedCategories?: string[];
  onCategoryChange?: (categories: string[]) => void;
  onSortChange?: (sort: "asc" | "desc") => void;
  sort?: "asc" | "desc" | null;
  label?: string;
}
