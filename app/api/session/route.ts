import { getCurrentAuthUser } from "@/lib/auth";
import { createApiSuccessResponse } from "@/lib/api";

export async function GET() {
  const user = await getCurrentAuthUser();

  return createApiSuccessResponse({
    authenticated: Boolean(user),
    user,
  });
}
