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
  userId: string;
  createdAt: Date;
  updatedAt: Date;
  completedAt: Date;
}