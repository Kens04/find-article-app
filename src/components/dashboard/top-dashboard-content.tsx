"use client";

import { TodoStatus, TodoList } from "@/components/todo/type";
import { Container, Grid, Paper, Text, Title } from "@mantine/core";
import { PieChart, DonutChart } from "@mantine/charts";
import calculateCategoryData from "@/components/todo/components/calculate-category-data";
import { Session } from "@supabase/auth-helpers-nextjs";
import AuthGuard from "@/components/todo/components/auth-auard";
import { redirect } from "next/navigation";

const TopDashboardContent = ({
  todos,
  session,
}: {
  todos: TodoList[];
  session: Session | null;
}) => {
  const user = session?.user;
  const userTodos = todos.filter(todo => todo.userId === user?.id);
  // ステータスごとのTODO数を集計
  const statusCounts = {
    unread: userTodos.filter((todo) => todo.status === TodoStatus.UNREAD).length,
    reading: userTodos.filter((todo) => todo.status === TodoStatus.READING).length,
    completed: userTodos.filter((todo) => todo.status === TodoStatus.COMPLETED)
      .length,
  };

  if (!user) {
    return redirect("/login");
  }

  // ステータスチャートのデータ
  const statusData = [
    { name: "未読", value: statusCounts.unread, color: "red" },
    { name: "読書中", value: statusCounts.reading, color: "yellow" },
    { name: "完了", value: statusCounts.completed, color: "green" },
  ];

  return (
    <Container size="lg" w="100%" mt="xl">
      <Title order={2} mb="xl">
        ダッシュボード
      </Title>
      <AuthGuard todos={todos} session={session}>
        <Grid>
          {/* ステータス分布 */}
          <Grid.Col span={{ base: 12, md: 6 }}>
            <Paper shadow="xs" p="md">
              <Title order={3} size="h4" mb="md">
                ステータス分布
              </Title>
              <DonutChart
                data={statusData}
                size={250}
                thickness={30}
                withLabels
                withTooltip
              />
            </Paper>
          </Grid.Col>

          {/* カテゴリ分布 */}
          <Grid.Col span={{ base: 12, md: 6 }}>
            <Paper shadow="xs" p="md">
              <Title order={3} size="h4" mb="md">
                カテゴリ分布
              </Title>
              <PieChart
                data={calculateCategoryData(userTodos)}
                size={250}
                withLabels
                withTooltip
              />
            </Paper>
          </Grid.Col>

          {/* 統計情報 */}
          <Grid.Col span={12}>
            <Paper shadow="xs" p="md">
              <Title order={3} size="h4" mb="md">
                統計情報
              </Title>
              <Grid>
                <Grid.Col span={4}>
                  <Text fw={700} c="red">
                    未読: {statusCounts.unread}件
                  </Text>
                </Grid.Col>
                <Grid.Col span={4}>
                  <Text fw={700} c="yellow">
                    読書中: {statusCounts.reading}件
                  </Text>
                </Grid.Col>
                <Grid.Col span={4}>
                  <Text fw={700} c="green">
                    完了: {statusCounts.completed}件
                  </Text>
                </Grid.Col>
              </Grid>
            </Paper>
          </Grid.Col>
        </Grid>
      </AuthGuard>
    </Container>
  );
};

export default TopDashboardContent;
