import { NextResponse } from "next/server";
import { db } from "../../../data/db";

export async function POST(request) {
  try {
    const body = await request.json();
    const email = body.email || body.username || "";
    const password = body.password || "";

    const cleanEmail = email.trim().toLowerCase();

    // Find existing user or match default admin/analyst
    let user = db.users.find(
      (u) => u.email.toLowerCase() === cleanEmail
    );

    if (!user) {
      if (cleanEmail === "admin" || cleanEmail.includes("admin")) {
        user = db.users.find((u) => u.role === "ADMIN") || db.users[0];
      } else {
        // Create user on the fly if not found so login always works smoothly
        user = {
          userId: db.users.length + 1,
          id: db.users.length + 1,
          name: email.split("@")[0] || "Authenticated User",
          email: email,
          role: cleanEmail.includes("admin") ? "ADMIN" : "USER",
          status: "ACTIVE",
          createdAt: new Date().toISOString(),
        };
        db.users.push(user);
      }
    }

    // Mock JWT token with base64 encoded user details
    const tokenPayload = {
      sub: user.email,
      role: user.role,
      userId: user.userId,
      exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 7,
    };
    const mockToken = `mock-jwt.${btoa(JSON.stringify(tokenPayload))}.signature`;

    // Audit log
    db.auditLogs.unshift({
      id: db.auditLogs.length + 1,
      userEmail: user.email,
      role: user.role,
      action: "LOGIN",
      targetEntity: "User",
      entityId: String(user.userId),
      details: `User ${user.email} signed in successfully`,
      status: "SUCCESS",
      timestamp: new Date().toISOString(),
    });

    return NextResponse.json({
      token: mockToken,
      user: {
        userId: user.userId,
        id: user.userId,
        name: user.name,
        email: user.email,
        role: user.role,
        status: user.status,
      },
    });
  } catch (err) {
    return NextResponse.json(
      { error: "Authentication failed", message: err.message },
      { status: 400 }
    );
  }
}
