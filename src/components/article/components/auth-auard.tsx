import { ArticleList } from "@/components/article/type";
import { Button, Flex, Text } from "@mantine/core";
import { Session } from "@supabase/auth-helpers-nextjs";
import Link from "next/link";
interface AuthGuardProps {
  articles: ArticleList[];
  session: Session | null;
  children: React.ReactNode;
}

const AuthGuard = ({ articles, session, children }: AuthGuardProps) => {
  const user = session?.user;
  const userArticles = articles.filter(article => article.userId === user?.id);
  if (userArticles.length === 0) {
    return (
      <Flex mt="xl" justify="center" align="center" direction="column" gap="md">
        <Text size="xl">記事の作成してください。</Text>
        <Button component={Link} href="/dashboard/create-article">
          記事作成
        </Button>
      </Flex>
    );
  }

  return <>{children}</>;
};

export default AuthGuard;
