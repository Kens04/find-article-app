import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    console.log("API: Fetching todos from database...");

    if (!prisma) {
      console.error("API: Prisma client is not initialized");
      return NextResponse.json(
        { error: "Database connection error" },
        { status: 500 }
      );
    }

    const todos = await prisma.todo.findMany({
      orderBy: {
        createdAt: "desc",
      },
      include: {
        user: true,
      },
    });

    console.log(`API: Successfully fetched ${todos.length} todos`);

    if (!todos || !Array.isArray(todos)) {
      console.log("API: No todos found or invalid data");
      return NextResponse.json({ data: [] });
    }

    return NextResponse.json({ data: todos });
  } catch (err) {
    console.error("API: Error in GET /api/todos:", err);
    return NextResponse.json(
      { error: "Failed to fetch todos", details: err },
      { status: 500 }
    );
  }
}
