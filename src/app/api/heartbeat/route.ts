import type { NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";

// Never cache: the whole point is to really hit the database on every call.
export const dynamic = "force-dynamic";

/**
 * Keep-alive for Supabase's free tier, which pauses a project after 7 days
 * without activity. Vercel Cron calls this once a day (see vercel.json) and it
 * runs a tiny read, which counts as activity.
 */
export async function GET(request: NextRequest) {
  // Vercel sends `Authorization: Bearer $CRON_SECRET` when that env var is set.
  // If it isn't set the endpoint stays open, which is harmless: it only reads
  // one row of data that is already public.
  const secret = process.env.CRON_SECRET;
  if (secret && request.headers.get("authorization") !== `Bearer ${secret}`) {
    return new Response("Unauthorized", { status: 401 });
  }

  const noStore = { "Cache-Control": "no-store" };

  try {
    const supabase = await createClient();
    const { error } = await supabase.from("site_settings").select("id").eq("id", 1).limit(1);

    if (error) {
      // A non-200 makes the failed run visible in Vercel's cron logs.
      return Response.json({ ok: false, error: error.message }, { status: 500, headers: noStore });
    }
    return Response.json({ ok: true, at: new Date().toISOString() }, { headers: noStore });
  } catch (err) {
    const message = err instanceof Error ? err.message : "unknown error";
    return Response.json({ ok: false, error: message }, { status: 500, headers: noStore });
  }
}
