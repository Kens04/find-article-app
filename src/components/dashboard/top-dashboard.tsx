import TopDashboardContent from "@/components/dashboard/top-dashboard-content";
import { getSession } from "@/components/hooks/useSession";
import { Todos } from "@/components/todo/action";
import { type TodoList } from "@/components/todo/type";

const TopDashboard = async () => {
  const allTodos = (await Todos()) as TodoList[];
  const session = await getSession();

  return <TopDashboardContent todos={allTodos} session={session} />;
};

export default TopDashboard;
