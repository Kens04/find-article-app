import { ArticleStatus, type ArticleList } from "@/components/article/type";
import {
  Container,
  Title,
  Group,
  Badge,
  Text,
  Anchor,
  Stack,
  Flex,
  Card,
  TypographyStylesProvider,
  Button,
} from "@mantine/core";
import Link from "next/link";

const ArticleDetailContent = ({ article }: { article: ArticleList }) => {
  // ステータスを日本語に変換する関数
  const getStatusLabel = (status: ArticleStatus) => {
    switch (status) {
      case ArticleStatus.UNREAD:
        return "未読";
      case ArticleStatus.READING:
        return "読書中";
      case ArticleStatus.COMPLETED:
        return "完了";
      default:
        return status;
    }
  };

  // ステータスに応じた色を返す関数
  const getStatusColor = (status: ArticleStatus) => {
    switch (status) {
      case ArticleStatus.UNREAD:
        return "red";
      case ArticleStatus.READING:
        return "yellow";
      case ArticleStatus.COMPLETED:
        return "green";
      default:
        return "gray";
    }
  };

  return (
    <Container maw="100%" w="100%" mt="lg" mb="lg">
      <Stack>
        <Group>
          <Title order={2}>{article.title}</Title>
          <Badge size="lg" color={getStatusColor(article.status)} variant="light">
            {getStatusLabel(article.status)}
          </Badge>
        </Group>

        <Stack>
          <Flex>
            <Text>URL：</Text>
            <Anchor
              href={article.url}
              target="_blank"
              rel="noopener noreferrer"
              size="lg"
            >
              {article.url}
            </Anchor>
          </Flex>
          <Card key={article.id} shadow="sm" padding="md" radius="md" withBorder>
            <TypographyStylesProvider>
              <div
                dangerouslySetInnerHTML={{ __html: article.text || "" }}
                style={{ wordBreak: "break-word" }}
              />
            </TypographyStylesProvider>
          </Card>
          <Group justify="center" mt="lg">
            <Button
              component={Link}
              href={`/dashboard/article-list/edit/${article.id}`}
              fullWidth
              maw={300}
            >
              編集する
            </Button>
          </Group>
        </Stack>
      </Stack>
    </Container>
  );
};

export default ArticleDetailContent;
