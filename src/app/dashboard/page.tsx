import TopDashboardContent from "@/components/dashboard/top-dashboard-content";
import { getSession } from "@/components/hooks/useSession";
import { type TodoList } from "@/components/todo/type";
import { prisma } from "@/lib/db";
import { Suspense } from "react";

export default async function Dashboard() {
  const todos = await prisma.todo.findMany();
  const allTodos = todos as TodoList[];
  const session = await getSession();

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <TopDashboardContent todos={allTodos} session={session} />
    </Suspense>
  );
}