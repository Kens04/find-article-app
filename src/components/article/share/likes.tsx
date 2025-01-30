"use client";

import { Like } from "@/components/article/type";
import { Button } from "@mantine/core";
import { Session } from "@supabase/auth-helpers-nextjs";
import { IconHeart, IconHeartFilled } from "@tabler/icons-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

const Likes = ({
  id,
  likes,
  session,
}: {
  id: string;
  likes: Like[];
  session: Session | null;
}) => {
  const router = useRouter();
  const loginUserId = session?.user.id;
  const articleLikes = likes.filter((like) => like.articleId === id);
  const hasLiked = articleLikes.some((like) => like.userId === loginUserId);
  const [isLiked, setIsLiked] = useState(hasLiked);

  const handleLike = async () => {
    if (!loginUserId) return;

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_APP_URL}/api/likes`,
        {
          method: isLiked ? "DELETE" : "POST",
          headers: {
            "Content-Type": "application/json",
          },
            body: JSON.stringify({ articleId: id, userId: loginUserId }),
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to update like`);
      }

      setIsLiked(!isLiked);
      router.refresh();
    } catch (error) {
      console.error("Error updating like:", error);
    }
  };

  return (
    <Button
      onClick={handleLike}
      variant="outline"
      size="xs"
      color="pink"
      style={{
        border: "none",
        background: "none",
      }}
      disabled={!loginUserId}
    >
      {isLiked ? <IconHeartFilled /> : <IconHeart />}
      {articleLikes.length}
    </Button>
  );
};

export default Likes;
