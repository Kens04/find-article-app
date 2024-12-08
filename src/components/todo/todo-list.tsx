import { Todos } from "@/components/todo/action";
import TodoListContent from "@/components/todo/todo-list-content";
import { type TodoList } from "@/components/todo/type";

const TodoList = async () => {
  const todos = await Todos();

  // カテゴリでグループ化
  const todosByCategory = todos.reduce(
    (acc: { [key: string]: TodoList[] }, todo: TodoList) => {
      if (!acc[todo.category]) {
        acc[todo.category] = [];
      }
      acc[todo.category].push(todo);
      return acc;
    },
    {}
  );

  return (
    <TodoListContent todos={todos} todosByCategory={todosByCategory} />
  );
};

export default TodoList;
