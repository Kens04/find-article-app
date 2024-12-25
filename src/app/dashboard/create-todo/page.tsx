import { Container, Title } from "@mantine/core";
import "@mantine/dates/styles.css";
import CreateTodoForm from "@/components/todo/create-todo/create-todo-form";

export default function CreateTodo() {
  return (
    <Container size="md" w="100%" mt="lg">
      <Title order={2} mb="md" ta="center">
        TODO作成
      </Title>
      <Container size="xs" w="100%" mt="lg" p={0}>
        <CreateTodoForm />
      </Container>
    </Container>
  );
}
