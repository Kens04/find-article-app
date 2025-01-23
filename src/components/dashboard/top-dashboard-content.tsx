import { Alert, Flex, Progress } from "@mantine/core";
import { TodoStatus, TodoList } from "@/components/todo/type";
import { Container, Paper, Text, Title } from "@mantine/core";
import { PieChart, DonutChart } from "@mantine/charts";
import calculateCategoryData from "@/components/todo/components/calculate-category-data";
import { Session } from "@supabase/auth-helpers-nextjs";
import AuthGuard from "@/components/todo/components/auth-auard";
import { IconCalendar } from "@tabler/icons-react";
import styles from "@/components/layout/dashboard.module.css";

const TopDashboardContent = ({
  todos,
  session,
}: {
  todos: TodoList[];
  session: Session | null;
}) => {
  const user = session?.user;
  const userTodos = todos.filter((todo) => todo.userId === user?.id);
  // ステータスごとのTODO数を集計
  const statusCounts = {
    unread: userTodos.filter((todo) => todo.status === TodoStatus.UNREAD)
      .length,
    reading: userTodos.filter((todo) => todo.status === TodoStatus.READING)
      .length,
    completed: userTodos.filter((todo) => todo.status === TodoStatus.COMPLETED)
      .length,
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
  const todayTodos = userTodos.filter((todo) => {
    const todoDueDate = todo.dueDate.toLocaleDateString("ja-JP", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
    return todoDueDate === todayDate;
  });

  const unreadCount = todayTodos.filter(
    (todo) => todo.status === TodoStatus.UNREAD
  ).length;
  const readingCount = todayTodos.filter(
    (todo) => todo.status === TodoStatus.READING
  ).length;
  const completedCount = todayTodos.filter(
    (todo) => todo.status === TodoStatus.COMPLETED
  ).length;
  const unreadProgress = (unreadCount / todayTodos.length) * 100;
  const readingProgress = (readingCount / todayTodos.length) * 100;
  const completedProgress = (completedCount / todayTodos.length) * 100;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const oneWeekFromNow = new Date();
  oneWeekFromNow.setDate(oneWeekFromNow.getDate() + 7);
  oneWeekFromNow.setHours(23, 59, 59, 999);
  const nonCompletedTodos = userTodos.filter(
    (todo) => todo.status !== TodoStatus.COMPLETED
  );
  const upcomingTodos = nonCompletedTodos.filter((todo) => {
    const dueDate = new Date(todo.dueDate);
    return dueDate <= oneWeekFromNow && dueDate >= today;
  });

  return (
    <Container size="lg" w="100%" mt="xl" mb="xl">
      {upcomingTodos.length > 0 && (
        <Alert color="yellow" mb="md">
          残り1週間のTODOが{upcomingTodos.length}件あります
        </Alert>
      )}
      <Title order={2} mb="md">
        ダッシュボード
      </Title>
      <Alert
        variant="light"
        color="blue"
        title={`本日期日のTODO：${todayTodos.length}件`}
        icon={<IconCalendar />}
      >
        {todayTodos.length > 0 ? (
          <>
            {todayTodos.map((todo) => (
              <div key={todo.id}>・{todo.title}</div>
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
          <Text>本日期日のTODOはありません。</Text>
        )}
      </Alert>
      <AuthGuard todos={todos} session={session}>
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
                data={calculateCategoryData(userTodos)}
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
