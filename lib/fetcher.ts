import type { ApiResponse } from "@/types";

type FetchJsonOptions = RequestInit & {
  next?: NextFetchRequestConfig;
};

export class ApiRequestError extends Error {
  code: string;
  details?: unknown;
  status: number;

  constructor({
    code,
    details,
    message,
    status,
  }: {
    code: string;
    details?: unknown;
    message: string;
    status: number;
  }) {
    super(message);
    this.name = "ApiRequestError";
    this.code = code;
    this.details = details;
    this.status = status;
  }
}

export async function fetchApiJson<T>(
  input: string | URL,
  init?: FetchJsonOptions
): Promise<T> {
  const response = await fetch(input, init);
  const payload = (await response.json()) as ApiResponse<T>;

  if (!response.ok || !payload.success) {
    throw new ApiRequestError({
      code: payload.success ? "API_REQUEST_FAILED" : payload.error.code,
      details: payload.success ? undefined : payload.error.details,
      message: payload.success
        ? "The API request failed."
        : payload.error.message,
      status: response.status,
    });
  }

  return payload.data;
}
