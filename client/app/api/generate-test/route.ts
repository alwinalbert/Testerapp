import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const N8N_BASE_URL = process.env.N8N_BASE_URL || "http://localhost:5678";
    const WEBHOOK_ID = process.env.TEST_GENERATOR_WEBHOOK_ID || "147cf9e2-857f-4acf-ad86-0cabb1f313a7";

    console.log("Using webhook ID:", WEBHOOK_ID);
    console.log("N8N URL:", N8N_BASE_URL);

    // Try production webhook first, then test webhook
    const urls = [
      `${N8N_BASE_URL}/webhook/${WEBHOOK_ID}`,
      `${N8N_BASE_URL}/webhook-test/${WEBHOOK_ID}`,
    ];

    let response: Response | null = null;
    let lastError: string = "";

    for (const url of urls) {
      try {
        console.log("Trying n8n webhook:", url);
        response = await fetch(url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(body),
        });

        if (response.ok) {
          console.log("Success with:", url);
          break;
        } else {
          lastError = `${response.status} ${response.statusText}`;
          console.log(`Failed with ${url}:`, lastError);
          response = null;
        }
      } catch (e) {
        lastError = String(e);
        console.log(`Error with ${url}:`, lastError);
      }
    }

    if (!response || !response.ok) {
      console.error("All n8n webhook attempts failed:", lastError);
      return NextResponse.json(
        { error: "Failed to connect to n8n. Is the workflow activated?" },
        { status: 503 }
      );
    }

    const text = await response.text();
    console.log("n8n raw response:", text);

    if (!text) {
      return NextResponse.json(
        { error: "n8n returned an empty response. The workflow may not be returning data correctly." },
        { status: 502 }
      );
    }

    const data = JSON.parse(text);
    return NextResponse.json(data);
  } catch (error) {
    console.error("API route error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
