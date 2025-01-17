"use client";

import { TodoList } from "@/components/todo/type";
import { Button } from "@mantine/core";
import { Session } from "@supabase/auth-helpers-nextjs";
import { IconHeart, IconHeartFilled } from "@tabler/icons-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

const Likes = ({
  id,
  likes,
  todo,
  session,
}: {
  id: string;
  likes: number;
  todo: TodoList;
  session: Session | null;
}) => {
  const router = useRouter();
  const [isLiked, setIsLiked] = useState(false);

  const handleLike = async () => {
    try {
      setIsLiked(!isLiked);
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_APP_URL}/api/todos/${id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          cache: "no-store",
          body: JSON.stringify({ likes: !likes ? likes + 1 : likes - 1 }),
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to update like`);
      }

      const { data } = await response.json();
      router.refresh();
      return data;
    } catch (error) {
      console.error("Error updating like:", error);
      throw error;
    }
  };

  return (
    <>
      {todo.userId === session?.user.id ? (
        <Button
          onClick={() => handleLike()}
          variant="outline"
          size="xs"
          color="pink"
          style={{
            border: "none",
            background: "none",
          }}
        >
          {isLiked ? <IconHeartFilled /> : <IconHeart />}
          {todo.likes}
        </Button>
      ) : (
        <>
          <IconHeart />
          {todo.likes}
        </>
      )}
    </>
  );
};

export default Likes;
