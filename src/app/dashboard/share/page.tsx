import { getSession } from "@/components/hooks/useSession";
import { Todos } from "@/components/todo/action";
import ShareTodoListContent from "@/components/todo/share/share-todo-list-content";

import { type TodoList } from "@/components/todo/type";

export default async function Share() {
  const session = await getSession();
  const allTodos = (await Todos()) as TodoList[];
  const activeTodos = allTodos.filter((todo) => todo.isPublic);

  return (
    <ShareTodoListContent todos={activeTodos} session={session} />
  );
};