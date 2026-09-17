import { NextResponse } from "next/server";
import { db } from "../../../../data/db";

export async function GET(request, { params }) {
  const { id } = await params;
  const numId = Number(id);
  const property = db.properties.find((p) => String(p.propertyId) === String(id));

  const zoning = db.zoning[numId] || {
    zoningId: numId,
    propertyId: numId,
    propertyName: property?.propertyName || `Property #${id}`,
    address: property?.address || "Address unavailable",
    city: property?.city || "City",
    state: property?.state || "State",
    zoningCategory: "Residential Standard",
    zoningClass: "R-1",
    planningAuthority: `${property?.city || "Local"} Planning Authority`,
    masterPlan: "Regional Master Plan 2030",
    parcelIdentifier: `PAR-${id}`,
    complianceStatus: "COMPLIANT",
    maxFar: 2.0,
    maxHeight: "15 meters",
    groundCoverage: "50%",
    minPlotArea: "2000 sq.ft",
    frontSetback: "3.0 meters",
    rearSetback: "3.0 meters",
    leftSetback: "2.0 meters",
    rightSetback: "2.0 meters",
    permittedUsage: "Residential standard use",
    restrictedUsage: "Heavy commercial and industrial storage",
    specialRegulations: "Local building bylaws apply.",
  };

  return NextResponse.json(zoning);
}
