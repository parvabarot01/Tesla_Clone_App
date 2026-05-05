import type { ApiErrorResponse, ApiSuccessResponse } from "@/types";

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

function isApiSuccessResponse<T>(value: unknown): value is ApiSuccessResponse<T> {
  return (
    typeof value === "object" &&
    value !== null &&
    "success" in value &&
    value.success === true &&
    "data" in value
  );
}

function isApiErrorResponse(value: unknown): value is ApiErrorResponse {
  return (
    typeof value === "object" &&
    value !== null &&
    "success" in value &&
    value.success === false &&
    "error" in value &&
    typeof value.error === "object" &&
    value.error !== null &&
    "code" in value.error &&
    "message" in value.error
  );
}

async function readJsonResponse(response: Response) {
  try {
    return (await response.json()) as unknown;
  } catch {
    return null;
  }
}

export async function fetchApiJson<T>(
  input: string | URL,
  init?: FetchJsonOptions
): Promise<T> {
  const response = await fetch(input, init);
  const payload = await readJsonResponse(response);

  if (response.ok && isApiSuccessResponse<T>(payload)) {
    return payload.data;
  }

  if (isApiErrorResponse(payload)) {
    throw new ApiRequestError({
      code: payload.error.code,
      details: payload.error.details,
      message: payload.error.message,
      status: response.status,
    });
  }

  throw new ApiRequestError({
    code: response.ok ? "INVALID_API_RESPONSE" : "API_REQUEST_FAILED",
    message: response.ok
      ? "The API returned an unexpected response."
      : "The API request failed.",
    status: response.status,
  });
}
