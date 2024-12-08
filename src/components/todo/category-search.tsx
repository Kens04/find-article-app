"use client";

import { TodoList } from "@/components/todo/type";
import { MultiSelect } from "@mantine/core";

const CategorySearch = ({ todos }: { todos: TodoList[] }) => {

  // カテゴリの一覧をMultiSelect用のデータ形式に変換
  const categoryOptions = Array.from(
    new Set(todos.map((todo) => todo.category))
  ).map((category) => ({
    value: category,
    label: category,
  }));

  return (
    <>
      <MultiSelect
        label="カテゴリ絞り込み"
        placeholder="カテゴリを選択"
        data={categoryOptions}
        clearable
      />
    </>
  );
};

export default CategorySearch;
