import ShareTodoListTable from "@/components/todo/share/share-todo-list-table";
import { type TodoList } from "@/components/todo/type";
import { Title, Container } from "@mantine/core";
import { Session } from "@supabase/auth-helpers-nextjs";

const ShareTodoListContent = ({
  todos,
  session,
}: {
  todos: TodoList[];
  session: Session | null;
}) => {
  return (
    <Container maw="100%" w="100%" mt="lg">
      <Title order={2} mb="md">
        全体共有
      </Title>
      <ShareTodoListTable todos={todos} session={session} />
    </Container>
  );
};

export default ShareTodoListContent;
