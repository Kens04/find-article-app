import { getSession } from "@/utils/getSession";
import CompleteTodoListContent from "@/components/todo/complete-todo-list/complete-todo-list-content";
import { TodoStatus, type TodoList } from "@/components/todo/type";
import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";

export default async function CompletedTodoList() {
  const todos = await prisma.todo.findMany();
  const allTodos = todos || [];
  const completedTodos = allTodos.filter(
    (todo) => todo.status == TodoStatus.COMPLETED
  ) as TodoList[];
  const session = await getSession();
  const user = session?.user;
  if (!user) {
    return redirect("/login");
  }

  return <CompleteTodoListContent todos={completedTodos} session={session} />;
}
