import { TodoStatus } from "@/components/todo/type";

export const handleDelete = async (id: string) => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_APP_URL}/api/todos/${id}`,
    {
      method: "DELETE",
    }
  );
  return response.json();
};

export const Todos = async () => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_APP_URL}/api/todos`,
      {
        cache: "no-store",
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
        cache: "no-store",
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
        cache: "no-store",
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
}: {
  id: string;
  isPublic: boolean;
}) => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_APP_URL}/api/todos/${id}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ isPublic: isPublic }),
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
