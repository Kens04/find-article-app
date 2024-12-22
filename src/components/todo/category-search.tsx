"use client";

import { CategorySearchProps } from "@/components/todo/type";
import { MultiSelect } from "@mantine/core";

const CategorySearch = ({
  todos,
  selectedCategories,
  onCategoryChange,
}: CategorySearchProps) => {
  // カテゴリの選択肢を作成（重複を除去）
  const categoryOptions = Array.from(
    new Set(todos.map(todo => todo.category || ""))
  ).map(category => ({
    value: category,
    label: category,
  }));

  return (
    <>
      <MultiSelect
        label="カテゴリ絞り込み"
        placeholder="カテゴリを選択"
        data={categoryOptions}
        value={selectedCategories}
        onChange={onCategoryChange}
        clearable
        searchable
        w="100%"
      />
    </>
  );
};

export default CategorySearch;
