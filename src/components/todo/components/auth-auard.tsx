import { TodoList } from "@/components/todo/type";
import { Button, Flex, Text } from "@mantine/core";
import { Session } from "@supabase/auth-helpers-nextjs";
import Link from "next/link";
interface AuthGuardProps {
  todos: TodoList[];
  session: Session | null;
  children: React.ReactNode;
}

const AuthGuard = ({ todos, session, children }: AuthGuardProps) => {
  const user = session?.user;
  const userTodos = todos.filter(todo => todo.userId === user?.id);
  if (userTodos.length === 0) {
    return (
      <Flex mt="xl" justify="center" align="center" direction="column" gap="md">
        <Text size="xl">TODOの作成してください。</Text>
        <Button component={Link} href="/dashboard/create-todo">
          TODO作成
        </Button>
      </Flex>
    );
  }

  return <>{children}</>;
};

export default AuthGuard;
