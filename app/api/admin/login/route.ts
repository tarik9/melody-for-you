import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const adminPassword = process.env.ADMIN_PASSWORD;
  if (!adminPassword) {
    return NextResponse.json({ error: "Admin password not configured" }, { status: 500 });
  }

  const { password } = await req.json().catch(() => ({ password: "" }));

  if (password !== adminPassword) {
    return NextResponse.json({ error: "Incorrect password" }, { status: 401 });
  }

  return NextResponse.json({ token: adminPassword });
}
