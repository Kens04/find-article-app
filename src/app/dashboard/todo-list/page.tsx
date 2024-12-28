import { getSession } from "@/components/hooks/useSession";
import { Todos } from "@/components/todo/action";
import TodoListContent from "@/components/todo/todo-list-content";
import { TodoStatus, type TodoList } from "@/components/todo/type";
import { Suspense } from "react";

const TodoList = async () => {
  const todos = await Todos();
  const allTodos = todos || [];
  const activeTodos = allTodos.filter(
    (todo: TodoList) => todo.status !== TodoStatus.COMPLETED
  );
  const session = await getSession();

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <TodoListContent todos={activeTodos} session={session} />
    </Suspense>
  );
};

export default TodoList;
