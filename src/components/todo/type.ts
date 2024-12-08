export interface TodoList {
  id: string;
  title: string;
  url: string;
  text: string;
  status: "unread" | "reading" | "completed";
  category: string;
  dueDate: Date;
  isPublic: boolean;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
  completedAt: Date;
}