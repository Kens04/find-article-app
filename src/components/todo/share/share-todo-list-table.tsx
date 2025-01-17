"use client";

import CategorySearch from "@/components/todo/category-search";
import { PAGINATION } from "@/components/todo/pagination";
import IsPublicButton from "@/components/todo/share/ispublic-button";
import { type TodoList } from "@/components/todo/type";
import {
  Text,
  Anchor,
  Table,
  Group,
  Pagination,
  Input,
  Flex,
  Button,
  Avatar,
} from "@mantine/core";
import { usePagination } from "@mantine/hooks";
import { Session } from "@supabase/auth-helpers-nextjs";
import { useState } from "react";
import { useQueryState } from "nuqs";
import Likes from "@/components/todo/share/likes";

const ShareTodoListTable = ({
  todos,
  session,
}: {
  todos: TodoList[];
  session: Session | null;
}) => {
  const user = session?.user;
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [sort, setSort] = useState<"asc" | "desc" | null>(null);
  const [search, setSearch] = useQueryState("search");
  const pagination = usePagination({
    total: Math.ceil(todos.length / PAGINATION.ITEMS_PER_PAGE),
    initialPage: 1,
  });

  // ソート関数を適用したTODOリストを取得
  const getSortedTodos = (todos: TodoList[]) => {
    if (!sort) return todos;

    return [...todos].sort((a, b) => {
      const dateA = new Date(a.sharedAt).getTime();
      const dateB = new Date(b.sharedAt).getTime();
      return sort === "asc" ? dateA - dateB : dateB - dateA;
    });
  };

  // 表示するTODOをフィルタリング
  const filteredTodos = getSortedTodos(
    selectedCategories.length === 0
      ? todos // カテゴリ未選択時は全て表示
      : todos.filter((todo) => selectedCategories.includes(todo.category || ""))
  );

  const start = (pagination.active - 1) * PAGINATION.ITEMS_PER_PAGE;
  const end = start + PAGINATION.ITEMS_PER_PAGE;
  const paginatedTodos = filteredTodos.slice(start, end);

  const shareFiltered = todos.filter((todo) =>
    todo.title.toLowerCase().includes(search?.toLowerCase() || "")
  );

  const displayShareTodos = search ? shareFiltered : paginatedTodos;
  const paginatedShare = search ? shareFiltered : filteredTodos;

  return (
    <>
      <Group mt="md">
        <CategorySearch
          todos={filteredTodos}
          selectedCategories={selectedCategories}
          onCategoryChange={setSelectedCategories}
          onSortChange={setSort}
          sort={sort}
          label="公開日"
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
              <Table.Th>ユーザー</Table.Th>
              <Table.Th>タイトル</Table.Th>
              <Table.Th>URL</Table.Th>
              <Table.Th>カテゴリ</Table.Th>
              <Table.Th>公開日</Table.Th>
              <Table.Th>いいね</Table.Th>
              <Table.Th style={{ textAlign: "center" }}>アクション</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {displayShareTodos.map((todo) => (
              <Table.Tr key={todo.id}>
                <Table.Td>
                  <Avatar
                    src={
                      todo.userId === session?.user.id &&
                      user?.user_metadata.avatar_url
                    }
                    alt={
                      todo.userId === session?.user.id &&
                      user?.user_metadata.name
                    }
                  />
                  <span>
                    {todo.userId === session?.user.id &&
                      user?.user_metadata.name}
                  </span>
                </Table.Td>
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
                  {todo.sharedAt
                    ? new Date(todo.sharedAt).toLocaleDateString()
                    : "未設定"}
                </Table.Td>
                <Table.Td>
                  <Likes
                    id={todo.id}
                    likes={todo.likes}
                    todo={todo}
                    session={session}
                  />
                </Table.Td>
                <Table.Td style={{ textAlign: "center" }}>
                  {todo.userId === session?.user.id ? (
                    <IsPublicButton id={todo.id} />
                  ) : null}
                </Table.Td>
              </Table.Tr>
            ))}
          </Table.Tbody>
        </Table>
      </Table.ScrollContainer>
      {paginatedShare.length > PAGINATION.ITEMS_PER_PAGE && (
        <Group justify="center" mt="md">
          <Pagination
            value={pagination.active}
            onChange={pagination.setPage}
            total={Math.ceil(paginatedShare.length / PAGINATION.ITEMS_PER_PAGE)}
            siblings={PAGINATION.SIBLINGS}
          />
        </Group>
      )}
    </>
  );
};

export default ShareTodoListTable;
