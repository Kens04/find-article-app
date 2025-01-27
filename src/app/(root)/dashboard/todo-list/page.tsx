import { getSession } from "@/utils/getSession";
import TodoListContent from "@/components/todo/todo-list/todo-list-content";
import { TodoStatus, type TodoList } from "@/components/todo/type";
import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";

export default async function TodoList() {
  return <TodoListInner />;
}

async function TodoListInner() {
  const session = await getSession();
  const todos = await prisma.todo.findMany();
  const user = session?.user;
  if (!user) {
    return redirect("/login");
  }

  const allTodos = todos || [];
  const activeTodos = allTodos.filter(
    (todo) => todo.status !== TodoStatus.COMPLETED
  ) as TodoList[];

  return <TodoListContent todos={activeTodos} session={session} />;
}
