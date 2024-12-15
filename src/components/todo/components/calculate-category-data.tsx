import { TodoList } from "@/components/todo/type";

// カラーパレットの定義
const colorPalette =  ["yellow.6", "teal.6", "blue.6", "red.6", "green.6", "purple.6", "orange.6", "gray.6", "pink.6", "grape.6", "violet.6", "indigo.6", "cyan.6", "lime.6", "mint.6", "gray.6"];

const calculateCategoryData = (todos: TodoList[]) => {
  const categoryCount: Record<string, number> = {};
  todos.forEach((todo) => {
    const category = todo.category || "";
    if (categoryCount[category]) {
      categoryCount[category]++;
    } else {
      categoryCount[category] = 1;
    }
  });

  const categoryData = Object.keys(categoryCount).map((category) => {
    const randomColorIndex = Math.floor(Math.random() * colorPalette.length);
    const randomColor = colorPalette[randomColorIndex];

    return {
      name: category,
      value: categoryCount[category],
      color: randomColor,
    };
  });

  return categoryData;
};

export default calculateCategoryData;