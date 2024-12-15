import TopDashboardContent from "@/components/dashboard/top-dashboard-content";
import { Todos } from "@/components/todo/action";
import { type TodoList } from "@/components/todo/type";

const TopDashboard = async () => {
  const allTodos = (await Todos()) as TodoList[];

  return <TopDashboardContent todos={allTodos} />;
};

export default TopDashboard;
