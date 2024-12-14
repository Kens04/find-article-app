import { Todos } from "@/components/todo/action";
import TodoListContent from "@/components/todo/todo-list-content";
import { TodoStatus, type TodoList } from "@/components/todo/type";

const TodoList = async () => {
  const allTodos = (await Todos()) as TodoList[];
  const activeTodos = allTodos.filter((todo) => todo.status !== TodoStatus.COMPLETED);

  return (
    <TodoListContent todos={activeTodos} />
  );
};

export default TodoList;
