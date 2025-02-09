"use client";

import CategorySearch from "@/components/article/category-search";
import { PAGINATION } from "@/utils/pagination";
import { Like, User, type ArticleList } from "@/types/type";
import {
  Text,
  Anchor,
  Table,
  Group,
  Pagination,
  Input,
  Flex,
  Button,
  Avatar,
} from "@mantine/core";
import { usePagination } from "@mantine/hooks";
import { Session } from "@supabase/auth-helpers-nextjs";
import { useState } from "react";
import { useQueryState } from "nuqs";
import Likes from "@/app/(root)/dashboard/share/components/likes";
import IsPublicButton from "@/app/(root)/dashboard/share/components/ispublic-button";

const ShareArticleListTable = ({
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
  // const user = session?.user;
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [sort, setSort] = useState<"asc" | "desc" | null>(null);
  const [search, setSearch] = useQueryState("search");
  const pagination = usePagination({
    total: Math.ceil(articles.length / PAGINATION.ITEMS_PER_PAGE),
    initialPage: 1,
  });

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
        const dateA = new Date(a.sharedAt).getTime();
        const dateB = new Date(b.sharedAt).getTime();
        return sort === "asc" ? dateA - dateB : dateB - dateA;
      });
    }

    return filtered;
  };

  // フィルタリングを適用
  const filteredArticles = getFilteredArticles(articles);

  // ページネーション処理
  const start = (pagination.active - 1) * PAGINATION.ITEMS_PER_PAGE;
  const end = start + PAGINATION.ITEMS_PER_PAGE;
  const paginatedArticles = filteredArticles.slice(start, end);

  return (
    <>
      <Group mt="md">
        <CategorySearch
          articles={articles}
          selectedCategories={selectedCategories}
          onCategoryChange={setSelectedCategories}
          onSortChange={setSort}
          sort={sort}
          label="公開日"
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
      <Table.ScrollContainer minWidth={1000} w="100%" maw="100%" type="native">
        <Table
          mt="md"
          variant="vertical"
          layout="fixed"
          withTableBorder
          highlightOnHover
        >
          <Table.Thead>
            <Table.Tr>
              <Table.Th>ユーザー</Table.Th>
              <Table.Th>タイトル</Table.Th>
              <Table.Th>URL</Table.Th>
              <Table.Th>カテゴリ</Table.Th>
              <Table.Th>公開日</Table.Th>
              <Table.Th>いいね</Table.Th>
              <Table.Th style={{ textAlign: "center" }}>アクション</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {paginatedArticles.map((article) => (
              <Table.Tr key={article.id}>
                <Table.Td>
                  {user.map((u) =>
                    u.id === article.userId ? (
                      <div key={u.id}>
                        <Avatar src={u.avatarUrl} alt={u.name || ""} />
                        <span>{u.name}</span>
                      </div>
                    ) : null
                  )}
                </Table.Td>
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
                  {article.sharedAt
                    ? new Date(article.sharedAt).toLocaleDateString()
                    : "未設定"}
                </Table.Td>
                <Table.Td>
                  <Likes id={article.id} session={session} likes={likes} />
                </Table.Td>
                <Table.Td style={{ textAlign: "center" }}>
                  {article.userId === session?.user.id ? (
                    <IsPublicButton id={article.id} />
                  ) : null}
                </Table.Td>
              </Table.Tr>
            ))}
          </Table.Tbody>
        </Table>
      </Table.ScrollContainer>
      {filteredArticles.length > PAGINATION.ITEMS_PER_PAGE && (
        <Group justify="center" mt="md">
          <Pagination
            value={pagination.active}
            onChange={pagination.setPage}
            total={Math.ceil(
              filteredArticles.length / PAGINATION.ITEMS_PER_PAGE
            )}
            siblings={PAGINATION.SIBLINGS}
          />
        </Group>
      )}
    </>
  );
};

export default ShareArticleListTable;
