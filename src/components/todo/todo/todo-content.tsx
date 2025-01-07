import { TodoStatus, type TodoList } from "@/components/todo/type";
import { Container, Title } from "@mantine/core";
import { Session } from "@supabase/auth-helpers-nextjs";
import AuthGuard from "@/components/todo/components/auth-auard";
import TodoTabs from "@/components/todo/todo/todo-tabs";

const TodoContent = ({
  todos,
  session,
}: {
  todos: TodoList[];
  session: Session | null;
}) => {
  const unreadTodos = todos.filter((todo) => {
    return (
      todo.status === TodoStatus.UNREAD && todo.userId === session?.user?.id
    );
  });

  const readingTodos = todos.filter(
    (todo) =>
      todo.status === TodoStatus.READING && todo.userId === session?.user?.id
  );

  // 本日のTODOのみをフィルタリング
  const TodayTodos = todos.filter(
    (todo) => todo.isToday && todo.userId === session?.user?.id
  );

  return (
    <Container maw="100%" w="100%" mt="lg">
      <Title order={2} mb="md">
        本日のTODO
      </Title>
      <AuthGuard todos={todos} session={session}>
        <TodoTabs unreadTodos={unreadTodos} readingTodos={readingTodos} TodayTodos={TodayTodos} />
      </AuthGuard>
    </Container>
  );
};

export default TodoContent;
