import { NextResponse } from "next/server";
import { db } from "../../../../data/db";

export async function GET(request) {
  try {
    const authHeader = request.headers.get("authorization");
    let user = db.users[0]; // Default to Admin

    if (authHeader && authHeader.startsWith("Bearer ")) {
      const token = authHeader.substring(7);
      try {
        const parts = token.split(".");
        if (parts.length >= 2) {
          const payload = JSON.parse(atob(parts[1]));
          if (payload.sub) {
            const found = db.users.find(
              (u) => u.email.toLowerCase() === payload.sub.toLowerCase()
            );
            if (found) user = found;
          }
        }
      } catch (_) {
        // Fallback to default user
      }
    }

    return NextResponse.json({
      userId: user.userId,
      id: user.userId,
      name: user.name,
      email: user.email,
      role: user.role,
      status: user.status,
    });
  } catch (err) {
    return NextResponse.json(
      { error: "Failed to get user", message: err.message },
      { status: 500 }
    );
  }
}
