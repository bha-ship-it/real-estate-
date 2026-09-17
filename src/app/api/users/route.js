import { NextResponse } from "next/server";
import { db } from "../../../data/db";

export async function GET() {
  return NextResponse.json(db.users);
}
