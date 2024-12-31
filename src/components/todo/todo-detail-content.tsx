import { TodoStatus, type TodoList } from "@/components/todo/type";
import {
  Container,
  Title,
  Group,
  Badge,
  Text,
  Anchor,
  Stack,
  Flex,
  Card,
  TypographyStylesProvider,
  Button,
} from "@mantine/core";
import Link from "next/link";

const TodoDetailContent = ({ todo }: { todo: TodoList }) => {
  const text = todo.text;
  // ステータスを日本語に変換する関数
  const getStatusLabel = (status: TodoStatus) => {
    switch (status) {
      case TodoStatus.UNREAD:
        return "未読";
      case TodoStatus.READING:
        return "読書中";
      case TodoStatus.COMPLETED:
        return "完了";
      default:
        return status;
    }
  };

  // ステータスに応じた色を返す関数
  const getStatusColor = (status: TodoStatus) => {
    switch (status) {
      case TodoStatus.UNREAD:
        return "red";
      case TodoStatus.READING:
        return "yellow";
      case TodoStatus.COMPLETED:
        return "green";
      default:
        return "gray";
    }
  };

  return (
    <Container maw="100%" w="100%" mt="lg">
      <Stack>
        <Group>
          <Title order={2}>{todo.title}</Title>
          <Badge size="lg" color={getStatusColor(todo.status)} variant="light">
            {getStatusLabel(todo.status)}
          </Badge>
        </Group>

        <Stack>
          <Flex>
            <Text>URL：</Text>
            <Anchor
              href={todo.url}
              target="_blank"
              rel="noopener noreferrer"
              size="lg"
            >
              {todo.url}
            </Anchor>
          </Flex>
          {/* <TodoDetailText todo={todo} /> */}
          <Card key={todo.id} shadow="sm" padding="md" radius="md" withBorder>
            <TypographyStylesProvider>
              <div dangerouslySetInnerHTML={{ __html: text }} />
            </TypographyStylesProvider>
          </Card>
          <Group justify="center" mt="lg">
            <Button
              component={Link}
              href={`/dashboard/todo-list/edit/${todo.id}`}
              fullWidth
              maw={300}
            >
              編集する
            </Button>
          </Group>
        </Stack>
      </Stack>
    </Container>
  );
};

export default TodoDetailContent;
