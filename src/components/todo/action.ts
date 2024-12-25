import { TodoStatus } from "@/components/todo/type";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
export const dynamic = "force-dynamic";

export const handleDelete = async (id: string) => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_APP_URL}/api/todos/${id}`,
    {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
    }
  );
  return response.json();
};

export const Todos = async () => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_APP_URL}/api/todos`,
      {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      }
    );
    return await response.json();
  } catch (err) {
    console.log(err);
  }
};

export const TodoDetail = async ({ params }: { params: { id: string } }) => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_APP_URL}/api/todos/${params.id}`,
      {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      }
    );
    return await response.json();
  } catch (err) {
    console.log(err);
  }
};

export const handleUpdateStatus = async ({
  id,
  status,
  completedAt,
}: {
  id: string;
  status: TodoStatus;
  completedAt: string | null;
}) => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_APP_URL}/api/todos/${id}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status,
          completedAt: completedAt ? new Date(completedAt) : null,
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to update status: ${response.statusText}`);
    }

    return response.json();
  } catch (error) {
    console.error("Error updating status:", error);
    throw error;
  }
};

export const handleTextSave = async ({
  id,
  text,
}: {
  id: string;
  text: string;
}) => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_APP_URL}/api/todos/${id}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text }),
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to update status: ${response.statusText}`);
    }

    return response.json();
  } catch (error) {
    console.error("Error updating status:", error);
    throw error;
  }
};

export const handleIsPublic = async ({
  id,
  isPublic,
  sharedAt,
}: {
  id: string;
  isPublic: boolean;
  sharedAt: Date;
}) => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_APP_URL}/api/todos/${id}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ isPublic: isPublic, sharedAt: sharedAt }),
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to update public`);
    }

    return response.json();
  } catch (error) {
    console.error("Error updating public:", error);
    throw error;
  }
};

export const handleFavorite = async ({
  id,
  isFavorite,
}: {
  id: string;
  isFavorite: boolean;
}) => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_APP_URL}/api/todos/${id}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ isFavorite: isFavorite }),
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to update favorite`);
    }

    return response.json();
  } catch (error) {
    console.error("Error updating favorite:", error);
    throw error;
  }
};

export const handleDeleteClick = async (
  router: AppRouterInstance,
  id: string
) => {
  try {
    await handleDelete(id);
    router.refresh();
  } catch (err) {
    console.log(err);
  }
};

export const handleShareClick = async (
  router: AppRouterInstance,
  id: string,
  isPublic: boolean,
  sharedAt: Date
) => {
  try {
    await handleIsPublic({
      id: id,
      isPublic: !isPublic,
      sharedAt: new Date(sharedAt),
    });
    router.refresh();
  } catch (error) {
    console.error("public update failed:", error);
  }
};
