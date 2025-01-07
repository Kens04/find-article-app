import { getSession } from "@/components/hooks/useSession";
import TodoContent from "@/components/todo/todo/todo-content";
import { type TodoList } from "@/components/todo/type";
import { prisma } from "@/lib/db";
import { Suspense } from "react";

export default async function Todo() {
  const todos = await prisma.todo.findMany();
  const allTodos = todos || [];
  const activeTodos = allTodos.filter((todo) => todo.isToday) as TodoList[];
  const session = await getSession();
  return (
    <Suspense fallback={<div>Loading content...</div>}>
      <TodoContent todos={activeTodos} session={session} />
    </Suspense>
  );
}
