"use client";

import {
  Button,
  Card,
  Container,
  Flex,
  Grid,
  Group,
  Text,
  Title,
} from "@mantine/core";
import { IconBook, IconDashboard, IconFolder } from "@tabler/icons-react";
import Link from "next/link";

const MainSection = () => {
  return (
    <div>
      {/* Hero Section */}
      <Container>
        <Flex
          justify="center"
          align="center"
          direction="column"
          wrap="wrap"
          gap="xl"
        >
          <Title size="h1">記事管理をもっとシンプルに</Title>
          <Text>
            気になる記事やサイトを簡単に管理。学習の進捗を可視化し、
            効率的な情報管理を実現します。
          </Text>
          <Group justify="center">
            <Button component={Link} href="/login" >新規登録</Button>
            <Button component={Link} href="/register" variant="outline">ログイン</Button>
          </Group>
        </Flex>
      </Container>

      {/* Features Section */}
      <Container mt={80}>
        <Title size="h2" ta="center">
          主な機能
        </Title>
        <Grid mt="lg">
          <Grid.Col span={{ base: 12, md: 6, lg: 4 }}>
            <Card shadow="sm" padding="lg" radius="md" withBorder>
              <IconBook size={30} />
              <Title size="h3" mt="xs">
                シンプルな記事管理
              </Title>
              <Text mt="xs">
                URLを保存するだけで簡単に記事を管理。
                タイトルとカテゴリを設定して整理できます。
              </Text>
            </Card>
          </Grid.Col>

          <Grid.Col span={{ base: 12, md: 6, lg: 4 }}>
            <Card shadow="sm" padding="lg" radius="md" withBorder>
              <IconFolder size={30} />
              <Title size="h3" mt="xs">
                カテゴリ分類
              </Title>
              <Text mt="xs">
                タグやカテゴリで記事を整理。
                必要な情報をすぐに見つけることができます。
              </Text>
            </Card>
          </Grid.Col>

          <Grid.Col span={{ base: 12, md: 6, lg: 4 }}>
            <Card shadow="sm" padding="lg" radius="md" withBorder>
              <IconDashboard size={30} />
              <Title size="h3" mt="xs">
                進捗管理
              </Title>
              <Text mt="xs">
                ダッシュボードで学習の進捗を可視化。
                モチベーション維持をサポートします。
              </Text>
            </Card>
          </Grid.Col>
        </Grid>
      </Container>
    </div>
  );
};

export default MainSection;
