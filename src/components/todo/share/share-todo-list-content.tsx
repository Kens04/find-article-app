"use client";

import CategorySearch from "@/components/todo/category-search";
import { PAGINATION } from "@/components/todo/pagination";
import IsPublicButton from "@/components/todo/share/ispublic-button";
import { type TodoList } from "@/components/todo/type";
import {
  Text,
  Title,
  Anchor,
  Container,
  Table,
  Group,
  Pagination,
} from "@mantine/core";
import { usePagination } from "@mantine/hooks";
import { Session } from "@supabase/auth-helpers-nextjs";
import { useState } from "react";

const ShareTodoListContent = ({
  todos,
  session,
}: {
  todos: TodoList[];
  session: Session | null;
}) => {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [sort, setSort] = useState<"asc" | "desc" | null>(null);
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

  return (
    <Container maw="100%" w="100%" mt="lg">
      <Title order={2} mb="md">
        全体共有
      </Title>
      <CategorySearch
        todos={filteredTodos}
        selectedCategories={selectedCategories}
        onCategoryChange={setSelectedCategories}
        onSortChange={setSort}
        sort={sort}
        label="公開日"
      />
      <Table.ScrollContainer minWidth={1000} w="100%" maw="100%" type="native">
        <Table highlightOnHover mt="md">
          <Table.Thead>
            <Table.Tr>
              <Table.Th>タイトル</Table.Th>
              <Table.Th>URL</Table.Th>
              <Table.Th>カテゴリ</Table.Th>
              <Table.Th>公開日</Table.Th>
              <Table.Th style={{ textAlign: "center" }}>アクション</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {paginatedTodos.map((todo) => (
              <Table.Tr key={todo.id}>
                <Table.Td>
                  <Text>{todo.title.slice(0, 10)}...</Text>
                </Table.Td>
                <Table.Td>
                  <Anchor
                    href={todo.url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Text lineClamp={1} size="sm">
                      {todo.url.slice(0, 30)}...
                    </Text>
                  </Anchor>
                </Table.Td>
                <Table.Td>{todo.category || "未分類"}</Table.Td>
                <Table.Td>
                  {todo.sharedAt
                    ? new Date(todo.sharedAt).toLocaleDateString()
                    : "未設定"}
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
      {filteredTodos.length > PAGINATION.ITEMS_PER_PAGE && (
        <Group justify="center" mt="md">
          <Pagination
            value={pagination.active}
            onChange={pagination.setPage}
            total={Math.ceil(filteredTodos.length / PAGINATION.ITEMS_PER_PAGE)}
            siblings={PAGINATION.SIBLINGS}
          />
        </Group>
      )}
    </Container>
  );
};

export default ShareTodoListContent;
