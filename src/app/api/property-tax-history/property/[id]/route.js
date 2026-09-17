import { NextResponse } from "next/server";
import { db } from "../../../../../data/db";

export async function GET(request, { params }) {
  const { id } = await params;
  const numId = Number(id);
  const records = db.taxHistories[numId] || [];
  return NextResponse.json(records);
}
