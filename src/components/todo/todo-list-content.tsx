"use client"

import CategorySearch from "@/components/todo/category-search";
import DeleteButton from "@/components/todo/delete-button";
import { type TodoList } from "@/components/todo/type";
import {
  Card,
  Text,
  Group,
  Badge,
  Stack,
  Title,
  Accordion,
  Button,
  Anchor,
  Container,
} from "@mantine/core";

interface TodoListContentProps {
  todos: TodoList[];
  todosByCategory: { [key: string]: TodoList[] };
}

const TodoListContent = async ({todos, todosByCategory}: TodoListContentProps) => {

  // ステータスに応じた色を返す関数
  const getStatusColor = (status: TodoList["status"]) => {
    switch (status) {
      case "unread":
        return "red";
      case "reading":
        return "yellow";
      case "completed":
        return "green";
      default:
        return "gray";
    }
  };

  // ステータス変更ボタンを表示するかどうかを判定する関数
  // const showStatusChangeButton = (status: TodoList["status"]) => {
  //   switch (status) {
  //     case "unread":
  //       return "reading";
  //     case "reading":
  //       return "completed";
  //     default:
  //       return null;
  //   }
  // };

  return (
    <Container size="md" w="100%" mt="lg">
      <Title order={2} mb="md">
        TODOリスト
      </Title>
      <CategorySearch todos={todos} />
      <Accordion variant="separated">
        {Object.entries(todosByCategory).map(([category, categoryTodos]) => (
          <Accordion.Item key={category} value={category}>
            <Accordion.Control>
              <Group justify="space-between">
                <Text fw={500}>{category}</Text>
                <Badge size="sm" variant="light">
                  {categoryTodos.length} タスク
                </Badge>
              </Group>
            </Accordion.Control>
            <Accordion.Panel>
              <Stack gap="md">
                {categoryTodos.map((todo: TodoList) => (
                  <Card
                    key={todo.id}
                    shadow="sm"
                    padding="lg"
                    radius="md"
                    withBorder
                  >
                    <Group justify="space-between" mb="xs">
                      <Text fw={500} size="lg">
                        {todo.title}
                      </Text>
                      <Badge
                        color={getStatusColor(todo.status)}
                        variant="light"
                      >
                        {todo.status}
                      </Badge>
                    </Group>

                    <Text size="sm" c="dimmed" mb="md">
                      {todo.text}
                    </Text>

                    <Anchor
                      href={todo.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      size="sm"
                      mb="md"
                    >
                      {todo.url}
                    </Anchor>

                    <Group justify="space-between" align="center">
                      <Text size="xs" c="dimmed">
                        締切日: {new Date(todo.dueDate).toLocaleDateString()}
                      </Text>
                      <DeleteButton id={todo.id} />

                      {/* {showStatusChangeButton(todo.status) && (
                        <Button
                          variant="light"
                          size="xs"
                          rightSection={<IconArrowRight size={14} />}
                          onClick={async () => {
                            const nextStatus = showStatusChangeButton(
                              todo.status
                            );
                            if (!nextStatus) return;

                            await fetch(
                              `${process.env.NEXT_PUBLIC_APP_URL}/api/todos/${todo.id}`,
                              {
                                method: "PATCH",
                                headers: { "Content-Type": "application/json" },
                                body: JSON.stringify({ status: nextStatus }),
                              }
                            );
                            // TODO: 状態を更新した後にリロードまたは再フェッチする処理を追加
                          }}
                        >
                          Mark as {showStatusChangeButton(todo.status)}
                        </Button>
                      )} */}
                    </Group>
                  </Card>
                ))}
              </Stack>
            </Accordion.Panel>
          </Accordion.Item>
        ))}
      </Accordion>
    </Container>
  );
};

export default TodoListContent;