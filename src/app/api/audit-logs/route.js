import { NextResponse } from "next/server";
import { db } from "@/data/db";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get("page") || "0", 10);
  const size = parseInt(searchParams.get("size") || "20", 10);

  const start = page * size;
  const end = start + size;
  const content = db.auditLogs.slice(start, end);
  const totalElements = db.auditLogs.length;
  const totalPages = Math.ceil(totalElements / size);

  return NextResponse.json({
    content,
    number: page,
    totalPages,
    totalElements,
    size,
    first: page === 0,
    last: end >= totalElements,
  });
}
