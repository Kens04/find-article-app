"use client";

import { useEffect, useState } from "react";
import { TodoList, TodoStatus } from "./type";
import { Todos } from "./action";
import {
  Container,
  Title,
  Card,
  Text,
  Group,
  Badge,
  Stack,
  Anchor,
} from "@mantine/core";

const CompleteTodoList = () => {
  const [completedTodos, setCompletedTodos] = useState<TodoList[]>([]);

  useEffect(() => {
    const fetchCompletedTodos = async () => {
      try {
        const todos = await Todos();
        // COMPLETEDステータスのTODOのみをフィルタリング
        const completed = todos.filter(
          (todo: TodoList) => todo.status === TodoStatus.COMPLETED
        );
        setCompletedTodos(completed);
      } catch (error) {
        console.error("Failed to fetch completed todos:", error);
      }
    };

    fetchCompletedTodos();
  }, []);

  // ステータスを日本語に変換する関数
  const getStatusLabel = (status: TodoStatus) => {
    switch (status) {
      case TodoStatus.COMPLETED:
        return "完了";
      default:
        return status;
    }
  };

  return (
    <Container size="md" w="100%" mt="lg">
      <Title order={2} mb="md">
        完了リスト
      </Title>
      <Stack gap="md">
        {completedTodos.map((todo: TodoList) => (
          <Card key={todo.id} shadow="sm" padding="lg" radius="md" withBorder>
            <Group justify="space-between" mb="xs">
              <Text fw={500} size="lg">
                {todo.title}
              </Text>
              <Badge variant="light" color="green">
                {getStatusLabel(todo.status)}
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
                完了日:{" "}
                {todo.completedAt
                  ? new Date(todo.completedAt).toLocaleDateString()
                  : "未設定"}
              </Text>
            </Group>
          </Card>
        ))}
      </Stack>
    </Container>
  );
};

export default CompleteTodoList;
