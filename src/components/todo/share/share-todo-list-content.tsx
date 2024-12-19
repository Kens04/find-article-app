"use client";

import CategorySearch from "@/components/todo/category-search";
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
} from "@mantine/core";
import { useState } from "react";

const ShareTodoListContent = ({
  todos
}: {
  todos: TodoList[];
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
    <Container size="md" w="100%" mt="lg">
      <Title order={2} mb="md">
        全体共有
      </Title>
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
                      </Group>

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
                        <DeleteButton id={todo.id} />
                      </Group>
                    </Card>
                  ))}
                </Stack>
              </Accordion.Panel>
            </Accordion.Item>
          ))}
        </Accordion>
    </Container>
  );
};

export default ShareTodoListContent;
