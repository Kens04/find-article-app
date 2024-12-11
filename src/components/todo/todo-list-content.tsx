"use client";

import CategorySearch from "@/components/todo/category-search";
import DeleteButton from "@/components/todo/delete-button";
import StatusButton from "@/components/todo/status-button";
import { TodoStatus, type TodoList } from "@/components/todo/type";
import {
  Card,
  Text,
  Group,
  Badge,
  Stack,
  Title,
  Accordion,
  Anchor,
  Container,
} from "@mantine/core";

interface TodoListContentProps {
  todos: TodoList[];
  todosByCategory: { [key: string]: TodoList[] };
}

const TodoListContent = ({ todos, todosByCategory }: TodoListContentProps) => {
  // 完了以外のTODOでカテゴリごとにフィルタリング
  const activeTodosByCategory = Object.entries(todosByCategory).reduce(
    (acc, [category, todos]) => {
      const activeTodos = todos.filter(
        (todo) => todo.status !== TodoStatus.COMPLETED
      );
      if (activeTodos.length > 0) {
        acc[category] = activeTodos;
      }
      return acc;
    },
    {} as { [key: string]: TodoList[] }
  );

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
    <Container size="md" w="100%" mt="lg">
      <Title order={2} mb="md">
        TODOリスト
      </Title>
      <CategorySearch todos={todos} />
      <Accordion variant="separated" mt="md">
        {Object.entries(activeTodosByCategory).map(([category, categoryTodos]) => (
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
                        {getStatusLabel(todo.status)}
                      </Badge>
                    </Group>

                    <Text size="sm" c="dimmed" mb="md">
                      {todo.text}
                    </Text>

                    <StatusButton todo={todo} />

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
