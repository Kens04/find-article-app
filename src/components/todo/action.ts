export const handleDelete = async (id: string) => {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_APP_URL}/api/todos/${id}`,
      {
        method: "DELETE",
      }
    );
    return response.json();
};

export const Todos = async() => {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/todos`, {
      cache: "no-store",
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });
    return await response.json();
  } catch (err) {
    console.log(err);
  }
}
