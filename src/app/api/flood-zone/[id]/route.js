import { NextResponse } from "next/server";
import { db } from "@/data/db";

export async function GET(request, { params }) {
  const { id } = await params;
  const numId = Number(id);

  const floodData = db.floodZone[numId] || {
    propertyId: numId,
    zone: "Zone X (Minimal Flood Risk)",
    baseFloodElevation: 10.0,
    insuranceRequired: false,
    nearestWaterBody: "Local water drainage basin",
    distanceToWaterBody: 1500,
    femaPanel: `PANEL-00${id}01`,
  };

  return NextResponse.json(floodData);
}
