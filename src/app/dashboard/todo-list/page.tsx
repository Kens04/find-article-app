import { getSession } from "@/components/hooks/useSession";
import TodoListContent from "@/components/todo/todo-list/todo-list-content";
import { TodoStatus, type TodoList } from "@/components/todo/type";
import { prisma } from "@/lib/db";
import { Suspense } from "react";

export default async function TodoList() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <TodoListInner />
    </Suspense>
  );
}

async function TodoListInner() {
  const session = await getSession();
  const todos = await prisma.todo.findMany();

  const allTodos = todos || [];
  const activeTodos = allTodos.filter(
    (todo) => todo.status !== TodoStatus.COMPLETED
  ) as TodoList[];

  return (
    <Suspense fallback={<div>Loading content...</div>}>
      <TodoListContent todos={activeTodos} session={session} />
    </Suspense>
  );
}
