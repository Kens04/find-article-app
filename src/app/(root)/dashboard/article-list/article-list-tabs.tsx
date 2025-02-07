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
  IconCalendar,
  IconCalendarFilled,
} from "@tabler/icons-react";
import { notifications } from "@mantine/notifications";
import CategorySearch from "@/components/article/category-search";
import StatusButton from "@/components/article/status-button";
import { type ArticleList } from "@/types/type";
import { Text, Group, Anchor } from "@mantine/core";
import { IconStar, IconStarFilled } from "@tabler/icons-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { usePagination } from "@mantine/hooks";
import { PAGINATION } from "@/utils/pagination";
import { useQueryState } from "nuqs";

interface ArticleListTabsProps {
  unreadArticles: ArticleList[];
  readingArticles: ArticleList[];
}

const ArticleListTabs = ({
  unreadArticles,
  readingArticles,
}: ArticleListTabsProps) => {
  const router = useRouter();
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [sort, setSort] = useState<"asc" | "desc" | null>(null);
  const [search, setSearch] = useQueryState("search");

  useEffect(() => {
    const addTodaysArticles = async () => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      // 未読と読書中の記事を一緒に処理
      const allArticles = [...unreadArticles, ...readingArticles];
      const todaysArticles = allArticles.filter((article) => {
        // 既にisToday=trueのものは除外
        if (article.isToday) return false;

        const dueDate = new Date(article.dueDate);
        dueDate.setHours(0, 0, 0, 0);
        return dueDate.getTime() === today.getTime();
      });

      if (todaysArticles.length === 0) return;

      // Promise.allを使用して並列で処理
      await Promise.all(
        todaysArticles.map((article) =>
          handleToday({
            id: article.id,
            isToday: true,
          })
        )
      );

      router.refresh();
    };

    addTodaysArticles();
  }, []);

  // ソート関数を適用した記事リストを取得
  const getSortedArticles = (articles: ArticleList[]) => {
    if (!sort) return articles;

    return [...articles].sort((a, b) => {
      const dateA = new Date(a.dueDate).getTime();
      const dateB = new Date(b.dueDate).getTime();
      return sort === "asc" ? dateA - dateB : dateB - dateA;
    });
  };

  // 本日の記事を除外したリストを作成
  const filteredUnreadArticles = getSortedArticles(
    selectedCategories.length === 0
      ? unreadArticles.filter((article) => !article.isToday)
      : unreadArticles.filter(
          (article) =>
            !article.isToday &&
            selectedCategories.includes(article.category || "")
        )
  );

  const filteredReadingArticles = getSortedArticles(
    selectedCategories.length === 0
      ? readingArticles.filter((article) => !article.isToday)
      : readingArticles.filter(
          (article) =>
            !article.isToday &&
            selectedCategories.includes(article.category || "")
        )
  );

  const unreadPagination = usePagination({
    total: Math.ceil(filteredUnreadArticles.length / PAGINATION.ITEMS_PER_PAGE),
    initialPage: 1,
  });

  const readingPagination = usePagination({
    total: Math.ceil(
      filteredReadingArticles.length / PAGINATION.ITEMS_PER_PAGE
    ),
    initialPage: 1,
  });

  // ページネーション処理
  const unreadStart = (unreadPagination.active - 1) * PAGINATION.ITEMS_PER_PAGE;
  const unreadEnd = unreadStart + PAGINATION.ITEMS_PER_PAGE;
  const paginatedUnreadArticles = filteredUnreadArticles.slice(
    unreadStart,
    unreadEnd
  );

  const readingStart =
    (readingPagination.active - 1) * PAGINATION.ITEMS_PER_PAGE;
  const readingEnd = readingStart + PAGINATION.ITEMS_PER_PAGE;
  const paginatedReadingArticles = filteredReadingArticles.slice(
    readingStart,
    readingEnd
  );

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

  const unreadFiltered = unreadArticles.filter((article) =>
    article.title.toLowerCase().includes(search?.toLowerCase() || "")
  );
  const readingFiltered = readingArticles.filter((article) =>
    article.title.toLowerCase().includes(search?.toLowerCase() || "")
  );

  const displayUnreadArticles = search
    ? unreadFiltered
    : paginatedUnreadArticles;
  const displayReadingArticles = search
    ? readingFiltered
    : paginatedReadingArticles;
  const paginatedUnread = search ? unreadFiltered : filteredUnreadArticles;
  const paginatedReading = search ? readingFiltered : filteredReadingArticles;

  return (
    <Tabs defaultValue="unread" mt="md">
      <Tabs.List>
        <Tabs.Tab value="unread" leftSection={<IconBookOff />}>
          未読
        </Tabs.Tab>
        <Tabs.Tab value="reading" leftSection={<IconBook />}>
          読書中
        </Tabs.Tab>
      </Tabs.List>
      <Tabs.Panel value="unread">
        <Group mt="md">
          <CategorySearch
            articles={filteredUnreadArticles}
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
              {displayUnreadArticles.map((article) => (
                <Table.Tr key={article.id}>
                  <Table.Td>
                    <Text>
                      {" "}
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
        {paginatedUnread.length > PAGINATION.ITEMS_PER_PAGE && (
          <Group justify="center" mt="md">
            <Pagination
              value={unreadPagination.active}
              onChange={unreadPagination.setPage}
              total={Math.ceil(
                paginatedUnread.length / PAGINATION.ITEMS_PER_PAGE
              )}
              siblings={PAGINATION.SIBLINGS}
            />
          </Group>
        )}
      </Tabs.Panel>
      <Tabs.Panel value="reading">
        <Group mt="md">
          <CategorySearch
            articles={filteredReadingArticles}
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
              {displayReadingArticles.map((article) => (
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
        {paginatedReading.length > PAGINATION.ITEMS_PER_PAGE && (
          <Group justify="center" mt="md">
            <Pagination
              value={readingPagination.active}
              onChange={readingPagination.setPage}
              total={Math.ceil(
                paginatedReading.length / PAGINATION.ITEMS_PER_PAGE
              )}
              siblings={PAGINATION.SIBLINGS}
            />
          </Group>
        )}
      </Tabs.Panel>
    </Tabs>
  );
};

export default ArticleListTabs;
