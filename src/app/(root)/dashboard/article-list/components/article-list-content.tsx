import { ArticleStatus, type ArticleList } from "@/types/type";
import { Container, Title } from "@mantine/core";
import { Session } from "@supabase/auth-helpers-nextjs";
import AuthGuard from "@/components/article/auth-auard";
import ArticleTabs from "@/app/(root)/dashboard/article/components/article-tabs";

const ArticleListContent = ({
  articles,
  session,
}: {
  articles: ArticleList[];
  session: Session | null;
}) => {
  const unreadArticles = articles.filter(
    (article) =>
      article.status === ArticleStatus.UNREAD &&
      article.userId === session?.user?.id
  );

  const readingArticles = articles.filter(
    (article) =>
      article.status === ArticleStatus.READING &&
      article.userId === session?.user?.id
  );

  return (
    <Container maw="100%" w="100%" mt="lg">
      <Title order={2} mb="md">
        記事リスト
      </Title>
      <AuthGuard articles={articles} session={session}>
        <ArticleTabs
          unreadArticles={unreadArticles}
          readingArticles={readingArticles}
        />
      </AuthGuard>
    </Container>
  );
};

export default ArticleListContent;
