import { NextResponse } from "next/server";
import { db } from "../../../../data/db";

export async function GET(request, { params }) {
  const { id } = await params;
  const property = db.properties.find(
    (p) => String(p.propertyId) === String(id) || String(p.id) === String(id)
  );

  if (!property) {
    return NextResponse.json({ error: "Property not found" }, { status: 404 });
  }

  const response = {
    propertyId: property.propertyId,
    propertyName: property.propertyName,
    address: property.address,
    city: property.city,
    state: property.state,
    zipCode: property.zipCode,
    propertyType: property.propertyType,
    ownerName: property.ownerName,
    createdDate: property.createdDate,
    dueDiligenceStatus: property.dueDiligenceStatus || "COMPLETED",
    riskLevel: property.riskLevel || "LOW",
    riskScore: property.riskScore ?? 90,
  };

  return NextResponse.json(response);
}
