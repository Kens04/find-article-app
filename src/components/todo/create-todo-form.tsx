"use client";

import { Container, Flex, Select, TextInput } from "@mantine/core";
import AuthClientButton from "@/components/form/auth-client-button";
import { useState } from "react";
import { DateTimePicker } from "@mantine/dates";

type State = {
  id: number | null;
  name: string;
};

export const state: State[] = [
  { id: 1, name: "未読" },
  { id: 2, name: "読書中" },
  { id: 3, name: "完了" },
];

const CreateTodoForm = () => {
  const [title, setTitle] = useState("");
  const [url, setURL] = useState("");
  const [selectedState, setSelectedState] = useState<State>(state[0]);

  const handleCreateTodo = async () => {
    try {
      await fetch(`http://localhost:3000/api/create-todo`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          url,
          state: selectedState.name,
          date: new Date().toISOString(),
        }),
      });
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <Container size="xs" w="100%" mt="lg">
      <form>
        <TextInput
          label="タイトル"
          placeholder="タイトル"
          withAsterisk
          mt="md"
        />
        <TextInput label="URL" placeholder="URL" withAsterisk />
        <TextInput label="カテゴリ" placeholder="カテゴリ" withAsterisk />
        <Select
        onChange={(key) => {
          const selected = state.find((item) => item.id === key);
          if (selected) setSelectedState(selected);
        }}
          label="状態"
          placeholder="状態"
          data={["未読", "読書中", "完了"]}
        />
        <DateTimePicker label="締切日" placeholder="締切日" />
        <Flex
          gap="md"
          justify="center"
          align="center"
          direction="column"
          wrap="wrap"
        >
          <AuthClientButton />
        </Flex>
      </form>
    </Container>
  );
};

export default CreateTodoForm;
