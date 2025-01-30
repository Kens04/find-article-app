import { Container, Title } from "@mantine/core";
import "@mantine/dates/styles.css";
import CreateArticleForm from "@/components/article/create-article/create-article-form";
import { redirect } from "next/navigation";
import { getSession } from "@/utils/getSession";

export default async function CreateArticle() {
  const session = await getSession();
  const user = session?.user;
  if (!user) {
    return redirect("/login");
  }

  return (
    <Container size="md" w="100%" mt="lg">
      <Title order={2} mb="md" ta="center">
        記事作成
      </Title>
      <Container size="xs" w="100%" mt="lg" p={0}>
        <CreateArticleForm />
      </Container>
    </Container>
  );
}
