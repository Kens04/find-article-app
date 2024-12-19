import { Todos } from "@/components/todo/action";
import ShareTodoListContent from "@/components/todo/share/share-todo-list-content";

import { type TodoList } from "@/components/todo/type";

const ShareTodoList = async () => {
  const allTodos = (await Todos()) as TodoList[];
  const activeTodos = allTodos.filter((todo) => todo.isPublic);

  return (
    <ShareTodoListContent todos={activeTodos} />
  );
};

export default ShareTodoList;
