import { NextResponse } from "next/server";

import type { ApiErrorResponse, ApiSuccessResponse } from "@/types";

export function createApiSuccess<T>(data: T): ApiSuccessResponse<T> {
  return {
    success: true,
    data,
  };
}

export function createApiError(
  code: string,
  message: string,
  details?: unknown
): ApiErrorResponse {
  return {
    success: false,
    error: {
      code,
      message,
      ...(details === undefined ? {} : { details }),
    },
  };
}

export function createApiSuccessResponse<T>(data: T, init?: ResponseInit) {
  return NextResponse.json(createApiSuccess(data), init);
}

export function createApiErrorResponse(
  code: string,
  message: string,
  options: {
    details?: unknown;
    status?: number;
  } = {}
) {
  return NextResponse.json(
    createApiError(code, message, options.details),
    options.status ? { status: options.status } : undefined
  );
}

export function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

export function readRecord(value: unknown) {
  return isRecord(value) ? value : {};
}

export function readString(value: unknown, fallback = "") {
  return typeof value === "string" ? value : fallback;
}
