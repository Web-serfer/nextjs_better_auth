import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { hashPassword } from "better-auth/utils";

export const POST = async (request: Request) => {
  try {
    const { token, password } = await request.json();

    // Поиск валидного токена
    const resetRequest = await prisma.passwordReset.findFirst({
      where: {
        token,
        expiresAt: { gt: new Date() },
      },
      include: { user: true },
    });

    if (!resetRequest) {
      return NextResponse.json(
        { error: "Invalid or expired token" },
        { status: 400 }
      );
    }

    // Обновление пароля
    const hashedPassword = await hashPassword(password);
    await prisma.user.update({
      where: { id: resetRequest.userId },
      data: { password: hashedPassword },
    });

    // Удаление использованного токена
    await prisma.passwordReset.delete({
      where: { id: resetRequest.id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Password reset error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
};
