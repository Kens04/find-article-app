export enum ArticleStatus {
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

export interface ArticleList {
  id: string;
  title: string;
  url: string;
  text: string | "";
  status: ArticleStatus;
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
  articleId: string;
}

export interface CreateArticleInput {
  title: string;
  url: string;
  status: ArticleStatus;
  dueDate: Date;
  category?: string;
  isPublic: boolean;
  isFavorite: boolean;
  isToday: boolean;
}

export interface EditArticleInput {
  id?: string;
  title: string;
  url: string;
  dueDate: Date;
  category?: string;
  text?: string;
  isToday: boolean;
}

export interface CategorySearchProps {
  articles: ArticleList[];
  selectedCategories?: string[];
  onCategoryChange?: (categories: string[]) => void;
  onSortChange?: (sort: "asc" | "desc") => void;
  sort?: "asc" | "desc" | null;
  label?: string;
}
