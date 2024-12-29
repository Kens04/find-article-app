import { getSession } from "@/components/hooks/useSession";
import CompleteTodoListContent from "@/components/todo/complete-todo-list-content";
import { TodoStatus, type TodoList } from "@/components/todo/type";
import { prisma } from "@/lib/db";

const CompletedTodoList = async () => {
  const session = await getSession();
  const todos = await prisma.todo.findMany();
  const allTodos = todos || [];
  const completedTodos = allTodos.filter(
    (todo) => todo.status == TodoStatus.COMPLETED
  ) as TodoList[];
  return (
    <>
      <CompleteTodoListContent todos={completedTodos} session={session} />
    </>
  );
};

export default CompletedTodoList;
