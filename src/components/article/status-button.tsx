"use client";

import { Select } from "@mantine/core";
import { handleUpdateStatus } from "@/utils/action";
import { ArticleList, ArticleStatus } from "../../types/type";
import { useRouter } from "next/navigation";

interface StatusButtonProps {
  article: ArticleList;
}

const StatusButton = ({ article }: StatusButtonProps) => {
  const router = useRouter();
  const statusOptions = [
    { value: ArticleStatus.UNREAD, label: "未読" },
    { value: ArticleStatus.READING, label: "読書中" },
    { value: ArticleStatus.COMPLETED, label: "完了" },
  ];

  const handleStatusChange = async (selectedStatus: string | null) => {
    if (!selectedStatus) return;

    try {
      const newStatus = selectedStatus as ArticleStatus;
      await handleUpdateStatus({
        id: article.id,
        status: newStatus,
        isToday:
          newStatus === ArticleStatus.COMPLETED ? false : article.isToday,
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
      value={article.status}
      onChange={handleStatusChange}
      clearable={false}
    />
  );
};

export default StatusButton;
