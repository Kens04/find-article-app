"use client";

import {
  Button,
  Checkbox,
  Container,
  Flex,
  Group,
  Select,
  TextInput,
} from "@mantine/core";
import { useState } from "react";
import { DateTimePicker } from "@mantine/dates";
import { useRouter } from "next/navigation";

type TodoStatus = "UNREAD" | "READING" | "COMPLETED";

const CreateTodoForm = () => {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [url, setURL] = useState("");
  const [category, setCategory] = useState("");
  const [status, setStatus] = useState<TodoStatus>("UNREAD");
  const [dueDate, setDueDate] = useState<Date | null>(null);
  const [isPublic, setIsPublic] = useState(false);

  const handleCreateTodo = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title || !url || !dueDate) {
      alert("必須項目を入力してください");
      return;
    }

    try {
      const response = await fetch(`/api/create-todo`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          url,
          status,
          dueDate: dueDate.toISOString(),
          category,
          isPublic,
        }),
      });

      if (response.ok) {
        router.push("/dashboard/todo-list");
        router.refresh();
      } else {
        throw new Error("TODO作成に失敗しました");
      }
    } catch (err) {
      console.error(err);
      alert("エラーが発生しました");
    }
  };

  return (
    <Container size="xs" w="100%" mt="lg">
      <form>
        <TextInput
          label="タイトル"
          placeholder="タイトル"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          withAsterisk
        />
        <TextInput
          label="URL"
          placeholder="URL"
          value={url}
          onChange={(e) => setURL(e.target.value)}
          withAsterisk
          mt="sm"
        />
        <TextInput
          label="カテゴリ"
          placeholder="カテゴリ"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          mt="sm"
        />
        <Select
          label="状態"
          placeholder="状態"
          value={status}
          onChange={(value) => setStatus(value as TodoStatus)}
          data={[
            { value: "UNREAD", label: "未読" },
            { value: "READING", label: "読書中" },
            { value: "COMPLETED", label: "完了" },
          ]}
          mt="sm"
        />
        <DateTimePicker
          label="締切日"
          placeholder="締切日"
          value={dueDate}
          onChange={setDueDate}
          withAsterisk
          mt="sm"
        />
        <Checkbox
          label="全体に共有する"
          checked={isPublic}
          onChange={(e) => setIsPublic(e.target.checked)}
          mt="sm"
        />
        <Flex
          gap="md"
          justify="center"
          align="center"
          direction="column"
          wrap="wrap"
          mt="sm"
        >
          <Group mt="sm" w="100%">
            <Button onClick={handleCreateTodo} fullWidth>
              TODO作成
            </Button>
          </Group>
        </Flex>
      </form>
    </Container>
  );
};

export default CreateTodoForm;
