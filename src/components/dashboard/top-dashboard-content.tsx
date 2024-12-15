"use client";

import { TodoStatus, TodoList } from "@/components/todo/type";
import { Container, Grid, Paper, Text, Title } from "@mantine/core";
import { PieChart, DonutChart } from "@mantine/charts";
import calculateCategoryData from "@/components/todo/components/calculate-category-data";

const TopDashboardContent = ({ todos }: { todos: TodoList[] }) => {

  // ステータスごとのTODO数を集計
  const statusCounts = {
    unread: todos.filter((todo) => todo.status === TodoStatus.UNREAD).length,
    reading: todos.filter((todo) => todo.status === TodoStatus.READING).length,
    completed: todos.filter((todo) => todo.status === TodoStatus.COMPLETED).length,
  };

  // ステータスチャートのデータ
  const statusData = [
    { name: "未読", value: statusCounts.unread, color: "red" },
    { name: "読書中", value: statusCounts.reading, color: "yellow" },
    { name: "完了", value: statusCounts.completed, color: "green" },
  ];

  return (
    <Container size="lg" mt="xl">
      <Title order={2} mb="xl">
        ダッシュボード
      </Title>
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
              data={calculateCategoryData(todos)}
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
    </Container>
  );
};

export default TopDashboardContent;