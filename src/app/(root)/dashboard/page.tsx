import TopDashboardContent from "@/components/dashboard/top-dashboard-content";
import { getSession } from "@/utils/getSession";
import { type TodoList } from "@/components/todo/type";
import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";

export default async function Dashboard() {
  const todos = await prisma.todo.findMany();
  const allTodos = todos as TodoList[];
  const session = await getSession();
  const user = session?.user;
  if (!user) {
    return redirect("/login");
  }

  return <TopDashboardContent todos={allTodos} session={session} />;
}
