import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { sendPasswordResetEmail } from "@/lib/mailer";
import { generateToken } from "better-auth/utils";

export const POST = async (request: Request) => {
  try {
    const { email } = await request.json();

    // Проверка существования пользователя
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return NextResponse.json(
        { success: true }, // Не раскрываем информацию о существовании email
        { status: 200 }
      );
    }

    // Генерация токена
    const resetToken = generateToken(32);
    const expiresAt = new Date(Date.now() + 3600000); // 1 час

    // Сохранение токена в базе
    await prisma.passwordReset.upsert({
      where: { userId: user.id },
      update: { token: resetToken, expiresAt },
      create: {
        token: resetToken,
        expiresAt,
        userId: user.id,
      },
    });

    // Отправка email
    await sendPasswordResetEmail(user.email, resetToken);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Password reset error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
};
