import { TodoStatus, type TodoList } from "@/components/todo/type";
import { Container, Title } from "@mantine/core";
import { Session } from "@supabase/auth-helpers-nextjs";
import AuthGuard from "@/components/todo/components/auth-auard";
import TodoListTabs from "@/components/todo/todo-list/todo-list-tabs";

const TodoListContent = ({
  todos,
  session,
}: {
  todos: TodoList[];
  session: Session | null;
}) => {
  const unreadTodos = todos.filter((todo) => {
    return (
      todo.status === TodoStatus.UNREAD &&
      todo.isToday === false &&
      todo.userId === session?.user?.id
    );
  });

  const readingTodos = todos.filter(
    (todo) =>
      todo.status === TodoStatus.READING &&
      todo.isToday === false &&
      todo.userId === session?.user?.id
  );

  return (
    <Container maw="100%" w="100%" mt="lg">
      <Title order={2} mb="md">
        TODOリスト
      </Title>
      <AuthGuard todos={todos} session={session}>
        <TodoListTabs unreadTodos={unreadTodos} readingTodos={readingTodos} />
      </AuthGuard>
    </Container>
  );
};

export default TodoListContent;
