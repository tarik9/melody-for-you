import { NextRequest, NextResponse } from "next/server";
import { isAdminAuthed } from "@/lib/adminAuth";
import { listLeads } from "@/lib/adminData";

export async function GET(req: NextRequest) {
  if (!isAdminAuthed(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const since = req.nextUrl.searchParams.get("since") || undefined;
  const until = req.nextUrl.searchParams.get("until") || undefined;

  const leads = await listLeads({ since, until });
  return NextResponse.json({ leads });
}
