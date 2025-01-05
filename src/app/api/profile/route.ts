import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { userId, name, avatarUrl } = body;

    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    // Prismaでユーザー情報を更新
    const updatedUser = await prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        name,
        avatarUrl,
      },
    });

    return NextResponse.json({ data: updatedUser });
  } catch (error) {
    console.error("Error updating profile:", error);
    return NextResponse.json(
      { error: "Failed to update profile" },
      { status: 500 }
    );
  }
}
