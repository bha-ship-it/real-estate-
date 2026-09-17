import { NextResponse } from "next/server";
import { db } from "@/data/db";

export async function GET() {
  return NextResponse.json(db.permits);
}

export async function POST(request) {
  try {
    const body = await request.json();
    const newPermit = {
      id: db.permits.length + 1,
      propertyId: Number(body.propertyId),
      permitNumber: body.permitNumber || `PERMIT-${Date.now().toString().slice(-6)}`,
      permitType: body.permitType || "General Building Permit",
      authority: body.authority || "Municipal Development Authority",
      status: body.status || "APPROVED",
      issueDate: body.issueDate || new Date().toISOString().split("T")[0],
      approvalDate: body.approvalDate || new Date().toISOString().split("T")[0],
      contractor: body.contractor || "Registered Contractor",
      inspector: body.inspector || "City Building Inspector",
      notes: body.notes || "Standard permit inspection passed.",
    };
    db.permits.unshift(newPermit);
    return NextResponse.json(newPermit, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: "Failed to create permit", message: err.message }, { status: 400 });
  }
}
