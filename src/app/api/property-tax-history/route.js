import { NextResponse } from "next/server";
import { db } from "../../../data/db";

export async function POST(request) {
  try {
    const body = await request.json();
    const propId = Number(body.propertyId);
    if (!db.taxHistories[propId]) {
      db.taxHistories[propId] = [];
    }
    const newRecord = {
      id: Date.now(),
      propertyId: propId,
      taxYear: body.taxYear || body.year || new Date().getFullYear(),
      year: body.taxYear || body.year || new Date().getFullYear(),
      assessedValue: body.assessedValue || 0,
      taxAmount: body.taxAmount || 0,
      paidAmount: body.paidAmount || body.taxAmount || 0,
      status: body.status || "PAID",
      paymentStatus: body.paymentStatus || body.status || "PAID",
      paymentDate: body.paymentDate || new Date().toISOString().split("T")[0],
      receiptNumber: body.receiptNumber || `REC-${Date.now().toString().slice(-6)}`,
    };
    db.taxHistories[propId].unshift(newRecord);

    return NextResponse.json(newRecord, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: "Failed to save tax history", message: err.message }, { status: 400 });
  }
}
