import { getSession } from "@/components/hooks/useSession";
import ShareTodoListContent from "@/components/todo/share/share-todo-list-content";
import { type TodoList } from "@/components/todo/type";
import { prisma } from "@/lib/db";

export default async function Share() {
  const session = await getSession();
  const todos = await prisma.todo.findMany();
  const allTodos = todos || [];
  const activeTodos = allTodos.filter((todo) => todo.isPublic) as TodoList[];

  return (
    <>
      <ShareTodoListContent todos={activeTodos} session={session} />
    </>
  );
}
