import { getSession } from "@/components/hooks/useSession";
import ShareTodoListContent from "@/components/todo/share/share-todo-list-content";
import { type TodoList } from "@/components/todo/type";
import { prisma } from "@/lib/db";
import { Suspense } from "react";

export default async function Share() {
  const session = await getSession();
  const todos = await prisma.todo.findMany();
  const allTodos = todos || [];
  const activeTodos = allTodos.filter((todo) => todo.isPublic) as TodoList[];
  const user = await prisma.user.findMany();
  const likes = await prisma.likes.findMany();

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ShareTodoListContent
        todos={activeTodos}
        session={session}
        user={user}
        likes={likes}
      />
    </Suspense>
  );
}
