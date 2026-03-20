import { NextRequest, NextResponse } from "next/server";
import type { GenerateApiRequest, GenerateApiResponse, ApiError } from "@rndr/types";

const AI_SERVICE_URL = process.env.AI_SERVICE_URL ?? "http://localhost:3001";
const AI_SERVICE_SECRET = process.env.AI_SERVICE_SECRET ?? "";

/**
 * POST /api/generate
 *
 * Thin proxy between the Next.js frontend and the AI service.
 * This keeps the AI_SERVICE_SECRET out of the browser bundle.
 */
export async function POST(req: NextRequest) {
  let body: GenerateApiRequest;

  try {
    body = (await req.json()) as GenerateApiRequest;
  } catch {
    return NextResponse.json<ApiError>(
      { error: "Invalid JSON body" },
      { status: 400 }
    );
  }

  if (!body.prompt?.trim()) {
    return NextResponse.json<ApiError>(
      { error: "prompt is required" },
      { status: 400 }
    );
  }

  try {
    const upstream = await fetch(`${AI_SERVICE_URL}/generate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-service-secret": AI_SERVICE_SECRET,
      },
      body: JSON.stringify(body),
    });

    if (!upstream.ok) {
      const err = (await upstream.json().catch(() => ({
        error: "AI service error",
      }))) as ApiError;
      return NextResponse.json<ApiError>(err, { status: upstream.status });
    }

    const data = (await upstream.json()) as GenerateApiResponse;
    return NextResponse.json<GenerateApiResponse>(data);
  } catch (err) {
    console.error("[/api/generate] upstream error:", err);
    return NextResponse.json<ApiError>(
      { error: "Failed to reach AI service" },
      { status: 502 }
    );
  }
}
