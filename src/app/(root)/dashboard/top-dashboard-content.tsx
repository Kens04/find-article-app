import { Alert, Flex, Progress } from "@mantine/core";
import { ArticleStatus, ArticleList } from "@/types/type";
import { Container, Paper, Text, Title } from "@mantine/core";
import { PieChart, DonutChart } from "@mantine/charts";
import calculateCategoryData from "@/components/article/calculate-category-data";
import { Session } from "@supabase/auth-helpers-nextjs";
import AuthGuard from "@/components/article/auth-auard";
import { IconCalendar } from "@tabler/icons-react";
import styles from "@/components/layout/dashboard.module.css";

const TopDashboardContent = ({
  articles,
  session,
}: {
  articles: ArticleList[];
  session: Session | null;
}) => {
  const user = session?.user;
  const userArticles = articles.filter(
    (article) => article.userId === user?.id
  );
  // ステータスごとの記事数を集計
  const statusCounts = {
    unread: userArticles.filter(
      (article) => article.status === ArticleStatus.UNREAD
    ).length,
    reading: userArticles.filter(
      (article) => article.status === ArticleStatus.READING
    ).length,
    completed: userArticles.filter(
      (article) => article.status === ArticleStatus.COMPLETED
    ).length,
  };

  // ステータスチャートのデータ
  const statusData = [
    { name: "未読", value: statusCounts.unread, color: "red" },
    { name: "読書中", value: statusCounts.reading, color: "yellow" },
    { name: "完了", value: statusCounts.completed, color: "green" },
  ];

  const todayDate = new Date().toLocaleDateString("ja-JP", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
  const todayArticles = userArticles.filter((article) => {
    const articleDueDate = article.dueDate.toLocaleDateString("ja-JP", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
    return articleDueDate === todayDate;
  });

  const unreadCount = todayArticles.filter(
    (article) => article.status === ArticleStatus.UNREAD
  ).length;
  const readingCount = todayArticles.filter(
    (article) => article.status === ArticleStatus.READING
  ).length;
  const completedCount = todayArticles.filter(
    (article) => article.status === ArticleStatus.COMPLETED
  ).length;
  const unreadProgress = (unreadCount / todayArticles.length) * 100;
  const readingProgress = (readingCount / todayArticles.length) * 100;
  const completedProgress = (completedCount / todayArticles.length) * 100;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const oneWeekFromNow = new Date();
  oneWeekFromNow.setDate(oneWeekFromNow.getDate() + 7);
  oneWeekFromNow.setHours(23, 59, 59, 999);
  const nonCompletedArticles = userArticles.filter(
    (article) => article.status !== ArticleStatus.COMPLETED
  );
  const upcomingArticles = nonCompletedArticles.filter((article) => {
    const dueDate = new Date(article.dueDate);
    return dueDate <= oneWeekFromNow && dueDate >= today;
  });

  return (
    <Container size="lg" w="100%" mt="xl" mb="xl">
      {upcomingArticles.length > 0 && (
        <Alert color="yellow" mb="md">
          残り1週間の記事が{upcomingArticles.length}件あります
        </Alert>
      )}
      <Title order={2} mb="md">
        ダッシュボード
      </Title>
      <Alert
        variant="light"
        color="blue"
        title={`本日期日の記事：${todayArticles.length}件`}
        icon={<IconCalendar />}
      >
        {todayArticles.length > 0 ? (
          <>
            {todayArticles.map((article) => (
              <div key={article.id}>・{article.title}</div>
            ))}
            <Flex direction="column" gap="xs" mt="md">
              <Text fw={700} fz="lg">
                本日期日の進捗
              </Text>
              <div>
                <Text>
                  未読：
                  {unreadCount}件
                </Text>
                <Progress value={unreadProgress} />
              </div>
              <div>
                <Text>
                  読書中：
                  {readingCount}件
                </Text>
                <Progress value={readingProgress} />
              </div>
              <div>
                <Text>
                  完了：
                  {completedCount}件
                </Text>
                <Progress value={completedProgress} />
              </div>
            </Flex>
          </>
        ) : (
          <Text>本日期日の記事はありません。</Text>
        )}
      </Alert>
      <AuthGuard articles={articles} session={session}>
        <Flex mt="xl" className={styles.chartWrapper}>
          {/* ステータス分布 */}
          <div className={styles.chartContent}>
            <Paper shadow="xs" p="md">
              <Title order={3} size="h4" mb="md" ta="center">
                ステータス分布
              </Title>
              <DonutChart
                data={statusData}
                size={250}
                thickness={30}
                withLabels
                withTooltip
                className={styles.chart}
              />
            </Paper>
          </div>

          {/* カテゴリ分布 */}
          <div className={styles.chartContent}>
            <Paper shadow="xs" p="md">
              <Title order={3} size="h4" mb="md" ta="center">
                カテゴリ分布
              </Title>
              <PieChart
                data={calculateCategoryData(userArticles)}
                size={250}
                withLabels
                withTooltip
                className={styles.chart}
              />
            </Paper>
          </div>

          {/* 統計情報 */}
          <div className={styles.statusInfoContent}>
            <Paper shadow="xs" p="md">
              <Title order={3} size="h4" mb="md" ta="center">
                統計情報
              </Title>
              <Flex justify="space-between" gap="md" align="center" wrap="wrap">
                <div>
                  <Text fw={700} c="red">
                    未読: {statusCounts.unread}件
                  </Text>
                </div>
                <div>
                  <Text fw={700} c="yellow">
                    読書中: {statusCounts.reading}件
                  </Text>
                </div>
                <div>
                  <Text fw={700} c="green">
                    完了: {statusCounts.completed}件
                  </Text>
                </div>
              </Flex>
            </Paper>
          </div>
        </Flex>
      </AuthGuard>
    </Container>
  );
};

export default TopDashboardContent;
