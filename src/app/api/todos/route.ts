import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    console.log("Fetching todos from database...");
    const todos = await prisma.todo.findMany();
    console.log("Fetched todos:", todos);
    return NextResponse.json({ data: todos });
  } catch (err) {
    console.error("Error fetching todos:", err);
    return NextResponse.json(err);
  }
}
