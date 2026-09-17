import { NextResponse } from "next/server";
import { db } from "@/data/db";

export async function GET() {
  return NextResponse.json(db.properties);
}

export async function POST(request) {
  try {
    const body = await request.json();
    const newId = db.properties.length > 0 ? Math.max(...db.properties.map((p) => p.propertyId || 0)) + 1 : 1;

    const newProperty = {
      propertyId: newId,
      id: newId,
      propertyName: body.propertyName || `Property #${newId}`,
      address: body.address || "",
      city: body.city || "",
      state: body.state || "",
      zipCode: body.zipCode || body.pincode || "",
      propertyType: body.propertyType || "Residential",
      ownerName: body.ownerName || "Pending Verification",
      createdDate: new Date().toISOString(),
      dueDiligenceStatus: body.dueDiligenceStatus || "NOT_STARTED",
      riskLevel: body.riskLevel || "PENDING",
      riskScore: body.riskScore ?? 0,
    };

    db.properties.unshift(newProperty);

    // Seed default zoning, flood, permits, tax
    db.zoning[newId] = {
      zoningId: newId,
      propertyId: newId,
      propertyName: newProperty.propertyName,
      address: newProperty.address,
      city: newProperty.city,
      state: newProperty.state,
      zoningCategory: newProperty.propertyType === "Commercial" ? "Commercial" : "Residential",
      zoningClass: "R-1 Standard",
      planningAuthority: `${newProperty.city || "Local"} Planning Authority`,
      masterPlan: "Comprehensive Master Plan",
      parcelIdentifier: `PAR-${newProperty.state || "ST"}-${newId}`,
      complianceStatus: "COMPLIANT",
      maxFar: 2.0,
      maxHeight: "15 meters",
      groundCoverage: "50%",
      minPlotArea: "2000 sq.ft",
      frontSetback: "3.0 meters",
      rearSetback: "3.0 meters",
      leftSetback: "2.0 meters",
      rightSetback: "2.0 meters",
      permittedUsage: `${newProperty.propertyType} use`,
      restrictedUsage: "Industrial and hazardous storage",
      specialRegulations: "Standard municipal regulations apply.",
    };

    db.floodZone[newId] = {
      propertyId: newId,
      zone: "Zone X (Minimal Flood Hazard)",
      baseFloodElevation: 25.0,
      insuranceRequired: false,
      nearestWaterBody: "Local municipal stormwater canal",
      distanceToWaterBody: 1200,
      femaPanel: `PANEL-${newId}01C`,
    };

    db.ownership[newId] = [
      {
        ownerName: newProperty.ownerName,
        ownerType: "Individual",
        acquisitionDate: new Date().toISOString().split("T")[0],
        purchasePrice: 5000000,
        deedReference: `DEED-${new Date().getFullYear()}-${newId}001`,
        currentOwner: true,
        ownershipPercentage: 100,
      },
    ];

    db.publicRecords[newId] = [];
    db.taxHistories[newId] = [
      {
        id: db.taxHistories[1]?.length || 1,
        propertyId: newId,
        taxYear: new Date().getFullYear(),
        year: new Date().getFullYear(),
        assessedValue: 4500000,
        taxAmount: 55000,
        paidAmount: 55000,
        status: "PAID",
        paymentStatus: "PAID",
        paymentDate: new Date().toISOString().split("T")[0],
        receiptNumber: `REC-${newId}`,
      },
    ];

    db.auditLogs.unshift({
      id: db.auditLogs.length + 1,
      userEmail: "admin@example.com",
      role: "ADMIN",
      action: "CREATE_PROPERTY",
      targetEntity: "Property",
      entityId: String(newId),
      details: `Added new property: ${newProperty.propertyName}`,
      status: "SUCCESS",
      timestamp: new Date().toISOString(),
    });

    return NextResponse.json(newProperty, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: "Failed to create property", message: err.message }, { status: 400 });
  }
}
