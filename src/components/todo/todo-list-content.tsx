"use client"

import CategorySearch from "@/components/todo/category-search";
import DeleteButton from "@/components/todo/delete-button";
import StatusButton from "@/components/todo/status-button";
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

interface TodoListContentProps {
  todos: TodoList[];
  todosByCategory: { [key: string]: TodoList[] };
}

const TodoListContent = ({todos, todosByCategory}: TodoListContentProps) => {

  return (
    <Container size="md" w="100%" mt="lg">
      <Title order={2} mb="md">
        TODOリスト
      </Title>
      <CategorySearch todos={todos} />
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
                        variant="light"
                      >
                        {todo.status}
                      </Badge>
                    </Group>

                    <Text size="sm" c="dimmed" mb="md">
                      {todo.text}
                    </Text>

                    <StatusButton todo={todo} />

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
                      <Text size="xs" c="dimmed">
                        締切日: {new Date(todo.dueDate).toLocaleDateString()}
                      </Text>

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

export default TodoListContent;