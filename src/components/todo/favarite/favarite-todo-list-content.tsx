"use client";

import { handleFavorite } from "@/components/todo/action";
import CategorySearch from "@/components/todo/category-search";
import AuthGuard from "@/components/todo/components/auth-auard";
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
  Anchor,
  Container,
  Button,
  Flex,
  UnstyledButton,
} from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { Session } from "@supabase/auth-helpers-nextjs";
import { IconStar, IconStarFilled } from "@tabler/icons-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

const FavariteTodoListContent = ({
  todos,
  session,
}: {
  todos: TodoList[];
  session: Session | null;
}) => {
  const router = useRouter();
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  // お気に入りのTODOのみをフィルタリング
  const favariteTodos = todos.filter(
    (todo) => todo.isFavorite && todo.userId === session?.user?.id
  );

  // 表示するTODOをフィルタリング
  const filteredTodos =
    selectedCategories.length === 0
      ? favariteTodos // カテゴリ未選択時は全て表示
      : favariteTodos.filter((todo) =>
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
        お気に入り
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
                      </Flex>

                      <Group justify="flex-end" align="center">
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

export default FavariteTodoListContent;
