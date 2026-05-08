import { NextResponse } from "next/server";

import {
  authSessionCookieNames,
  deleteSessionByToken,
  getCurrentAuthSession,
  getAuthSessionCookieConfig,
  isAuthSessionCookieName,
  resolveSafeAuthRedirectPath,
} from "@/lib/auth";

function clearAuthCookies(request: Request, response: NextResponse) {
  const expires = new Date(0);
  const requestCookies = request.headers.get("cookie") ?? "";
  const cookieNames = requestCookies
    .split(";")
    .map((entry) => entry.trim().split("=")[0])
    .filter(Boolean);

  const namesToClear = new Set([
    ...authSessionCookieNames,
    ...cookieNames.filter(isAuthSessionCookieName),
  ]);

  for (const cookieName of namesToClear) {
    response.cookies.set(cookieName, "", getAuthSessionCookieConfig(expires));
  }
}

async function handleSignOut(request: Request, status: 302 | 303) {
  const requestUrl = new URL(request.url);
  const callbackUrl = resolveSafeAuthRedirectPath(
    requestUrl.searchParams.get("callbackUrl"),
    "/"
  );
  const currentSession = await getCurrentAuthSession();

  if (currentSession) {
    await deleteSessionByToken(currentSession.sessionToken);
  }

  const response = NextResponse.redirect(new URL(callbackUrl, request.url), status);

  clearAuthCookies(request, response);

  return response;
}

export async function GET(request: Request) {
  return handleSignOut(request, 302);
}

export async function POST(request: Request) {
  return handleSignOut(request, 303);
}
