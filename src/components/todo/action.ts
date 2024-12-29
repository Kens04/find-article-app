import { CreateTodoInput, TodoStatus } from "@/components/todo/type";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

export const handleDelete = async (id: string) => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_APP_URL}/api/todos/${id}`,
    {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      cache: "no-store",
    }
  );

  if (!response.ok) {
    throw new Error(`Failed to delete todo: ${response.statusText}`);
  }
  // return response.json();
  const { data } = await response.json();
  return data;
};

export const createTodo = async (todo: CreateTodoInput) => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_APP_URL}/api/create-todo`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(todo),
      }
    );

    if (!response.ok) {
      console.error(
        "Create todo response:",
        response.status,
        response.statusText
      );
      throw new Error(`Failed to create todo: ${response.statusText}`);
    }

    const { data } = await response.json();
    console.log("Created todo data:", data);
    return data;
  } catch (error) {
    console.error("Error in createTodo:", error);
    throw error;
  }
};

export const Todos = async () => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_APP_URL}/api/todos`,
      {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        cache: "no-store",
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const text = await response.text(); // まず文字列として読み込む
    try {
      const json = JSON.parse(text); // JSONとしてパース
      return json.data;
    } catch {
      console.error("Invalid JSON response:", text);
      throw new Error("Invalid JSON response from server");
    }
  } catch (err) {
    console.error("Error in Todos function:", err);
    return []; // エラー時は空配列を返す
  }
};

export const TodoDetail = async ({ params }: { params: { id: string } }) => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_APP_URL}/api/todos/${params.id}`,
      {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        cache: "no-store",
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to get todo detail: ${response.statusText}`);
    }

    // return await response.json();
    const { data } = await response.json();
    return data;
  } catch (err) {
    console.log(err);
    throw err;
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
        cache: "no-store",
        body: JSON.stringify({
          status,
          completedAt: completedAt ? new Date(completedAt) : null,
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to update status: ${response.statusText}`);
    }

    // return response.json();
    const { data } = await response.json();
    return data;
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
        cache: "no-store",
        body: JSON.stringify({ text }),
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to update status: ${response.statusText}`);
    }

    // return response.json();
    const { data } = await response.json();
    return data;
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
        cache: "no-store",
        body: JSON.stringify({ isPublic: isPublic, sharedAt: sharedAt }),
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to update public`);
    }

    // return response.json();
    const { data } = await response.json();
    return data;
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
        cache: "no-store",
        body: JSON.stringify({ isFavorite: isFavorite }),
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to update favorite`);
    }

    // return response.json();
    const { data } = await response.json();
    return data;
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
    throw err;
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
    throw error;
  }
};
