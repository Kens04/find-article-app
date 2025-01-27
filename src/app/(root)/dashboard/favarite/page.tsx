import { getSession } from "@/utils/getSession";
import FavariteTodoListContent from "@/components/todo/favarite/favarite-todo-list-content";
import { type TodoList } from "@/components/todo/type";
import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";

export default async function Favarite() {
  const todos = await prisma.todo.findMany();
  const allTodos = todos || [];
  const activeTodos = allTodos.filter((todo) => todo.isFavorite) as TodoList[];
  const session = await getSession();
  const user = session?.user;
  if (!user) {
    return redirect("/login");
  }

  return <FavariteTodoListContent todos={activeTodos} session={session} />;
}
