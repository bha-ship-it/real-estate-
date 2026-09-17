import { NextResponse } from "next/server";
import { db } from "@/data/db";

export async function GET(request, { params }) {
  const { id } = await params;
  const numId = Number(id);
  const propertyPermits = db.permits.filter((p) => p.propertyId === numId);
  return NextResponse.json(propertyPermits);
}
