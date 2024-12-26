"use client";

import {
  Button,
  Checkbox,
  Flex,
  Group,
  Select,
  TextInput,
} from "@mantine/core";
import { useState } from "react";
import { DateInput } from "@mantine/dates";
import { useRouter } from "next/navigation";
import "@mantine/dates/styles.css";

type TodoStatus = "UNREAD" | "READING" | "COMPLETED";

const CreateTodoForm = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [title, setTitle] = useState("");
  const [url, setURL] = useState("");
  const [category, setCategory] = useState("");
  const [status, setStatus] = useState<TodoStatus>("UNREAD");
  const [dueDate, setDueDate] = useState<Date | null>(null);
  const [isPublic, setIsPublic] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const handleCreateTodo = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title || !url || !dueDate) {
      alert("必須項目を入力してください");
      return;
    }

    try {
      setIsLoading(true);
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_APP_URL}/api/create-todo`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title,
            url,
            status,
            dueDate: dueDate.toISOString(),
            category: category || "未分類",
            isPublic,
            isFavorite,
          }),
        }
      );

      if (response.ok) {
        router.refresh();
        router.push("/dashboard/todo-list");
      } else {
        throw new Error("TODO作成に失敗しました");
      }
    } catch (err) {
      console.error(err);
      alert("エラーが発生しました");
    } finally {
      setIsLoading(false);
    }
  };

  return (
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
      <DateInput
        label="締切日"
        placeholder="締切日"
        value={dueDate}
        onChange={setDueDate}
        valueFormat="YYYY年MM月DD日"
        minDate={new Date()}
        withAsterisk
        mt="sm"
      />
      <Checkbox
        label="全体に共有する"
        checked={isPublic}
        onChange={(e) => setIsPublic(e.target.checked)}
        mt="sm"
      />
      <Checkbox
        label="お気に入りに追加する"
        checked={isFavorite}
        onChange={(e) => setIsFavorite(e.target.checked)}
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
          <Button
            onClick={handleCreateTodo}
            fullWidth
            loading={isLoading}
            disabled={isLoading}
            loaderProps={{ type: "dots" }}
          >
            TODO作成
          </Button>
        </Group>
      </Flex>
    </form>
  );
};

export default CreateTodoForm;
