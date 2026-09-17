import { NextResponse } from "next/server";
import { db } from "../../../../../data/db";

export async function GET(request, { params }) {
  const { id, type } = await params;
  const numId = Number(id);

  if (type === "ownership") {
    const list = db.ownership[numId] || [
      {
        ownerName: "Verified Title Owner",
        ownerType: "Individual",
        acquisitionDate: "2020-01-15",
        purchasePrice: 5000000,
        deedReference: `DEED-${id}-001`,
        currentOwner: true,
        ownershipPercentage: 100,
      },
    ];
    return NextResponse.json(list);
  }

  if (type === "records") {
    const list = db.publicRecords[numId] || [];
    return NextResponse.json(list);
  }

  if (type === "report") {
    const property = db.properties.find(
      (p) => String(p.propertyId) === String(id)
    );
    return NextResponse.json({
      propertyId: numId,
      propertyName: property?.propertyName || `Property #${id}`,
      ownershipHistory: db.ownership[numId] || [],
      publicRecords: db.publicRecords[numId] || [],
      cleanTitle: (db.publicRecords[numId] || []).length === 0,
      generatedAt: new Date().toISOString(),
    });
  }

  return NextResponse.json({ error: "Invalid record type" }, { status: 400 });
}
