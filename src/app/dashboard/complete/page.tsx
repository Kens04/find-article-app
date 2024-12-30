import { getSession } from "@/components/hooks/useSession";
import CompleteTodoListContent from "@/components/todo/complete-todo-list/complete-todo-list-content";
import { TodoStatus, type TodoList } from "@/components/todo/type";
import { prisma } from "@/lib/db";
import { Suspense } from "react";

export default async function CompletedTodoList() {
  const todos = await prisma.todo.findMany();
  const allTodos = todos || [];
  const completedTodos = allTodos.filter(
    (todo) => todo.status == TodoStatus.COMPLETED
  ) as TodoList[];
  const session = await getSession();

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CompleteTodoListContent todos={completedTodos} session={session} />
    </Suspense>
  );
};
