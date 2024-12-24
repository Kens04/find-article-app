"use client";

import { CategorySearchProps } from "@/components/todo/type";
import { Flex, Group, MultiSelect, Select } from "@mantine/core";

const CategorySearch = ({
  todos,
  selectedCategories,
  onCategoryChange,
  onSortChange,
  sort,
  label,
}: CategorySearchProps) => {
  // カテゴリの選択肢を作成（重複を除去）
  const categoryOptions = Array.from(
    new Set(todos.map((todo) => todo.category || ""))
  ).map((category) => ({
    value: category,
    label: category,
  }));

  const sortLabel = label || "";

  const sortOptions = [
    { value: "asc", label: `${sortLabel}の古い順` },
    { value: "desc", label: `${sortLabel}の新しい順` },
  ];

  return (
    <Flex gap="md" wrap="wrap">
      <MultiSelect
        label="カテゴリ絞り込み"
        placeholder="カテゴリを選択"
        data={categoryOptions}
        value={selectedCategories}
        onChange={onCategoryChange}
        clearable
        searchable
      />
      {label !== "お気に入り" ? (
        <Select
          label={`${sortLabel}の並び順`}
          data={sortOptions}
          value={sort}
          onChange={(value) => onSortChange?.(value as "asc" | "desc")}
          clearable
          searchable
          placeholder="選択してください"
        />
      ) : null}
    </Flex>
  );
};

export default CategorySearch;
