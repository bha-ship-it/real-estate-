import { NextResponse } from "next/server";
import { db } from "@/data/db";

export async function GET(request, { params }) {
  const { id } = await params;
  const property = db.properties.find(
    (p) => String(p.propertyId) === String(id) || String(p.id) === String(id)
  );
  if (!property) {
    return NextResponse.json({ error: "Property not found" }, { status: 404 });
  }
  return NextResponse.json(property);
}

export async function PUT(request, { params }) {
  try {
    const { id } = await params;
    const body = await request.json();
    const index = db.properties.findIndex(
      (p) => String(p.propertyId) === String(id) || String(p.id) === String(id)
    );
    if (index === -1) {
      return NextResponse.json({ error: "Property not found" }, { status: 404 });
    }

    const updated = {
      ...db.properties[index],
      ...body,
      propertyId: Number(id),
      id: Number(id),
    };
    db.properties[index] = updated;

    db.auditLogs.unshift({
      id: db.auditLogs.length + 1,
      userEmail: "admin@example.com",
      role: "ADMIN",
      action: "UPDATE_PROPERTY",
      targetEntity: "Property",
      entityId: String(id),
      details: `Updated details for property: ${updated.propertyName}`,
      status: "SUCCESS",
      timestamp: new Date().toISOString(),
    });

    return NextResponse.json(updated);
  } catch (err) {
    return NextResponse.json({ error: "Failed to update property", message: err.message }, { status: 400 });
  }
}

export async function DELETE(request, { params }) {
  const { id } = await params;
  const index = db.properties.findIndex(
    (p) => String(p.propertyId) === String(id) || String(p.id) === String(id)
  );
  if (index === -1) {
    return NextResponse.json({ error: "Property not found" }, { status: 404 });
  }
  const deleted = db.properties.splice(index, 1)[0];

  db.auditLogs.unshift({
    id: db.auditLogs.length + 1,
    userEmail: "admin@example.com",
    role: "ADMIN",
    action: "DELETE_PROPERTY",
    targetEntity: "Property",
    entityId: String(id),
    details: `Deleted property ${deleted.propertyName} (#${id})`,
    status: "SUCCESS",
    timestamp: new Date().toISOString(),
  });

  return NextResponse.json({ message: "Property deleted successfully", property: deleted });
}
