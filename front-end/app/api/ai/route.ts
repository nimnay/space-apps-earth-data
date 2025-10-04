import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const {
      mode,
      location,
      activity,
      message = "",
    }: {
      mode?: string;
      location?: string;
      activity?: string;
      message?: string;
    } = body || {};

    const user_context = message.trim();

    if (!mode || !["wildfire", "pollution"].includes(mode)) {
      return NextResponse.json(
        { error: 'Invalid or missing mode. Must be "wildfire" or "pollution"' },
        { status: 400 }
      );
    }

    const baseURL = "http://localhost:8000";
    const endpoint =
      mode === "wildfire"
        ? `${baseURL}/wildfire-advice`
        : `${baseURL}/pollution-advice`;

    const payload =
      mode === "wildfire"
        ? { location, user_context }
        : { location, activity, user_context };

    let resp: Response;
    try {
      resp = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
    } catch (e: any) {
      return NextResponse.json(
        { error: `Failed to reach upstream service: ${e?.message || e}` },
        { status: 502 }
      );
    }

    let data: any = null;

    try {
      data = await resp.json();
    } catch {
      return NextResponse.json(
        { error: "Invalid JSON from upstream service" },
        { status: 502 }
      );
    }

    if (!resp.ok) {
      return NextResponse.json(
        {
          error: data?.error || "Upstream service error",
          status: resp.status,
        },
        { status: 502 }
      );
    }

    if (typeof data?.advice !== "string") {
      return NextResponse.json(
        { error: "Upstream response missing advice string" },
        { status: 502 }
      );
    }

    return NextResponse.json({ advice: data.advice.trim() });
  } catch (error: any) {
    return NextResponse.json(
      {
        error: error?.message || "Failed to process request",
      },
      { status: 500 }
    );
  }
}
