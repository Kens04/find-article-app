import TopDashboardContent from "@/components/dashboard/top-dashboard-content";
import { getSession } from "@/components/hooks/useSession";
import { Todos } from "@/components/todo/action";
import { type TodoList } from "@/components/todo/type";
import { Suspense } from "react";

export default async function Dashboard() {
  const todos: TodoList[] = await Todos();
  const allTodos = todos || [];
  const session = await getSession();

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <TopDashboardContent todos={allTodos} session={session} />
    </Suspense>
  );
}