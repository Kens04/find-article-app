import { getSession } from "@/utils/getSession";
import TodoContent from "@/components/todo/todo/todo-content";
import { type TodoList } from "@/components/todo/type";
import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";

export default async function Todo() {
  const todos = await prisma.todo.findMany();
  const allTodos = todos || [];
  const activeTodos = allTodos.filter((todo) => todo.isToday) as TodoList[];
  const session = await getSession();
  const user = session?.user;
  if (!user) {
    return redirect("/login");
  }

  return <TodoContent todos={activeTodos} session={session} />;
}
