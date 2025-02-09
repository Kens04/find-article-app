import AuthGuard from "@/components/article/auth-auard";
import { ArticleList, ArticleStatus } from "../../../../../types/type";
import { Container, Title } from "@mantine/core";
import { Session } from "@supabase/auth-helpers-nextjs";
import CompleteArticleListTabs from "@/app/(root)/dashboard/complete/components/complete-article-list-tabs";

interface ArticleListContentProps {
  articles: ArticleList[];
  session: Session | null;
}

const CompleteArticleListContent = ({
  articles,
  session,
}: ArticleListContentProps) => {
  // 完了した記事のみをフィルタリング
  const completedArticles = articles.filter(
    (article) =>
      article.status == ArticleStatus.COMPLETED &&
      article.userId === session?.user?.id
  );

  return (
    <Container maw="100%" w="100%" mt="lg">
      <Title order={2} mb="md">
        完了リスト
      </Title>
      <AuthGuard articles={articles} session={session}>
        <CompleteArticleListTabs completedArticles={completedArticles} />
      </AuthGuard>
    </Container>
  );
};

export default CompleteArticleListContent;
