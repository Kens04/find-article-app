"use client";

import CategorySearch from "@/components/todo/category-search";
import IsPublicButton from "@/components/todo/share/ispublic-button";
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
  Table,
  Menu,
  ActionIcon,
} from "@mantine/core";
import { Session } from "@supabase/auth-helpers-nextjs";
import { IconDots, IconStar, IconStarFilled } from "@tabler/icons-react";
import Link from "next/link";
import { useState } from "react";

const ShareTodoListContent = ({
  todos,
  session,
}: {
  todos: TodoList[];
  session: Session | null;
}) => {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  // 表示するTODOをフィルタリング
  const filteredTodos =
    selectedCategories.length === 0
      ? todos // カテゴリ未選択時は全て表示
      : todos.filter((todo) =>
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

  return (
    <Container maw="100%" w="100%" mt="lg">
      <Title order={2} mb="md">
        全体共有
      </Title>
      <CategorySearch
        todos={filteredTodos}
        selectedCategories={selectedCategories}
        onCategoryChange={setSelectedCategories}
      />
      <Table.ScrollContainer minWidth={1000} w="100%" maw="100%" type="native">
        <Table highlightOnHover mt="md">
          <Table.Thead>
            <Table.Tr>
              <Table.Th>タイトル</Table.Th>
              <Table.Th>URL</Table.Th>
              <Table.Th>カテゴリ</Table.Th>
              <Table.Th style={{ textAlign: "center" }}>お気に入り</Table.Th>
              <Table.Th style={{ textAlign: "center" }}>アクション</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {filteredTodos.map((todo) => (
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
                <Table.Td style={{ textAlign: "center" }}>
                  {todo.isFavorite ? (
                    <IconStarFilled size={16} color="orange" />
                  ) : (
                    <IconStar size={16} />
                  )}
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
    </Container>
  );
};

export default ShareTodoListContent;
