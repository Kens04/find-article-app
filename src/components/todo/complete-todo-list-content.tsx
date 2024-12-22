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
  Flex,
  Button,
  UnstyledButton,
} from "@mantine/core";
import CategorySearch from "@/components/todo/category-search";
import { Session } from "@supabase/auth-helpers-nextjs";
import AuthGuard from "@/components/todo/components/auth-auard";
import Link from "next/link";
import DeleteButton from "@/components/todo/delete-button";
import { IconStar, IconStarFilled } from "@tabler/icons-react";
import { handleFavorite } from "@/components/todo/action";
import { notifications } from "@mantine/notifications";
import { useRouter } from "next/navigation";

interface TodoListContentProps {
  todos: TodoList[];
  session: Session | null;
}

const CompleteTodoListContent = ({ todos, session }: TodoListContentProps) => {
  const router = useRouter();
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

  const handleFavoriteClick = async (id: string, isFavorite: boolean) => {
    try {
      await handleFavorite({
        id: id,
        isFavorite: !isFavorite,
      });
      notifications.show({
        title: !isFavorite ? "お気に入りに追加" : "お気に入りから削除",
        message: !isFavorite
          ? "お気に入りに追加しました"
          : "お気に入りから削除しました",
        color: !isFavorite ? "yellow" : "gray",
      });
      router.refresh();
    } catch (error) {
      console.error("favorite update failed:", error);
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
                      <Flex align="center" gap="xs" wrap="wrap">
                          <Text fw={700} size="lg">
                            {todo.title}
                          </Text>
                          <UnstyledButton
                            onClick={() =>
                              handleFavoriteClick(todo.id, todo.isFavorite)
                            }
                          >
                            {todo.isFavorite ? (
                              <IconStarFilled size={16} color="orange" />
                            ) : (
                              <IconStar size={16} />
                            )}
                          </UnstyledButton>
                        </Flex>
                        <Badge variant="light" color="green">
                          {getStatusLabel(todo.status)}
                        </Badge>
                      </Group>

                      <Flex justify="space-between" align="center" gap="xs" wrap="wrap">
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
                          完了日:{" "}
                          {todo.completedAt
                            ? new Date(todo.completedAt).toLocaleDateString()
                            : "未設定"}
                        </Text>
                      </Flex>

                      <Group justify="flex-end" align="center" mt="xs">
                        <Button
                          component={Link}
                          href={`/dashboard/todo-list/${todo.id}`}
                        >
                          詳細ページへ
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

export default CompleteTodoListContent;
