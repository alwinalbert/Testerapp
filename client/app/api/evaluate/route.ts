import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const N8N_BASE_URL = process.env.N8N_BASE_URL || "http://localhost:5678";
    const WEBHOOK_ID = process.env.EVALUATOR_WEBHOOK_ID || "f737bade-c463-4ce4-ae79-302a024e6153";

    console.log("Evaluator webhook ID:", WEBHOOK_ID);

    // Try production webhook first, then test webhook
    const urls = [
      `${N8N_BASE_URL}/webhook/${WEBHOOK_ID}`,
      `${N8N_BASE_URL}/webhook-test/${WEBHOOK_ID}`,
    ];

    let response: Response | null = null;
    let lastError: string = "";

    for (const url of urls) {
      try {
        console.log("Trying evaluator webhook:", url);
        response = await fetch(url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "ngrok-skip-browser-warning": "true",
          },
          body: JSON.stringify(body),
        });

        if (response.ok) {
          console.log("Evaluator success with:", url);
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
      console.error("All evaluator webhook attempts failed:", lastError);
      return NextResponse.json(
        { error: "Failed to connect to n8n evaluator" },
        { status: 503 }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Evaluate API route error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
