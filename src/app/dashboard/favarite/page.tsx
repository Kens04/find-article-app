import { getSession } from "@/components/hooks/useSession";
import FavariteTodoListContent from "@/components/todo/favarite/favarite-todo-list-content";
import { type TodoList } from "@/components/todo/type";
import { prisma } from "@/lib/db";

export default async function Favarite() {
  const todos = await prisma.todo.findMany();
  const allTodos = todos || [];
  const activeTodos = allTodos.filter((todo) => todo.isFavorite) as TodoList[];
  const session = await getSession();

  return (
    <>
      <FavariteTodoListContent todos={activeTodos} session={session} />
    </>
  );
}
