import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const subject = searchParams.get("subject");
    const limit = parseInt(searchParams.get("limit") || "50");

    if (!subject) {
      return NextResponse.json({ error: "subject is required" }, { status: 400 });
    }

    const supabase = await createClient();

    const { data, error } = await supabase
      .from("questions")
      .select("id, question_text, difficulty, Topic, capability, type, Subject")
      .filter("Subject", "ilike", `%${subject}%`)
      .limit(limit);

    if (error) {
      console.error("Supabase query error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data || []);
  } catch (error) {
    console.error("Questions API error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
