import "server-only";

import { randomBytes } from "node:crypto";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { ROUTES } from "@/constants/routes";
import type { User } from "@/generated/prisma/client";
import { getPrismaClient } from "@/lib/prisma";

export const authSessionCookieNames = [
  "__Secure-authjs.session-token",
  "authjs.session-token",
  "__Secure-next-auth.session-token",
  "next-auth.session-token",
] as const;

const authSessionMaxAgeMs = 1000 * 60 * 60 * 24 * 30;

export type AuthenticatedUser = Pick<User, "id" | "email" | "name">;

export type AuthenticatedSession = {
  expires: Date;
  sessionToken: string;
  user: AuthenticatedUser;
};

function getPreferredAuthSessionCookieName() {
  return process.env.NODE_ENV === "production"
    ? "__Secure-authjs.session-token"
    : "authjs.session-token";
}

async function getSessionToken() {
  const cookieStore = await cookies();

  for (const cookieName of authSessionCookieNames) {
    const sessionToken = cookieStore.get(cookieName)?.value;

    if (sessionToken) {
      return sessionToken;
    }
  }

  return (
    cookieStore
      .getAll()
      .find((cookie) =>
        authSessionCookieNames.some((cookieName) =>
          cookie.name.startsWith(cookieName)
        )
      )?.value ?? null
  );
}

export function resolveSafeAuthRedirectPath(
  callbackUrl?: string | null,
  fallbackPath = ROUTES.dashboard
) {
  if (
    !callbackUrl ||
    !callbackUrl.startsWith("/") ||
    callbackUrl.startsWith("//")
  ) {
    return fallbackPath;
  }

  return callbackUrl;
}

export function isAuthSessionCookieName(cookieName: string) {
  return authSessionCookieNames.some(
    (name) => cookieName === name || cookieName.startsWith(`${name}.`)
  );
}

export function getAuthSessionCookieConfig(expires: Date) {
  return {
    expires,
    httpOnly: true,
    path: "/",
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
  };
}

export async function getCurrentAuthSession(): Promise<AuthenticatedSession | null> {
  const sessionToken = await getSessionToken();

  if (!sessionToken) {
    return null;
  }

  try {
    const session = await getPrismaClient().session.findUnique({
      where: {
        sessionToken,
      },
      select: {
        expires: true,
        sessionToken: true,
        user: {
          select: {
            id: true,
            email: true,
            name: true,
          },
        },
      },
    });

    if (!session || session.expires <= new Date()) {
      return null;
    }

    return session;
  } catch {
    return null;
  }
}

export async function getCurrentAuthUser(): Promise<AuthenticatedUser | null> {
  const session = await getCurrentAuthSession();

  return session?.user ?? null;
}

export async function getCurrentAuthUserId() {
  const user = await getCurrentAuthUser();

  return user?.id ?? null;
}

export async function getCurrentAuthUserEmail() {
  const user = await getCurrentAuthUser();

  return user?.email ?? null;
}

export async function requireAuthenticatedUser(
  callbackUrl = ROUTES.dashboard
) {
  const user = await getCurrentAuthUser();

  if (!user) {
    redirect(ROUTES.signInWithCallback(callbackUrl));
  }

  return user;
}

function normalizeUserName(name?: string | null) {
  const trimmedName = name?.trim();

  return trimmedName ? trimmedName : null;
}

export async function createUserSession({
  email,
  name,
}: {
  email: string;
  name?: string | null;
}) {
  const normalizedEmail = email.trim().toLowerCase();
  const normalizedName = normalizeUserName(name);
  const prisma = getPrismaClient();

  const existingUser = await prisma.user.findUnique({
    where: {
      email: normalizedEmail,
    },
  });

  const user = existingUser
    ? normalizedName && existingUser.name !== normalizedName
      ? await prisma.user.update({
          where: {
            id: existingUser.id,
          },
          data: {
            name: normalizedName,
          },
        })
      : existingUser
    : await prisma.user.create({
        data: {
          email: normalizedEmail,
          name: normalizedName,
        },
      });

  const expires = new Date(Date.now() + authSessionMaxAgeMs);
  const sessionToken = randomBytes(32).toString("hex");

  await prisma.session.create({
    data: {
      expires,
      sessionToken,
      userId: user.id,
    },
  });

  return {
    cookieName: getPreferredAuthSessionCookieName(),
    expires,
    sessionToken,
    user: {
      email: user.email,
      id: user.id,
      name: user.name,
    } satisfies AuthenticatedUser,
  };
}

export async function deleteSessionByToken(sessionToken: string) {
  await getPrismaClient().session.deleteMany({
    where: {
      sessionToken,
    },
  });
}
