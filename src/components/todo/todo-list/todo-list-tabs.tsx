"use client";

import "@mantine/notifications/styles.css";
import {
  handleDeleteClick,
  handleFavorite,
  handleShareClick,
  handleToday,
} from "@/components/todo/action";
import {
  ActionIcon,
  Button,
  Flex,
  Input,
  Menu,
  Pagination,
  Table,
  Tabs,
} from "@mantine/core";
import {
  IconBookOff,
  IconBook,
  IconTrash,
  IconDots,
  IconEye,
  IconShare,
  IconEdit,
  IconCalendar,
  IconCalendarFilled,
} from "@tabler/icons-react";
import { notifications } from "@mantine/notifications";
import CategorySearch from "@/components/todo/category-search";
import StatusButton from "@/components/todo/status-button";
import { type TodoList } from "@/components/todo/type";
import { Text, Group, Anchor } from "@mantine/core";
import { IconStar, IconStarFilled } from "@tabler/icons-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { usePagination } from "@mantine/hooks";
import { PAGINATION } from "@/components/todo/pagination";
import { useQueryState } from "nuqs";

interface TodoListTabsProps {
  unreadTodos: TodoList[];
  readingTodos: TodoList[];
}

const TodoListTabs = ({ unreadTodos, readingTodos }: TodoListTabsProps) => {
  const router = useRouter();
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [sort, setSort] = useState<"asc" | "desc" | null>(null);
  const [search, setSearch] = useQueryState("search");

  useEffect(() => {
    const addTodaysTodos = async () => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      // 未読と読書中のTODOを一緒に処理
      const allTodos = [...unreadTodos, ...readingTodos];
      const todaysTodos = allTodos.filter((todo) => {
        // 既にisToday=trueのものは除外
        if (todo.isToday) return false;

        const dueDate = new Date(todo.dueDate);
        dueDate.setHours(0, 0, 0, 0);
        return dueDate.getTime() === today.getTime();
      });

      if (todaysTodos.length === 0) return;

      // Promise.allを使用して並列で処理
      await Promise.all(
        todaysTodos.map((todo) =>
          handleToday({
            id: todo.id,
            isToday: true,
          })
        )
      );

      router.refresh();
    };

    addTodaysTodos();
  }, []);

  // ソート関数を適用したTODOリストを取得
  const getSortedTodos = (todos: TodoList[]) => {
    if (!sort) return todos;

    return [...todos].sort((a, b) => {
      const dateA = new Date(a.dueDate).getTime();
      const dateB = new Date(b.dueDate).getTime();
      return sort === "asc" ? dateA - dateB : dateB - dateA;
    });
  };

  // 本日のTODOを除外したリストを作成
  const filteredUnreadTodos = getSortedTodos(
    selectedCategories.length === 0
      ? unreadTodos.filter((todo) => !todo.isToday)
      : unreadTodos.filter(
          (todo) =>
            !todo.isToday && selectedCategories.includes(todo.category || "")
        )
  );

  const filteredReadingTodos = getSortedTodos(
    selectedCategories.length === 0
      ? readingTodos.filter((todo) => !todo.isToday)
      : readingTodos.filter(
          (todo) =>
            !todo.isToday && selectedCategories.includes(todo.category || "")
        )
  );

  const unreadPagination = usePagination({
    total: Math.ceil(filteredUnreadTodos.length / PAGINATION.ITEMS_PER_PAGE),
    initialPage: 1,
  });

  const readingPagination = usePagination({
    total: Math.ceil(filteredReadingTodos.length / PAGINATION.ITEMS_PER_PAGE),
    initialPage: 1,
  });

  // ページネーション処理
  const unreadStart = (unreadPagination.active - 1) * PAGINATION.ITEMS_PER_PAGE;
  const unreadEnd = unreadStart + PAGINATION.ITEMS_PER_PAGE;
  const paginatedUnreadTodos = filteredUnreadTodos.slice(
    unreadStart,
    unreadEnd
  );

  const readingStart =
    (readingPagination.active - 1) * PAGINATION.ITEMS_PER_PAGE;
  const readingEnd = readingStart + PAGINATION.ITEMS_PER_PAGE;
  const paginatedReadingTodos = filteredReadingTodos.slice(
    readingStart,
    readingEnd
  );

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

  const unreadFiltered = unreadTodos.filter((todo) =>
    todo.title.toLowerCase().includes(search?.toLowerCase() || "")
  );
  const readingFiltered = readingTodos.filter((todo) =>
    todo.title.toLowerCase().includes(search?.toLowerCase() || "")
  );

  const displayUnreadTodos = search ? unreadFiltered : paginatedUnreadTodos;
  const displayReadingTodos = search ? readingFiltered : paginatedReadingTodos;
  const paginatedUnread = search ? unreadFiltered : filteredUnreadTodos;
  const paginatedReading = search ? readingFiltered : filteredReadingTodos;

  return (
    <Tabs defaultValue="todolist" mt="md">
      <Tabs.List>
        <Tabs.Tab value="todolist" leftSection={<IconBookOff />}>
          未読
        </Tabs.Tab>
        <Tabs.Tab value="reading" leftSection={<IconBook />}>
          読書中
        </Tabs.Tab>
      </Tabs.List>
      <Tabs.Panel value="todolist">
        <Group mt="md">
          <CategorySearch
            todos={filteredUnreadTodos}
            selectedCategories={selectedCategories}
            onCategoryChange={setSelectedCategories}
            onSortChange={setSort}
            sort={sort}
            label="締切日"
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
        <Table.ScrollContainer
          minWidth={1000}
          w="100%"
          maw="100%"
          type="native"
        >
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
                <Table.Th>締切日</Table.Th>
                <Table.Th>ステータス変更</Table.Th>
                <Table.Th style={{ textAlign: "center" }}>アクション</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {displayUnreadTodos.map((todo) => (
                <Table.Tr key={todo.id}>
                  <Table.Td>
                    <Text>
                      {" "}
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
                    {new Date(todo.dueDate).toLocaleDateString()}
                  </Table.Td>
                  <Table.Td>
                    <StatusButton todo={todo} />
                  </Table.Td>
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
                            component={Link}
                            href={`/dashboard/todo-list/edit/${todo.id}`}
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
        {paginatedUnread.length > PAGINATION.ITEMS_PER_PAGE && (
          <Group justify="center" mt="md">
            <Pagination
              value={unreadPagination.active}
              onChange={unreadPagination.setPage}
              total={Math.ceil(
                paginatedUnread.length / PAGINATION.ITEMS_PER_PAGE
              )}
              siblings={PAGINATION.SIBLINGS}
            />
          </Group>
        )}
      </Tabs.Panel>
      <Tabs.Panel value="reading">
        <Group mt="md">
          <CategorySearch
            todos={filteredReadingTodos}
            selectedCategories={selectedCategories}
            onCategoryChange={setSelectedCategories}
            onSortChange={setSort}
            sort={sort}
            label="締切日"
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
        <Table.ScrollContainer
          minWidth={1000}
          w="100%"
          maw="100%"
          type="native"
        >
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
                <Table.Th>締切日</Table.Th>
                <Table.Th>ステータス変更</Table.Th>
                <Table.Th style={{ textAlign: "center" }}>アクション</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {displayReadingTodos.map((todo) => (
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
                    {new Date(todo.dueDate).toLocaleDateString()}
                  </Table.Td>
                  <Table.Td>
                    <StatusButton todo={todo} />
                  </Table.Td>
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
                            component={Link}
                            href={`/dashboard/todo-list/edit/${todo.id}`}
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
        {paginatedReading.length > PAGINATION.ITEMS_PER_PAGE && (
          <Group justify="center" mt="md">
            <Pagination
              value={readingPagination.active}
              onChange={readingPagination.setPage}
              total={Math.ceil(
                paginatedReading.length / PAGINATION.ITEMS_PER_PAGE
              )}
              siblings={PAGINATION.SIBLINGS}
            />
          </Group>
        )}
      </Tabs.Panel>
    </Tabs>
  );
};

export default TodoListTabs;
