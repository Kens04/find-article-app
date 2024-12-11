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

export const handleUpdateStatus = async ({
  id,
  status,
  completedAt,
}: {
  id: string;
  status: TodoStatus;
  completedAt: string | null
}) => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_APP_URL}/api/todos/${id}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ status, completedAt: completedAt ? new Date(completedAt) : null }),
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
