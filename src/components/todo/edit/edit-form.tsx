"use client";

import { handleEdit } from "@/components/todo/action";
import EditText from "@/components/todo/edit/edit-text";
import { TodoList } from "@/components/todo/type";
import {
  TextInput,
  Button,
  Stack,
  Group,
  Container,
  Title,
} from "@mantine/core";
import { DateInput } from "@mantine/dates";
import { useForm } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import { useRouter } from "next/navigation";
import { useState } from "react";

const EditForm = ({ todo }: { todo: TodoList }) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const handleTextChange = (text: string) => {
    form.setFieldValue('text', text);
  };

  const form = useForm({
    initialValues: {
      title: todo?.title || "",
      url: todo?.url || "",
      category: todo?.category || "",
      dueDate: todo?.dueDate ? new Date(todo.dueDate) : new Date(),
      text: todo?.text || "",
    },
    validate: {
      title: (value) => (value.length < 1 ? "タイトルは必須です" : null),
      url: (value) => (value.length < 1 ? "URLは必須です" : null),
      category: (value) => (value.length < 1 ? "カテゴリは必須です" : null),
    },
  });

  const handleSubmit = async (todoId: string, values: typeof form.values) => {
    console.log(values);
    try {
      setIsLoading(true);
      await handleEdit(todoId, {
        title: values.title,
        url: values.url,
        category: values.category,
        dueDate: values.dueDate,
        text: values.text,
        isToday: values.dueDate.getDate() === new Date().getDate() ? true : false,
      });

      notifications.show({
        title: "更新完了",
        message: "TODOの更新が完了しました",
        color: "green",
      });

      router.push("/dashboard/todo-list");
      router.refresh();
    } catch (error) {
      console.error(error);
      notifications.show({
        title: "エラー",
        message: "更新に失敗しました",
        color: "red",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container w="100%" mt="lg" mb="lg">
      <Title order={2} mb="md" ta="center">
        TODO編集
      </Title>
      <Container size="xl" w="100%" mt="lg" p={0}>
        <form
          onSubmit={form.onSubmit((values) => handleSubmit(todo?.id, values))}
        >
          <Stack>
            <TextInput
              label="タイトル"
              placeholder="タイトルを入力"
              required
              {...form.getInputProps("title")}
            />

            <TextInput
              label="URL"
              placeholder="URLを入力"
              required
              {...form.getInputProps("url")}
            />

            <TextInput
              label="カテゴリ"
              placeholder="カテゴリを入力"
              required
              {...form.getInputProps("category")}
            />

            <DateInput
              label="締切日"
              placeholder="締切日を選択"
              valueFormat="YYYY年MM月DD日"
              minDate={new Date()}
              withAsterisk
              value={form.values.dueDate}
              onChange={(date) =>
                form.setFieldValue("dueDate", date || new Date())
              }
            />
            <EditText todo={todo}  onChange={handleTextChange} />
            <Group mt="sm" justify="center">
              <Button
                type="submit"
                fullWidth
                loading={isLoading}
                disabled={isLoading}
                loaderProps={{ type: "dots" }}
                w="50%"
                miw="200px"
              >
                TODO更新
              </Button>
            </Group>
          </Stack>
        </form>
      </Container>
    </Container>
  );
};

export default EditForm;
