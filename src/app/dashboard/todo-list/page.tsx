import { getSession } from "@/components/hooks/useSession";
import TodoListContent from "@/components/todo/todo-list-content";
import { TodoStatus, type TodoList } from "@/components/todo/type";
import { prisma } from "@/lib/db";
import { Suspense } from "react";

const TodoList = async () => {
  const todos = await prisma.todo.findMany();
  const allTodos = todos || [];
  const activeTodos = allTodos.filter(
    (todo) => todo.status !== TodoStatus.COMPLETED
  ) as TodoList[];
  const session = await getSession();

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <TodoListContent todos={activeTodos} session={session} />
    </Suspense>
  );
};

export default TodoList;
