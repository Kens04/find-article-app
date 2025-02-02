"use client";

import "@mantine/notifications/styles.css";
import {
  handleDeleteClick,
  handleFavorite,
  handleShareClick,
  handleToday,
} from "@/utils/action";
import {
  ActionIcon,
  Button,
  Flex,
  Input,
  Menu,
  Pagination,
  Table,
  Tabs,
} from "@mantine/core";
import {
  IconBookOff,
  IconBook,
  IconTrash,
  IconDots,
  IconEye,
  IconShare,
  IconEdit,
  IconCalendarFilled,
  IconCalendar,
} from "@tabler/icons-react";
import { notifications } from "@mantine/notifications";
import CategorySearch from "@/components/article/category-search";
import StatusButton from "@/components/article/status-button";
import { type ArticleList } from "@/types/type";
import { Text, Group, Anchor } from "@mantine/core";
import { IconStar, IconStarFilled } from "@tabler/icons-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { usePagination } from "@mantine/hooks";
import { PAGINATION } from "@/utils/pagination";
import { useQueryState } from "nuqs";

interface ArticleTabsProps {
  unreadArticles: ArticleList[];
  readingArticles: ArticleList[];
}

const ArticleTabs = ({ unreadArticles, readingArticles }: ArticleTabsProps) => {
  const router = useRouter();
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [sort, setSort] = useState<"asc" | "desc" | null>(null);
  const [search, setSearch] = useQueryState("search");

  // 本日の記事のページネーション設定
  const unreadPagination = usePagination({
    total: Math.ceil(unreadArticles.length / PAGINATION.ITEMS_PER_PAGE),
    initialPage: 1,
  });

  const readingPagination = usePagination({
    total: Math.ceil(readingArticles.length / PAGINATION.ITEMS_PER_PAGE),
    initialPage: 1,
  });

  // ページネーション処理
  const unreadStart = (unreadPagination.active - 1) * PAGINATION.ITEMS_PER_PAGE;
  const unreadEnd = unreadStart + PAGINATION.ITEMS_PER_PAGE;

  const readingStart =
    (readingPagination.active - 1) * PAGINATION.ITEMS_PER_PAGE;
  const readingEnd = readingStart + PAGINATION.ITEMS_PER_PAGE;

  const handleFavoriteClick = async (id: string, isFavorite: boolean) => {
    try {
      await handleFavorite({
        id: id,
        isFavorite: !isFavorite,
      });
      notifications.show({
        title: !isFavorite ? "お気に入りに追加" : "お気に入りから削除",
        message: !isFavorite
          ? "お気に入りに追加しました"
          : "お気に入りから削除しました",
        color: !isFavorite ? "yellow" : "gray",
      });
      router.refresh();
    } catch (error) {
      console.error("favorite update failed:", error);
    }
  };

  const handleTodayClick = async (id: string, isToday: boolean) => {
    try {
      await handleToday({
        id: id,
        isToday: !isToday,
      });
      notifications.show({
        title: !isToday ? "本日の記事に追加" : "本日の記事から削除",
        message: !isToday
          ? "本日の記事に追加しました"
          : "本日の記事から削除しました",
        color: !isToday ? "yellow" : "gray",
      });
      router.refresh();
    } catch (error) {
      console.error("today update failed:", error);
    }
  };

  // ソート、カテゴリ、検索を適用した記事リストを取得
  const getFilteredArticles = (articles: ArticleList[]) => {
    // 検索フィルター
    let filtered = articles;
    if (search) {
      filtered = filtered.filter((article) =>
        article.title.toLowerCase().includes(search.toLowerCase())
      );
    }

    // カテゴリフィルター
    if (selectedCategories.length > 0) {
      filtered = filtered.filter((article) =>
        selectedCategories.includes(article.category || "")
      );
    }

    // ソート
    if (sort) {
      filtered = [...filtered].sort((a, b) => {
        const dateA = new Date(a.dueDate).getTime();
        const dateB = new Date(b.dueDate).getTime();
        return sort === "asc" ? dateA - dateB : dateB - dateA;
      });
    }

    return filtered;
  };

  // フィルタリングを適用
  const filteredUnreadArticles = getFilteredArticles(unreadArticles);
  const filteredReadingArticles = getFilteredArticles(readingArticles);

  // ページネーション処理
  const paginatedUnreadArticles = filteredUnreadArticles.slice(
    unreadStart,
    unreadEnd
  );

  const paginatedReadingArticles = filteredReadingArticles.slice(
    readingStart,
    readingEnd
  );

  return (
    <Tabs defaultValue="article" mt="md">
      <Tabs.List>
        <Tabs.Tab value="article" leftSection={<IconBookOff />}>
          未読
        </Tabs.Tab>
        <Tabs.Tab value="reading" leftSection={<IconBook />}>
          読書中
        </Tabs.Tab>
      </Tabs.List>
      <Tabs.Panel value="article">
        <Group mt="md">
          <CategorySearch
            articles={unreadArticles}
            selectedCategories={selectedCategories}
            onCategoryChange={setSelectedCategories}
            onSortChange={setSort}
            sort={sort}
            label="締切日"
          />
          <Input.Wrapper label="記事を検索">
            <Flex gap="xs">
              <Input
                placeholder="検索"
                value={search || ""}
                onChange={(e) => setSearch(e.target.value)}
              />
              <Button onClick={() => setSearch(null)}>クリア</Button>
            </Flex>
          </Input.Wrapper>
        </Group>
        <Table.ScrollContainer
          minWidth={1000}
          w="100%"
          maw="100%"
          type="native"
        >
          <Table
            mt="md"
            variant="vertical"
            layout="fixed"
            withTableBorder
            highlightOnHover
          >
            <Table.Thead>
              <Table.Tr>
                <Table.Th>タイトル</Table.Th>
                <Table.Th>URL</Table.Th>
                <Table.Th>カテゴリ</Table.Th>
                <Table.Th>締切日</Table.Th>
                <Table.Th>ステータス変更</Table.Th>
                <Table.Th style={{ textAlign: "center" }}>アクション</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {paginatedUnreadArticles.map((article) => (
                <Table.Tr key={article.id}>
                  <Table.Td>
                    <Text>
                      {article.title.length > 10
                        ? article.title.slice(0, 10) + "..."
                        : article.title}
                    </Text>
                  </Table.Td>
                  <Table.Td>
                    <Anchor
                      href={article.url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Text lineClamp={1} size="sm">
                        {article.url.length > 30
                          ? article.url.slice(0, 30) + "..."
                          : article.url}
                      </Text>
                    </Anchor>
                  </Table.Td>
                  <Table.Td>{article.category || "未分類"}</Table.Td>
                  <Table.Td>
                    {new Date(article.dueDate).toLocaleDateString()}
                  </Table.Td>
                  <Table.Td>
                    <StatusButton article={article} />
                  </Table.Td>
                  <Table.Td>
                    <Group justify="center">
                      <Menu shadow="md" width={200}>
                        <Menu.Target>
                          <ActionIcon variant="subtle">
                            <IconDots size={16} />
                          </ActionIcon>
                        </Menu.Target>

                        <Menu.Dropdown>
                          <Menu.Label>アクション</Menu.Label>

                          <Menu.Item
                            component={Link}
                            href={`/dashboard/article-list/${article.id}`}
                            leftSection={<IconEye size={16} />}
                          >
                            詳細を表示
                          </Menu.Item>

                          <Menu.Item
                            component={Link}
                            href={`/dashboard/article-list/edit/${article.id}`}
                            leftSection={<IconEdit size={16} />}
                          >
                            編集する
                          </Menu.Item>

                          <Menu.Item
                            onClick={() =>
                              handleTodayClick(article.id, article.isToday)
                            }
                            leftSection={
                              article.isToday ? (
                                <IconCalendarFilled size={16} />
                              ) : (
                                <IconCalendar size={16} />
                              )
                            }
                          >
                            {article.isToday
                              ? "本日の記事から削除"
                              : "本日の記事に追加"}
                          </Menu.Item>

                          <Menu.Item
                            onClick={() =>
                              handleFavoriteClick(
                                article.id,
                                article.isFavorite
                              )
                            }
                            leftSection={
                              article.isFavorite ? (
                                <IconStarFilled size={16} color="orange" />
                              ) : (
                                <IconStar size={16} />
                              )
                            }
                          >
                            {article.isFavorite
                              ? "お気に入りから削除"
                              : "お気に入りに追加"}
                          </Menu.Item>

                          <Menu.Item
                            onClick={() =>
                              handleShareClick(
                                router,
                                article.id,
                                article.isPublic,
                                article.sharedAt
                              )
                            }
                            leftSection={<IconShare size={16} />}
                          >
                            {article.isPublic ? "共有を解除" : "共有する"}
                          </Menu.Item>

                          <Menu.Divider />

                          <Menu.Item
                            color="red"
                            leftSection={<IconTrash size={16} />}
                            onClick={() =>
                              handleDeleteClick(router, article.id)
                            }
                          >
                            削除
                          </Menu.Item>
                        </Menu.Dropdown>
                      </Menu>
                    </Group>
                  </Table.Td>
                </Table.Tr>
              ))}
            </Table.Tbody>
          </Table>
        </Table.ScrollContainer>
        {paginatedUnreadArticles.length > PAGINATION.ITEMS_PER_PAGE && (
          <Group justify="center" mt="md">
            <Pagination
              value={unreadPagination.active}
              onChange={unreadPagination.setPage}
              total={Math.ceil(
                paginatedUnreadArticles.length / PAGINATION.ITEMS_PER_PAGE
              )}
              siblings={PAGINATION.SIBLINGS}
            />
          </Group>
        )}
      </Tabs.Panel>
      <Tabs.Panel value="reading">
        <Group mt="md">
          <CategorySearch
            articles={readingArticles}
            selectedCategories={selectedCategories}
            onCategoryChange={setSelectedCategories}
            onSortChange={setSort}
            sort={sort}
            label="締切日"
          />
          <Input.Wrapper label="記事を検索">
            <Flex gap="xs">
              <Input
                placeholder="検索"
                value={search || ""}
                onChange={(e) => setSearch(e.target.value)}
              />
              <Button onClick={() => setSearch(null)}>クリア</Button>
            </Flex>
          </Input.Wrapper>
        </Group>
        <Table.ScrollContainer
          minWidth={1000}
          w="100%"
          maw="100%"
          type="native"
        >
          <Table
            mt="md"
            variant="vertical"
            layout="fixed"
            withTableBorder
            highlightOnHover
          >
            <Table.Thead>
              <Table.Tr>
                <Table.Th>タイトル</Table.Th>
                <Table.Th>URL</Table.Th>
                <Table.Th>カテゴリ</Table.Th>
                <Table.Th>締切日</Table.Th>
                <Table.Th>ステータス変更</Table.Th>
                <Table.Th style={{ textAlign: "center" }}>アクション</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {paginatedReadingArticles.map((article) => (
                <Table.Tr key={article.id}>
                  <Table.Td>
                    <Text>
                      {article.title.length > 10
                        ? article.title.slice(0, 10) + "..."
                        : article.title}
                    </Text>
                  </Table.Td>
                  <Table.Td>
                    <Anchor
                      href={article.url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Text lineClamp={1} size="sm">
                        {article.url.length > 30
                          ? article.url.slice(0, 30) + "..."
                          : article.url}
                      </Text>
                    </Anchor>
                  </Table.Td>
                  <Table.Td>{article.category || "未分類"}</Table.Td>
                  <Table.Td>
                    {new Date(article.dueDate).toLocaleDateString()}
                  </Table.Td>
                  <Table.Td>
                    <StatusButton article={article} />
                  </Table.Td>
                  <Table.Td>
                    <Group justify="center">
                      <Menu shadow="md" width={200}>
                        <Menu.Target>
                          <ActionIcon variant="subtle">
                            <IconDots size={16} />
                          </ActionIcon>
                        </Menu.Target>

                        <Menu.Dropdown>
                          <Menu.Label>アクション</Menu.Label>

                          <Menu.Item
                            component={Link}
                            href={`/dashboard/article-list/${article.id}`}
                            leftSection={<IconEye size={16} />}
                          >
                            詳細を表示
                          </Menu.Item>

                          <Menu.Item
                            component={Link}
                            href={`/dashboard/article-list/edit/${article.id}`}
                            leftSection={<IconEdit size={16} />}
                          >
                            編集する
                          </Menu.Item>

                          <Menu.Item
                            onClick={() =>
                              handleTodayClick(article.id, article.isToday)
                            }
                            leftSection={
                              article.isToday ? (
                                <IconCalendarFilled size={16} />
                              ) : (
                                <IconCalendar size={16} />
                              )
                            }
                          >
                            {article.isToday
                              ? "本日の記事から削除"
                              : "本日の記事に追加"}
                          </Menu.Item>

                          <Menu.Item
                            onClick={() =>
                              handleFavoriteClick(
                                article.id,
                                article.isFavorite
                              )
                            }
                            leftSection={
                              article.isFavorite ? (
                                <IconStarFilled size={16} color="orange" />
                              ) : (
                                <IconStar size={16} />
                              )
                            }
                          >
                            {article.isFavorite
                              ? "お気に入りから削除"
                              : "お気に入りに追加"}
                          </Menu.Item>

                          <Menu.Item
                            onClick={() =>
                              handleShareClick(
                                router,
                                article.id,
                                article.isPublic,
                                article.sharedAt
                              )
                            }
                            leftSection={<IconShare size={16} />}
                          >
                            {article.isPublic ? "共有を解除" : "共有する"}
                          </Menu.Item>

                          <Menu.Divider />

                          <Menu.Item
                            color="red"
                            leftSection={<IconTrash size={16} />}
                            onClick={() =>
                              handleDeleteClick(router, article.id)
                            }
                          >
                            削除
                          </Menu.Item>
                        </Menu.Dropdown>
                      </Menu>
                    </Group>
                  </Table.Td>
                </Table.Tr>
              ))}
            </Table.Tbody>
          </Table>
        </Table.ScrollContainer>
        {paginatedReadingArticles.length > PAGINATION.ITEMS_PER_PAGE && (
          <Group justify="center" mt="md">
            <Pagination
              value={readingPagination.active}
              onChange={readingPagination.setPage}
              total={Math.ceil(
                paginatedReadingArticles.length / PAGINATION.ITEMS_PER_PAGE
              )}
              siblings={PAGINATION.SIBLINGS}
            />
          </Group>
        )}
      </Tabs.Panel>
    </Tabs>
  );
};

export default ArticleTabs;
