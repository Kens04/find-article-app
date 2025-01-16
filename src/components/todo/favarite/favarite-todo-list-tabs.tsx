"use client";

import {
  handleDeleteClick,
  handleFavorite,
  handleShareClick,
  handleToday,
} from "@/components/todo/action";
import CategorySearch from "@/components/todo/category-search";
import { PAGINATION } from "@/components/todo/pagination";
import { type TodoList } from "@/components/todo/type";
import {
  Text,
  Group,
  Anchor,
  Table,
  Menu,
  ActionIcon,
  Pagination,
  Input,
  Flex,
  Button,
} from "@mantine/core";
import { usePagination } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import {
  IconCalendar,
  IconCalendarFilled,
  IconDots,
  IconEdit,
  IconEye,
  IconShare,
  IconStar,
  IconStarFilled,
  IconTrash,
} from "@tabler/icons-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useQueryState } from "nuqs";

const FavariteTodoListTabs = ({
  favariteTodos,
}: {
  favariteTodos: TodoList[];
}) => {
  const router = useRouter();
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [search, setSearch] = useQueryState("search");
  const pagination = usePagination({
    total: Math.ceil(favariteTodos.length / PAGINATION.ITEMS_PER_PAGE),
    initialPage: 1,
  });

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

  const handleTodayClick = async (id: string, isToday: boolean) => {
    try {
      await handleToday({
        id: id,
        isToday: !isToday,
      });
      notifications.show({
        title: !isToday ? "本日のTODOに追加" : "本日のTODOから削除",
        message: !isToday
          ? "本日のTODOに追加しました"
          : "本日のTODOから削除しました",
        color: !isToday ? "yellow" : "gray",
      });
      router.refresh();
    } catch (error) {
      console.error("today update failed:", error);
    }
  };

  const favariteFiltered = favariteTodos.filter((todo) =>
    todo.title.toLowerCase().includes(search?.toLowerCase() || "")
  );

  const displayFavariteTodos = search ? favariteFiltered : paginatedTodos;
  const paginatedFavarite = search ? favariteFiltered : filteredTodos;

  return (
    <>
      <Group mt="md">
        <CategorySearch
          todos={filteredTodos}
          selectedCategories={selectedCategories}
          onCategoryChange={setSelectedCategories}
          label="お気に入り"
        />
        <Input.Wrapper label="TODOを検索">
          <Flex gap="xs">
            <Input
              placeholder="検索"
              value={search || ""}
              onChange={(e) => setSearch(e.target.value)}
            />
            <Button onClick={() => setSearch(null)}>クリア</Button>
          </Flex>
        </Input.Wrapper>
      </Group>
      <Table.ScrollContainer minWidth={1000} w="100%" maw="100%" type="native">
        <Table
          mt="md"
          variant="vertical"
          layout="fixed"
          withTableBorder
          highlightOnHover
        >
          <Table.Thead>
            <Table.Tr>
              <Table.Th>タイトル</Table.Th>
              <Table.Th>URL</Table.Th>
              <Table.Th>カテゴリ</Table.Th>
              <Table.Th style={{ textAlign: "center" }}>アクション</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {displayFavariteTodos.map((todo) => (
              <Table.Tr key={todo.id}>
                <Table.Td>
                  <Text>
                    {todo.title.length > 10
                      ? todo.title.slice(0, 10) + "..."
                      : todo.title}
                  </Text>
                </Table.Td>
                <Table.Td>
                  <Anchor
                    href={todo.url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Text lineClamp={1} size="sm">
                      {todo.url.length > 30
                        ? todo.url.slice(0, 30) + "..."
                        : todo.url}
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
                          href={`/dashboard/favorite/${todo.id}`}
                          leftSection={<IconEye size={16} />}
                        >
                          詳細を表示
                        </Menu.Item>

                        <Menu.Item
                          component={Link}
                          href={`/dashboard/favorite/edit/${todo.id}`}
                          leftSection={<IconEdit size={16} />}
                        >
                          編集する
                        </Menu.Item>

                        <Menu.Item
                          onClick={() =>
                            handleTodayClick(todo.id, todo.isToday)
                          }
                          leftSection={
                            todo.isToday ? (
                              <IconCalendarFilled size={16} />
                            ) : (
                              <IconCalendar size={16} />
                            )
                          }
                        >
                          {todo.isToday
                            ? "本日のTODOから削除"
                            : "本日のTODOに追加"}
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
      {paginatedFavarite.length > PAGINATION.ITEMS_PER_PAGE && (
        <Group justify="center" mt="md">
          <Pagination
            value={pagination.active}
            onChange={pagination.setPage}
            total={Math.ceil(
              paginatedFavarite.length / PAGINATION.ITEMS_PER_PAGE
            )}
            siblings={PAGINATION.SIBLINGS}
          />
        </Group>
      )}
    </>
  );
};

export default FavariteTodoListTabs;
