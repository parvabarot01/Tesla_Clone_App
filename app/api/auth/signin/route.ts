import { NextResponse } from "next/server";

import {
  createUserSession,
  getAuthSessionCookieConfig,
  resolveSafeAuthRedirectPath,
} from "@/lib/auth";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function buildSignInRedirect(requestUrl: string, callbackUrl: string, error?: string) {
  const redirectUrl = new URL("/sign-in", requestUrl);

  redirectUrl.searchParams.set("callbackUrl", callbackUrl);

  if (error) {
    redirectUrl.searchParams.set("error", error);
  }

  return redirectUrl;
}

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const callbackUrl = resolveSafeAuthRedirectPath(
    requestUrl.searchParams.get("callbackUrl")
  );

  return NextResponse.redirect(buildSignInRedirect(request.url, callbackUrl), 307);
}

export async function POST(request: Request) {
  const requestUrl = new URL(request.url);
  const callbackUrl = resolveSafeAuthRedirectPath(
    requestUrl.searchParams.get("callbackUrl")
  );

  let formData: FormData;

  try {
    formData = await request.formData();
  } catch {
    return NextResponse.redirect(
      buildSignInRedirect(request.url, callbackUrl, "invalid-request"),
      303
    );
  }

  const email = formData.get("email");
  const name = formData.get("name");
  const normalizedEmail = typeof email === "string" ? email.trim() : "";
  const normalizedName = typeof name === "string" ? name.trim() : "";

  if (!emailPattern.test(normalizedEmail)) {
    return NextResponse.redirect(
      buildSignInRedirect(request.url, callbackUrl, "invalid-email"),
      303
    );
  }

  try {
    const session = await createUserSession({
      email: normalizedEmail,
      name: normalizedName,
    });
    const response = NextResponse.redirect(new URL(callbackUrl, request.url), 303);

    response.cookies.set(
      session.cookieName,
      session.sessionToken,
      getAuthSessionCookieConfig(session.expires)
    );

    return response;
  } catch {
    return NextResponse.redirect(
      buildSignInRedirect(request.url, callbackUrl, "sign-in-failed"),
      303
    );
  }
}
