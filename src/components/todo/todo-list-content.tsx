"use client";

import CategorySearch from "@/components/todo/category-search";
import AuthGuard from "@/components/todo/components/auth-auard";
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
  Button,
  Flex,
} from "@mantine/core";
import { Session } from "@supabase/auth-helpers-nextjs";
import Link from "next/link";
import { useState } from "react";

const TodoListContent = ({
  todos,
  session,
}: {
  todos: TodoList[];
  session: Session | null;
}) => {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  // 未完了のTODOのみをフィルタリング
  const activeTodos = todos.filter(
    (todo) =>
      todo.status !== TodoStatus.COMPLETED && todo.userId === session?.user?.id
  );

  // 表示するTODOをフィルタリング
  const filteredTodos =
    selectedCategories.length === 0
      ? activeTodos // カテゴリ未選択時は全て表示
      : activeTodos.filter((todo) =>
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
      case TodoStatus.UNREAD:
        return "未読";
      case TodoStatus.READING:
        return "読書中";
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
      <AuthGuard todos={todos} session={session}>
        <CategorySearch
          todos={activeTodos}
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
                        <Badge
                          color={getStatusColor(todo.status)}
                          variant="light"
                        >
                          {getStatusLabel(todo.status)}
                        </Badge>
                      </Group>

                      <StatusButton todo={todo} />

                      <Flex justify="space-between" align="center">
                        <Group gap="xs">
                          <Text>URL：</Text>
                          <Anchor
                            href={todo.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            size="md"
                          >
                            {todo.url}
                          </Anchor>
                        </Group>
                        <Text size="xs" c="dimmed">
                          締切日: {new Date(todo.dueDate).toLocaleDateString()}
                        </Text>
                      </Flex>

                      <Group justify="flex-end" align="center" mt="xs">
                        <Button
                          component={Link}
                          href={`/dashboard/todo-list/${todo.id}`}
                        >
                          詳細
                        </Button>
                        <DeleteButton id={todo.id} />
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

export default TodoListContent;
