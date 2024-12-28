// "use client";

// import "@mantine/notifications/styles.css";
// import {
//   handleDeleteClick,
//   handleFavorite,
//   handleShareClick,
// } from "@/components/todo/action";
// import { ActionIcon, Menu, Pagination, Table, Tabs } from "@mantine/core";
// import {
//   IconBookOff,
//   IconBook,
//   IconTrash,
//   IconDots,
//   IconEye,
//   IconShare,
// } from "@tabler/icons-react";
// import { notifications } from "@mantine/notifications";
// import CategorySearch from "@/components/todo/category-search";
// import AuthGuard from "@/components/todo/components/auth-auard";
// import StatusButton from "@/components/todo/status-button";
// import { TodoStatus, type TodoList } from "@/components/todo/type";
// import { Text, Group, Title, Anchor, Container } from "@mantine/core";
// import { Session } from "@supabase/auth-helpers-nextjs";
// import { IconStar, IconStarFilled } from "@tabler/icons-react";
// import Link from "next/link";
// import { useRouter } from "next/navigation";
// import { useState } from "react";
// import { usePagination } from "@mantine/hooks";
// import { PAGINATION } from "@/components/todo/pagination";

// const TodoListContent = ({
//   todos,
//   session,
// }: {
//   todos: TodoList[];
//   session: Session | null;
// }) => {
//   const router = useRouter();
//   const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
//   const [sort, setSort] = useState<"asc" | "desc" | null>(null);
//   const pagination = usePagination({
//     total: Math.ceil(todos.length / PAGINATION.ITEMS_PER_PAGE),
//     initialPage: 1,
//   });

//   // 未完了のTODOのみをフィルタリング
//   const unreadTodos = todos.filter((todo) => {
//     return todo.status == TodoStatus.UNREAD && todo.userId === session?.user?.id;
//   });
//   const readingTodos = todos.filter(
//     (todo) =>
//       todo.status === TodoStatus.READING && todo.userId === session?.user?.id
//   );

//   // ソート関数を適用したTODOリストを取得
//   const getSortedTodos = (todos: TodoList[]) => {
//     if (!sort) return todos;
//     console.log("Sorting todos with sort:", sort);

//     return [...todos].sort((a, b) => {
//       const dateA = new Date(a.dueDate).getTime();
//       const dateB = new Date(b.dueDate).getTime();
//       return sort === "asc" ? dateA - dateB : dateB - dateA;
//     });
//   };

//   const filteredUnreadTodos = getSortedTodos(
//     selectedCategories.length === 0
//       ? unreadTodos
//       : unreadTodos.filter((todo) =>
//           selectedCategories.includes(todo.category || "")
//         )
//   );

//   const filteredReadingTodos = getSortedTodos(
//     selectedCategories.length === 0
//       ? readingTodos
//       : readingTodos.filter((todo) =>
//           selectedCategories.includes(todo.category || "")
//         )
//   );

//   // ページネーション処理
//   const start = (pagination.active - 1) * PAGINATION.ITEMS_PER_PAGE;
//   const end = start + PAGINATION.ITEMS_PER_PAGE;
//   const paginatedUnreadTodos = filteredUnreadTodos.slice(start, end);
//   const paginatedReadingTodos = filteredReadingTodos.slice(start, end);

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
//       router.refresh();
//     } catch (error) {
//       console.error("favorite update failed:", error);
//     }
//   };

//   return (
//     <Container maw="100%" w="100%" mt="lg">
//       <Title order={2} mb="md">
//         TODOリスト
//       </Title>
//       <AuthGuard todos={todos} session={session}>
//         <Tabs defaultValue="todolist" mt="md">
//           <Tabs.List>
//             <Tabs.Tab value="todolist" leftSection={<IconBookOff />}>
//               未読
//             </Tabs.Tab>
//             <Tabs.Tab value="reading" leftSection={<IconBook />}>
//               読書中
//             </Tabs.Tab>
//           </Tabs.List>
//           <Tabs.Panel value="todolist">
//             <Group mt="md">
//               <CategorySearch
//                 todos={unreadTodos}
//                 selectedCategories={selectedCategories}
//                 onCategoryChange={setSelectedCategories}
//                 onSortChange={setSort}
//                 sort={sort}
//                 label="締切日"
//               />
//             </Group>
//             <Table.ScrollContainer
//               minWidth={1000}
//               w="100%"
//               maw="100%"
//               type="native"
//             >
//               <Table highlightOnHover mt="md">
//                 <Table.Thead>
//                   <Table.Tr>
//                     <Table.Th>タイトル</Table.Th>
//                     <Table.Th>URL</Table.Th>
//                     <Table.Th>カテゴリ</Table.Th>
//                     <Table.Th>締切日</Table.Th>
//                     <Table.Th>ステータス変更</Table.Th>
//                     <Table.Th style={{ textAlign: "center" }}>
//                       アクション
//                     </Table.Th>
//                   </Table.Tr>
//                 </Table.Thead>
//                 <Table.Tbody>
//                   {paginatedUnreadTodos.map((todo) => (
//                     <Table.Tr key={todo.id}>
//                       <Table.Td>
//                         <Text>{todo.title}</Text>
//                       </Table.Td>
//                       <Table.Td>
//                         <Anchor
//                           href={todo.url}
//                           target="_blank"
//                           rel="noopener noreferrer"
//                         >
//                           <Text lineClamp={1} size="sm">
//                             {todo.url}
//                           </Text>
//                         </Anchor>
//                       </Table.Td>
//                       <Table.Td>{todo.category || "未分類"}</Table.Td>
//                       <Table.Td>
//                         {new Date(todo.dueDate).toLocaleDateString()}
//                       </Table.Td>
//                       <Table.Td>
//                         <StatusButton todo={todo} />
//                       </Table.Td>
//                       <Table.Td>
//                         <Group justify="center">
//                           <Menu shadow="md" width={200}>
//                             <Menu.Target>
//                               <ActionIcon variant="subtle">
//                                 <IconDots size={16} />
//                               </ActionIcon>
//                             </Menu.Target>

//                             <Menu.Dropdown>
//                               <Menu.Label>アクション</Menu.Label>

//                               <Menu.Item
//                                 component={Link}
//                                 href={`/dashboard/todo-list/${todo.id}`}
//                                 leftSection={<IconEye size={16} />}
//                               >
//                                 詳細を表示
//                               </Menu.Item>

//                               <Menu.Item
//                                 onClick={() =>
//                                   handleFavoriteClick(todo.id, todo.isFavorite)
//                                 }
//                                 leftSection={
//                                   todo.isFavorite ? (
//                                     <IconStarFilled size={16} color="orange" />
//                                   ) : (
//                                     <IconStar size={16} />
//                                   )
//                                 }
//                               >
//                                 {todo.isFavorite
//                                   ? "お気に入りから削除"
//                                   : "お気に入りに追加"}
//                               </Menu.Item>

//                               <Menu.Item
//                                 onClick={() =>
//                                   handleShareClick(
//                                     router,
//                                     todo.id,
//                                     todo.isPublic,
//                                     todo.sharedAt
//                                   )
//                                 }
//                                 leftSection={<IconShare size={16} />}
//                               >
//                                 {todo.isPublic ? "共有を解除" : "共有する"}
//                               </Menu.Item>

//                               <Menu.Divider />

//                               <Menu.Item
//                                 color="red"
//                                 leftSection={<IconTrash size={16} />}
//                                 onClick={() =>
//                                   handleDeleteClick(router, todo.id)
//                                 }
//                               >
//                                 削除
//                               </Menu.Item>
//                             </Menu.Dropdown>
//                           </Menu>
//                         </Group>
//                       </Table.Td>
//                     </Table.Tr>
//                   ))}
//                 </Table.Tbody>
//               </Table>
//             </Table.ScrollContainer>
//             {filteredUnreadTodos.length > PAGINATION.ITEMS_PER_PAGE && (
//               <Group justify="center" mt="md">
//                 <Pagination
//                   value={pagination.active}
//                   onChange={pagination.setPage}
//                   total={Math.ceil(
//                     filteredUnreadTodos.length / PAGINATION.ITEMS_PER_PAGE
//                   )}
//                   siblings={PAGINATION.SIBLINGS}
//                 />
//               </Group>
//             )}
//           </Tabs.Panel>
//           <Tabs.Panel value="reading">
//             <Group mt="md">
//               <CategorySearch
//                 todos={readingTodos}
//                 selectedCategories={selectedCategories}
//                 onCategoryChange={setSelectedCategories}
//                 onSortChange={setSort}
//                 sort={sort}
//                 label="締切日"
//               />
//             </Group>
//             <Table.ScrollContainer
//               minWidth={1000}
//               w="100%"
//               maw="100%"
//               type="native"
//             >
//               <Table highlightOnHover mt="md">
//                 <Table.Thead>
//                   <Table.Tr>
//                     <Table.Th>タイトル</Table.Th>
//                     <Table.Th>URL</Table.Th>
//                     <Table.Th>カテゴリ</Table.Th>
//                     <Table.Th>締切日</Table.Th>
//                     <Table.Th>ステータス変更</Table.Th>
//                     <Table.Th style={{ textAlign: "center" }}>
//                       アクション
//                     </Table.Th>
//                   </Table.Tr>
//                 </Table.Thead>
//                 <Table.Tbody>
//                   {paginatedReadingTodos.map((todo) => (
//                     <Table.Tr key={todo.id}>
//                       <Table.Td>
//                         <Text>{todo.title}</Text>
//                       </Table.Td>
//                       <Table.Td>
//                         <Anchor
//                           href={todo.url}
//                           target="_blank"
//                           rel="noopener noreferrer"
//                         >
//                           <Text lineClamp={1} size="sm">
//                             {todo.url}
//                           </Text>
//                         </Anchor>
//                       </Table.Td>
//                       <Table.Td>{todo.category || "未分類"}</Table.Td>
//                       <Table.Td>
//                         {new Date(todo.dueDate).toLocaleDateString()}
//                       </Table.Td>
//                       <Table.Td>
//                         <StatusButton todo={todo} />
//                       </Table.Td>
//                       <Table.Td>
//                         <Group justify="center">
//                           <Menu shadow="md" width={200}>
//                             <Menu.Target>
//                               <ActionIcon variant="subtle">
//                                 <IconDots size={16} />
//                               </ActionIcon>
//                             </Menu.Target>

//                             <Menu.Dropdown>
//                               <Menu.Label>アクション</Menu.Label>

//                               <Menu.Item
//                                 component={Link}
//                                 href={`/dashboard/todo-list/${todo.id}`}
//                                 leftSection={<IconEye size={16} />}
//                               >
//                                 詳細を表示
//                               </Menu.Item>

//                               <Menu.Item
//                                 onClick={() =>
//                                   handleFavoriteClick(todo.id, todo.isFavorite)
//                                 }
//                                 leftSection={
//                                   todo.isFavorite ? (
//                                     <IconStarFilled size={16} color="orange" />
//                                   ) : (
//                                     <IconStar size={16} />
//                                   )
//                                 }
//                               >
//                                 {todo.isFavorite
//                                   ? "お気に入りから削除"
//                                   : "お気に入りに追加"}
//                               </Menu.Item>

//                               <Menu.Item
//                                 onClick={() =>
//                                   handleShareClick(
//                                     router,
//                                     todo.id,
//                                     todo.isPublic,
//                                     todo.sharedAt
//                                   )
//                                 }
//                                 leftSection={<IconShare size={16} />}
//                               >
//                                 {todo.isPublic ? "共有を解除" : "共有する"}
//                               </Menu.Item>

//                               <Menu.Divider />

//                               <Menu.Item
//                                 color="red"
//                                 leftSection={<IconTrash size={16} />}
//                                 onClick={() =>
//                                   handleDeleteClick(router, todo.id)
//                                 }
//                               >
//                                 削除
//                               </Menu.Item>
//                             </Menu.Dropdown>
//                           </Menu>
//                         </Group>
//                       </Table.Td>
//                     </Table.Tr>
//                   ))}
//                 </Table.Tbody>
//               </Table>
//             </Table.ScrollContainer>
//             {filteredReadingTodos.length > PAGINATION.ITEMS_PER_PAGE && (
//               <Group justify="center" mt="md">
//                 <Pagination
//                   value={pagination.active}
//                   onChange={pagination.setPage}
//                   total={Math.ceil(
//                     filteredReadingTodos.length / PAGINATION.ITEMS_PER_PAGE
//                   )}
//                   siblings={PAGINATION.SIBLINGS}
//                 />
//               </Group>
//             )}
//           </Tabs.Panel>
//         </Tabs>
//       </AuthGuard>
//     </Container>
//   );
// };

// export default TodoListContent;
