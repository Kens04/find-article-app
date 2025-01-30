"use client";

import { handleEdit } from "@/components/article/action";
import EditText from "@/components/article/edit/edit-text";
import { ArticleList } from "@/components/article/type";
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

const EditForm = ({ article }: { article: ArticleList }) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const handleTextChange = (text: string) => {
    form.setFieldValue("text", text);
  };

  const form = useForm({
    initialValues: {
      title: article?.title || "",
      url: article?.url || "",
      category: article?.category || "",
      dueDate: article?.dueDate ? new Date(article.dueDate) : new Date(),
      text: article?.text || "",
    },
    validate: {
      title: (value) => (value.length < 1 ? "タイトルは必須です" : null),
      url: (value) => (value.length < 1 ? "URLは必須です" : null),
      category: (value) => (value.length < 1 ? "カテゴリは必須です" : null),
    },
  });

  const handleSubmit = async (
    articleId: string,
    values: typeof form.values
  ) => {
    console.log(values);
    try {
      setIsLoading(true);
      await handleEdit(articleId, {
        title: values.title,
        url: values.url,
        category: values.category,
        dueDate: values.dueDate,
        text: values.text,
        isToday:
          values.dueDate.getDate() === new Date().getDate() ? true : false,
      });

      notifications.show({
        title: "更新完了",
        message: "記事の更新が完了しました",
        color: "green",
      });

      router.push("/dashboard/article-list");
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
        記事編集
      </Title>
      <Container size="xl" w="100%" mt="lg" p={0}>
        <form
          onSubmit={form.onSubmit((values) =>
            handleSubmit(article?.id, values)
          )}
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
            <EditText article={article} onChange={handleTextChange} />
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
                記事更新
              </Button>
            </Group>
          </Stack>
        </form>
      </Container>
    </Container>
  );
};

export default EditForm;
