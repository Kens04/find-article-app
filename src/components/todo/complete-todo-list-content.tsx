// "use client";

// import { useState } from "react";
// import { TodoList, TodoStatus } from "./type";
// import {
//   Container,
//   Title,
//   Text,
//   Group,
//   Anchor,
//   Table,
//   Menu,
//   ActionIcon,
//   Pagination,
// } from "@mantine/core";
// import CategorySearch from "@/components/todo/category-search";
// import { Session } from "@supabase/auth-helpers-nextjs";
// import AuthGuard from "@/components/todo/components/auth-auard";
// import Link from "next/link";
// import {
//   IconDots,
//   IconEye,
//   IconShare,
//   IconStar,
//   IconStarFilled,
//   IconTrash,
// } from "@tabler/icons-react";
// import {
//   handleDeleteClick,
//   handleFavorite,
//   handleShareClick,
// } from "@/components/todo/action";
// import { notifications } from "@mantine/notifications";
// import { useRouter } from "next/navigation";
// import StatusButton from "@/components/todo/status-button";
// import { usePagination } from "@mantine/hooks";
// import { PAGINATION } from "@/components/todo/pagination";

// interface TodoListContentProps {
//   todos: TodoList[];
//   session: Session | null;
// }

// const CompleteTodoListContent = ({ todos, session }: TodoListContentProps) => {
//   const router = useRouter();
//   const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
//   const [sort, setSort] = useState<"asc" | "desc" | null>(null);
//   const pagination = usePagination({
//     total: Math.ceil(todos.length / PAGINATION.ITEMS_PER_PAGE),
//     initialPage: 1,
//   });

//   // 完了したTODOのみをフィルタリング
//   const uncompletedTodos = todos.filter(
//     (todo) =>
//       todo.status == TodoStatus.COMPLETED && todo.userId === session?.user?.id
//   );

//   // ソート関数を適用したTODOリストを取得
//   const getSortedTodos = (todos: TodoList[]) => {
//     if (!sort) return todos;

//     return [...todos].sort((a, b) => {
//       const dateA = new Date(a.completedAt).getTime();
//       const dateB = new Date(b.completedAt).getTime();
//       return sort === "asc" ? dateA - dateB : dateB - dateA;
//     });
//   };

//   // 表示するTODOをフィルタリング
//   const filteredTodos = getSortedTodos(
//     selectedCategories.length === 0
//       ? uncompletedTodos // カテゴリ未選択時は全て表示
//       : uncompletedTodos.filter((todo) =>
//           selectedCategories.includes(todo.category || "")
//         )
//   );

//   const start = (pagination.active - 1) * PAGINATION.ITEMS_PER_PAGE;
//   const end = start + PAGINATION.ITEMS_PER_PAGE;
//   const paginatedTodos = filteredTodos.slice(start, end);

//   const handleFavoriteClick = async (id: string, isFavorite: boolean) => {
//     try {
//       await handleFavorite({
//         id: id,
//         isFavorite: !isFavorite,
//       });
//       notifications.show({
//         title: !isFavorite ? "お気に入りに追加" : "お気に入りから削除",
//         message: !isFavorite
//           ? "お気に入りに追加しました"
//           : "お気に入りから削除しました",
//         color: !isFavorite ? "yellow" : "gray",
//       });
//     } catch (error) {
//       console.error("favorite update failed:", error);
//     }
//   };

//   return (
//     <Container maw="100%" w="100%" mt="lg">
//       <Title order={2} mb="md">
//         完了リスト
//       </Title>
//       <AuthGuard todos={todos} session={session}>
//         <CategorySearch
//           todos={todos}
//           selectedCategories={selectedCategories}
//           onCategoryChange={setSelectedCategories}
//           onSortChange={setSort}
//           sort={sort}
//           label="完了日"
//         />
//         <Table.ScrollContainer
//           minWidth={1000}
//           w="100%"
//           maw="100%"
//           type="native"
//         >
//           <Table highlightOnHover mt="md">
//             <Table.Thead>
//               <Table.Tr>
//                 <Table.Th>タイトル</Table.Th>
//                 <Table.Th>URL</Table.Th>
//                 <Table.Th>カテゴリ</Table.Th>
//                 <Table.Th>完了日</Table.Th>
//                 <Table.Th>ステータス変更</Table.Th>
//                 <Table.Th style={{ textAlign: "center" }}>アクション</Table.Th>
//               </Table.Tr>
//             </Table.Thead>
//             <Table.Tbody>
//               {paginatedTodos.map((todo) => (
//                 <Table.Tr key={todo.id}>
//                   <Table.Td>
//                     <Text>{todo.title}</Text>
//                   </Table.Td>
//                   <Table.Td>
//                     <Anchor
//                       href={todo.url}
//                       target="_blank"
//                       rel="noopener noreferrer"
//                     >
//                       <Text lineClamp={1} size="sm">
//                         {todo.url}
//                       </Text>
//                     </Anchor>
//                   </Table.Td>
//                   <Table.Td>{todo.category || "未分類"}</Table.Td>
//                   <Table.Td>
//                     {todo.completedAt
//                       ? new Date(todo.completedAt).toLocaleDateString()
//                       : "未設定"}
//                   </Table.Td>
//                   <Table.Td>
//                     <StatusButton todo={todo} />
//                   </Table.Td>
//                   <Table.Td>
//                     <Group justify="center">
//                       <Menu shadow="md" width={200}>
//                         <Menu.Target>
//                           <ActionIcon variant="subtle">
//                             <IconDots size={16} />
//                           </ActionIcon>
//                         </Menu.Target>

//                         <Menu.Dropdown>
//                           <Menu.Label>アクション</Menu.Label>

//                           <Menu.Item
//                             component={Link}
//                             href={`/dashboard/todo-list/${todo.id}`}
//                             leftSection={<IconEye size={16} />}
//                           >
//                             詳細を表示
//                           </Menu.Item>

//                           <Menu.Item
//                             onClick={() =>
//                               handleFavoriteClick(todo.id, todo.isFavorite)
//                             }
//                             leftSection={
//                               todo.isFavorite ? (
//                                 <IconStarFilled size={16} color="orange" />
//                               ) : (
//                                 <IconStar size={16} />
//                               )
//                             }
//                           >
//                             {todo.isFavorite
//                               ? "お気に入りから削除"
//                               : "お気に入りに追加"}
//                           </Menu.Item>

//                           <Menu.Item
//                             onClick={() =>
//                               handleShareClick(
//                                 router,
//                                 todo.id,
//                                 todo.isPublic,
//                                 todo.sharedAt
//                               )
//                             }
//                             leftSection={<IconShare size={16} />}
//                           >
//                             {todo.isPublic ? "共有を解除" : "共有する"}
//                           </Menu.Item>

//                           <Menu.Divider />

//                           <Menu.Item
//                             color="red"
//                             leftSection={<IconTrash size={16} />}
//                             onClick={() => handleDeleteClick(router, todo.id)}
//                           >
//                             削除
//                           </Menu.Item>
//                         </Menu.Dropdown>
//                       </Menu>
//                     </Group>
//                   </Table.Td>
//                 </Table.Tr>
//               ))}
//             </Table.Tbody>
//           </Table>
//         </Table.ScrollContainer>
//         {filteredTodos.length > PAGINATION.ITEMS_PER_PAGE && (
//           <Group justify="center" mt="md">
//             <Pagination
//               value={pagination.active}
//               onChange={pagination.setPage}
//               total={Math.ceil(
//                 filteredTodos.length / PAGINATION.ITEMS_PER_PAGE
//               )}
//               siblings={PAGINATION.SIBLINGS}
//             />
//           </Group>
//         )}
//       </AuthGuard>
//     </Container>
//   );
// };

// export default CompleteTodoListContent;
