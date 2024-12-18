"use client";

import { useState } from "react";
import { TodoList, TodoStatus } from "./type";
import {
  Container,
  Title,
  Card,
  Text,
  Group,
  Badge,
  Stack,
  Anchor,
  Accordion,
} from "@mantine/core";
import CategorySearch from "@/components/todo/category-search";
import { Session } from "@supabase/auth-helpers-nextjs";
import AuthGuard from "@/components/todo/components/auth-auard";

interface TodoListContentProps {
  todos: TodoList[];
  session: Session | null;
}

const CompleteTodoListContent = ({ todos, session }: TodoListContentProps) => {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  // 完了したTODOのみをフィルタリング
  const uncompletedTodos = todos.filter(
    (todo) =>
      todo.status == TodoStatus.COMPLETED && todo.userId === session?.user?.id
  );

  // 表示するTODOをフィルタリング
  const filteredTodos =
    selectedCategories.length === 0
      ? uncompletedTodos // カテゴリ未選択時は全て表示
      : uncompletedTodos.filter((todo) =>
          selectedCategories.includes(todo.category || "")
        );

  // カテゴリごとにTODOをグループ化
  const todosByCategory = filteredTodos.reduce((groups, todo) => {
    const category = todo.category || "";
    return {
      ...groups,
      [category]: [...(groups[category] || []), todo],
    };
  }, {} as Record<string, TodoList[]>);

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
      <AuthGuard todos={todos} session={session}>
        <CategorySearch
          todos={todos}
          selectedCategories={selectedCategories}
          onCategoryChange={setSelectedCategories}
        />
        <Accordion variant="separated" mt="md">
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
              </Accordion.Panel>
            </Accordion.Item>
          ))}
        </Accordion>
      </AuthGuard>
    </Container>
  );
};

export default CompleteTodoListContent;
