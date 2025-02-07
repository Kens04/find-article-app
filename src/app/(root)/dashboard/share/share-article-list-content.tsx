import ShareArticleListTable from "@/app/(root)/dashboard/share/share-article-list-table";
import { Like, User, type ArticleList } from "@/types/type";
import { Title, Container } from "@mantine/core";
import { Session } from "@supabase/auth-helpers-nextjs";

const ShareArticleListContent = async ({
  articles,
  session,
  user,
  likes,
}: {
  articles: ArticleList[];
  session: Session | null;
  user: User[];
  likes: Like[];
}) => {
  return (
    <Container maw="100%" w="100%" mt="lg">
      <Title order={2} mb="md">
        全体共有
      </Title>
      <ShareArticleListTable
        articles={articles}
        session={session}
        user={user}
        likes={likes}
      />
    </Container>
  );
};

export default ShareArticleListContent;
