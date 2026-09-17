import { NextResponse } from "next/server";
import { db } from "@/data/db";

export async function PUT(request, { params }) {
  const { id } = await params;
  const notif = db.notifications.find((n) => String(n.id) === String(id));
  if (notif) {
    notif.read = true;
  }
  return NextResponse.json({ success: true, notification: notif });
}
