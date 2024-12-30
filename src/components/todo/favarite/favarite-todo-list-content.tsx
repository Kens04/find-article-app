import AuthGuard from "@/components/todo/components/auth-auard";
import FavariteTodoListTabs from "@/components/todo/favarite/favarite-todo-list-tabs";
import { type TodoList } from "@/components/todo/type";
import {
  Title,
  Container,
} from "@mantine/core";
import { Session } from "@supabase/auth-helpers-nextjs";

const FavariteTodoListContent = ({
  todos,
  session,
}: {
  todos: TodoList[];
  session: Session | null;
}) => {

  // お気に入りのTODOのみをフィルタリング
  const favariteTodos = todos.filter(
    (todo) => todo.isFavorite && todo.userId === session?.user?.id
  );

  return (
    <Container maw="100%" w="100%" mt="lg">
      <Title order={2} mb="md">
        お気に入り
      </Title>
      <AuthGuard todos={todos} session={session}>
        <FavariteTodoListTabs favariteTodos={favariteTodos} />
      </AuthGuard>
    </Container>
  );
};

export default FavariteTodoListContent;
