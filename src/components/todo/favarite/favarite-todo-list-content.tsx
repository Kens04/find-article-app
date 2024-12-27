"use client";

import {
  handleDeleteClick,
  handleFavorite,
  handleShareClick,
} from "@/components/todo/action";
import CategorySearch from "@/components/todo/category-search";
import AuthGuard from "@/components/todo/components/auth-auard";
import { PAGINATION } from "@/components/todo/pagination";
import { type TodoList } from "@/components/todo/type";
import {
  Text,
  Group,
  Title,
  Anchor,
  Container,
  Table,
  Menu,
  ActionIcon,
  Pagination,
} from "@mantine/core";
import { usePagination } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import { Session } from "@supabase/auth-helpers-nextjs";
import {
  IconDots,
  IconEye,
  IconShare,
  IconStar,
  IconStarFilled,
  IconTrash,
} from "@tabler/icons-react";
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
  const pagination = usePagination({
    total: Math.ceil(todos.length / PAGINATION.ITEMS_PER_PAGE),
    initialPage: 1,
  });

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

  const start = (pagination.active - 1) * PAGINATION.ITEMS_PER_PAGE;
  const end = start + PAGINATION.ITEMS_PER_PAGE;
  const paginatedTodos = filteredTodos.slice(start, end);

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
    } catch (error) {
      console.error("favorite update failed:", error);
    }
  };

  return (
    <Container maw="100%" w="100%" mt="lg">
      <Title order={2} mb="md">
        お気に入り
      </Title>
      <AuthGuard todos={todos} session={session}>
        <CategorySearch
          todos={filteredTodos}
          selectedCategories={selectedCategories}
          onCategoryChange={setSelectedCategories}
          label="お気に入り"
        />
        <Table.ScrollContainer
          minWidth={1000}
          w="100%"
          maw="100%"
          type="native"
        >
          <Table highlightOnHover mt="md">
            <Table.Thead>
              <Table.Tr>
                <Table.Th>タイトル</Table.Th>
                <Table.Th>URL</Table.Th>
                <Table.Th>カテゴリ</Table.Th>
                <Table.Th style={{ textAlign: "center" }}>アクション</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {paginatedTodos.map((todo) => (
                <Table.Tr key={todo.id}>
                  <Table.Td>
                    <Text>{todo.title}</Text>
                  </Table.Td>
                  <Table.Td>
                    <Anchor
                      href={todo.url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Text lineClamp={1} size="sm">
                        {todo.url}
                      </Text>
                    </Anchor>
                  </Table.Td>
                  <Table.Td>{todo.category || "未分類"}</Table.Td>
                  <Table.Td>
                    <Group justify="center">
                      <Menu shadow="md" width={200}>
                        <Menu.Target>
                          <ActionIcon variant="subtle">
                            <IconDots size={16} />
                          </ActionIcon>
                        </Menu.Target>

                        <Menu.Dropdown>
                          <Menu.Label>アクション</Menu.Label>

                          <Menu.Item
                            component={Link}
                            href={`/dashboard/todo-list/${todo.id}`}
                            leftSection={<IconEye size={16} />}
                          >
                            詳細を表示
                          </Menu.Item>

                          <Menu.Item
                            onClick={() =>
                              handleFavoriteClick(todo.id, todo.isFavorite)
                            }
                            leftSection={
                              todo.isFavorite ? (
                                <IconStarFilled size={16} color="orange" />
                              ) : (
                                <IconStar size={16} />
                              )
                            }
                          >
                            {todo.isFavorite
                              ? "お気に入りから削除"
                              : "お気に入りに追加"}
                          </Menu.Item>

                          <Menu.Item
                            onClick={() =>
                              handleShareClick(
                                router,
                                todo.id,
                                todo.isPublic,
                                todo.sharedAt
                              )
                            }
                            leftSection={<IconShare size={16} />}
                          >
                            {todo.isPublic ? "共有を解除" : "共有する"}
                          </Menu.Item>

                          <Menu.Divider />

                          <Menu.Item
                            color="red"
                            leftSection={<IconTrash size={16} />}
                            onClick={() => handleDeleteClick(router, todo.id)}
                          >
                            削除
                          </Menu.Item>
                        </Menu.Dropdown>
                      </Menu>
                    </Group>
                  </Table.Td>
                </Table.Tr>
              ))}
            </Table.Tbody>
          </Table>
        </Table.ScrollContainer>
        {filteredTodos.length > PAGINATION.ITEMS_PER_PAGE && (
          <Group justify="center" mt="md">
            <Pagination
              value={pagination.active}
              onChange={pagination.setPage}
              total={Math.ceil(
                filteredTodos.length / PAGINATION.ITEMS_PER_PAGE
              )}
              siblings={PAGINATION.SIBLINGS}
            />
          </Group>
        )}
      </AuthGuard>
    </Container>
  );
};

export default FavariteTodoListContent;
