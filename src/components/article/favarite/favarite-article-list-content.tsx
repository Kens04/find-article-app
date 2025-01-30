import AuthGuard from "@/components/article/components/auth-auard";
import FavariteArticleListTabs from "@/components/article/favarite/favarite-article-list-tabs";
import { type ArticleList } from "@/components/article/type";
import { Title, Container } from "@mantine/core";
import { Session } from "@supabase/auth-helpers-nextjs";

const FavariteArticleListContent = ({
  articles,
  session,
}: {
  articles: ArticleList[];
  session: Session | null;
}) => {
  // お気に入りの記事のみをフィルタリング
  const favariteArticles = articles.filter(
    (article) => article.isFavorite && article.userId === session?.user?.id
  );

  return (
    <Container maw="100%" w="100%" mt="lg">
      <Title order={2} mb="md">
        お気に入り
      </Title>
      <AuthGuard articles={articles} session={session}>
        <FavariteArticleListTabs favariteArticles={favariteArticles} />
      </AuthGuard>
    </Container>
  );
};

export default FavariteArticleListContent;
