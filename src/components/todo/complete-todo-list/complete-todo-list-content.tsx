import { TodoList, TodoStatus } from "../type";
import { Container, Title } from "@mantine/core";
import { Session } from "@supabase/auth-helpers-nextjs";
import AuthGuard from "@/components/todo/components/auth-auard";
import CompleteTodoListTabs from "@/components/todo/complete-todo-list/complete-todo-list-tabs";

interface TodoListContentProps {
  todos: TodoList[];
  session: Session | null;
}

const CompleteTodoListContent = ({ todos, session }: TodoListContentProps) => {
  // 完了したTODOのみをフィルタリング
  const completedTodos = todos.filter(
    (todo) =>
      todo.status == TodoStatus.COMPLETED && todo.userId === session?.user?.id
  );

  return (
    <Container maw="100%" w="100%" mt="lg">
      <Title order={2} mb="md">
        完了リスト
      </Title>
      <AuthGuard todos={todos} session={session}>
        <CompleteTodoListTabs completedTodos={completedTodos} />
      </AuthGuard>
    </Container>
  );
};

export default CompleteTodoListContent;
