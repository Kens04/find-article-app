"use client";

import { handleDelete } from "@/components/todo/action";
import { Button } from "@mantine/core";
import { useRouter } from "next/navigation";

const DeleteButton = ({ id }: { id: string }) => {
  const router = useRouter();

  const handleClick = async () => {
    try {
      await handleDelete(id);
      router.refresh();
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
      <Button onClick={handleClick}>削除</Button>
    </>
  );
};

export default DeleteButton;
