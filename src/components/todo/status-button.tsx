"use client";

import { Select } from "@mantine/core";
import { handleUpdateStatus } from "@/components/todo/action";
import { TodoList, TodoStatus } from "./type";
import { useRouter } from "next/navigation";

interface StatusButtonProps {
  todo: TodoList;
}

const StatusButton = ({ todo }: StatusButtonProps) => {
  const router = useRouter();
  const statusOptions = [
    { value: TodoStatus.UNREAD, label: "未読" },
    { value: TodoStatus.READING, label: "読書中" },
    { value: TodoStatus.COMPLETED, label: "完了" },
  ];

  const handleStatusChange = async (selectedStatus: string | null) => {
    if (!selectedStatus) return;

    try {
      const newStatus = selectedStatus as TodoStatus;
      await handleUpdateStatus({
        id: todo.id,
        status: newStatus,
        isToday: newStatus === TodoStatus.COMPLETED ? false : todo.isToday,
      });
      router.refresh();
    } catch (error) {
      console.error("Status update failed:", error);
    }
  };

  return (
    <Select
      placeholder="ステータスを選択"
      data={statusOptions}
      value={todo.status}
      onChange={handleStatusChange}
      clearable={false}
    />
  );
};

export default StatusButton;
