"use client";

import { handleDeleteClick } from "@/utils/action";
import { Button } from "@mantine/core";
import { useRouter } from "next/navigation";

const DeleteButton = ({ id }: { id: string }) => {
  const router = useRouter();

  return (
    <>
      <Button onClick={() => handleDeleteClick(router, id)} color="red">
        削除
      </Button>
    </>
  );
};

export default DeleteButton;
