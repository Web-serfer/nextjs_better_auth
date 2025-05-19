import { betterAuth, BetterAuthOptions } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { PrismaClient } from "@prisma/client";
import { sendEmail } from "../actions/send-email";
import { nextCookies } from "better-auth/next-js";
import { openAPI } from "better-auth/plugins";
import {
  getVerificationEmailTemplate,
  verificationEmailSubject,
} from "../lib/email";

const prisma = new PrismaClient();

const requiredEnvVars = [
  "GOOGLE_CLIENT_ID",
  "GOOGLE_CLIENT_SECRET",
  "VK_CLIENT_ID",
  "VK_CLIENT_SECRET",
  "YANDEX_CLIENT_ID",
  "YANDEX_CLIENT_SECRET",
  "EMAIL_VERIFICATION_CALLBACK_URL",
];

for (const envVar of requiredEnvVars) {
  if (!process.env[envVar]) {
    throw new Error(`Missing required environment variable: ${envVar}`);
  }
}

interface VkProfile {
  response: Array<{
    id: number;
    first_name: string;
    last_name: string;
    photo_200?: string;
  }>;
  email: string;
}

interface YandexProfile {
  id: string;
  real_name?: string;
  display_name?: string;
  default_email: string;
  default_avatar_id?: string;
}

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),

  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
  },

  emailVerification: {
    sendOnSignUp: true,
    autoSignInAfterVerification: true,
    sendVerificationEmail: async ({ user, token }) => {
      const verificationUrl = `${process.env.BETTER_AUTH_URL}/api/auth/verify-email?token=${token}&callbackURL=${process.env.EMAIL_VERIFICATION_CALLBACK_URL}`;
      await sendEmail({
        to: user.email,
        subject: verificationEmailSubject,
        text: `Для подтверждения email перейдите по ссылке: ${verificationUrl}`,
        html: getVerificationEmailTemplate(verificationUrl),
      });
    },
  },

  plugins: [openAPI(), nextCookies()], // /api/auth/reference

  oauth: {
    enabled: true,
    providers: {
      google: {
        clientId: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      },
      vk: {
        clientId: process.env.VK_CLIENT_ID,
        clientSecret: process.env.VK_CLIENT_SECRET,
        authorizationUrl: "https://oauth.vk.com/authorize ",
        tokenUrl: "https://oauth.vk.com/access_token ",
        profileUrl: "https://api.vk.com/method/users.get ",
        scope: ["email"],
        profile: (profile: VkProfile) => ({
          id: profile.response[0].id.toString(),
          name: `${profile.response[0].first_name} ${profile.response[0].last_name}`,
          email: profile.email,
          image: profile.response[0].photo_200,
        }),
      },
      yandex: {
        clientId: process.env.YANDEX_CLIENT_ID,
        clientSecret: process.env.YANDEX_CLIENT_SECRET,
        authorizationUrl: "https://oauth.yandex.ru/authorize ",
        tokenUrl: "https://oauth.yandex.ru/token ",
        profileUrl: "https://login.yandex.ru/info ",
        scope: ["login:email", "login:info"],
        profile: (profile: YandexProfile) => ({
          id: profile.id,
          name: profile.real_name || profile.display_name,
          email: profile.default_email,
          image: profile.default_avatar_id
            ? `https://avatars.yandex.net/get-yapic/ ${profile.default_avatar_id}/islands-200`
            : null,
        }),
      },
    },
  },

  sessions: {
    maxAge: 30 * 24 * 60 * 60, // 30 дней
    updateAge: 24 * 60 * 60, // Обновлять сессию каждые 24 часа
    secure: process.env.NODE_ENV === "production",
  },
} satisfies BetterAuthOptions);
