import { NextResponse } from "next/server";
import { db } from "../../../../data/db";

export async function GET(request, { params }) {
  const { id } = await params;
  const user = db.users.find(
    (u) => String(u.userId) === String(id) || String(u.id) === String(id)
  );
  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }
  return NextResponse.json(user);
}

export async function DELETE(request, { params }) {
  const { id } = await params;
  const index = db.users.findIndex(
    (u) => String(u.userId) === String(id) || String(u.id) === String(id)
  );
  if (index === -1) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }
  const deleted = db.users.splice(index, 1)[0];

  db.auditLogs.unshift({
    id: db.auditLogs.length + 1,
    userEmail: "admin@example.com",
    role: "ADMIN",
    action: "DELETE_USER",
    targetEntity: "User",
    entityId: String(id),
    details: `Deleted user ${deleted.email}`,
    status: "SUCCESS",
    timestamp: new Date().toISOString(),
  });

  return NextResponse.json({ message: "User deleted successfully", user: deleted });
}
