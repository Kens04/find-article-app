import { Todos } from "@/components/todo/action";
import CompleteTodoListContent from "@/components/todo/complete-todo-list-content";
import { TodoStatus, type TodoList } from "@/components/todo/type";

const CompletedTodoList = async () => {
  const allTodos = (await Todos()) as TodoList[];
  const completedTodos = allTodos.filter((todo) => todo.status == TodoStatus.COMPLETED);
  return (
    <>
      <CompleteTodoListContent todos={completedTodos} />
    </>
  );
}

export default CompletedTodoList;