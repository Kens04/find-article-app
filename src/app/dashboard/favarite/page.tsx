import { getSession } from "@/components/hooks/useSession";
import { Todos } from "@/components/todo/action";
import FavariteTodoListContent from "@/components/todo/favarite/favarite-todo-list-content";

import { type TodoList } from "@/components/todo/type";

export default async function Favarite() {
  const allTodos = (await Todos()) as TodoList[];
  const activeTodos = allTodos.filter((todo) => todo.isFavorite);
  const session = await getSession();

  return (
    <FavariteTodoListContent todos={activeTodos} session={session} />
  );
};