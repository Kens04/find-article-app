import { getSession } from "@/components/hooks/useSession";
import { Todos } from "@/components/todo/action";
import TodoListContent from "@/components/todo/todo-list-content";
import { TodoStatus, type TodoList } from "@/components/todo/type";
import { Suspense } from "react";

const TodoList = async () => {
  try {
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
  } catch (error) {
    console.error("Error in TodoList:", error);
    return (
      <div>エラーが発生しました。しばらく経ってから再度お試しください。</div>
    );
  }
};

export default TodoList;
