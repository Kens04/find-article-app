import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    console.log("Fetching todos from database...");

    if (!prisma) {
      console.error("Prisma client is not initialized");
      return NextResponse.json(
        { error: "Database connection error" },
        { status: 500 }
      );
    }

    const todos = await prisma.todo.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    if (!todos) {
      console.log("No todos found");
      return NextResponse.json({ data: [] });
    }

    console.log(`Successfully fetched ${todos.length} todos`);
    return NextResponse.json({ data: todos });
  } catch (err) {
    console.error("Error in GET /api/todos:", err);
    return NextResponse.json(
      { error: "Failed to fetch todos", details: err },
      { status: 500 }
    );
  }
}
