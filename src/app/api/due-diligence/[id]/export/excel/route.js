import { NextResponse } from "next/server";
import { db } from "@/data/db";
import * as XLSX from "xlsx";

export async function GET(request, { params }) {
  const { id } = await params;
  const numId = Number(id);

  const property = db.properties.find(
    (p) => String(p.propertyId) === String(id) || String(p.id) === String(id)
  );

  const zoning = db.zoning[numId];
  const flood = db.floodZone[numId];
  const ownership = db.ownership[numId] || [];
  const tax = db.taxHistories[numId] || [];

  const wb = XLSX.utils.book_new();

  // Summary sheet
  const summaryData = [
    ["Metric", "Value"],
    ["Property ID", property?.propertyId],
    ["Property Name", property?.propertyName],
    ["Address", property?.address],
    ["City", property?.city],
    ["State", property?.state],
    ["Zip Code", property?.zipCode],
    ["Property Type", property?.propertyType],
    ["Registered Owner", property?.ownerName],
    ["Due Diligence Status", property?.dueDiligenceStatus],
    ["Risk Score", property?.riskScore],
    ["Risk Level", property?.riskLevel],
    ["Zoning Category", zoning?.zoningCategory],
    ["Zoning Class", zoning?.zoningClass],
    ["Max FAR", zoning?.maxFar],
    ["Flood Hazard Zone", flood?.zone],
    ["Insurance Required", flood?.insuranceRequired ? "Yes" : "No"],
  ];
  const wsSummary = XLSX.utils.aoa_to_sheet(summaryData);
  XLSX.utils.book_append_sheet(wb, wsSummary, "Due Diligence Summary");

  // Ownership sheet
  if (ownership.length > 0) {
    const wsOwnership = XLSX.utils.json_to_sheet(ownership);
    XLSX.utils.book_append_sheet(wb, wsOwnership, "Ownership History");
  }

  // Tax sheet
  if (tax.length > 0) {
    const wsTax = XLSX.utils.json_to_sheet(tax);
    XLSX.utils.book_append_sheet(wb, wsTax, "Tax History");
  }

  const excelBuffer = XLSX.write(wb, { type: "buffer", bookType: "xlsx" });

  return new NextResponse(excelBuffer, {
    headers: {
      "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "Content-Disposition": `attachment; filename="due-diligence-${id}.xlsx"`,
    },
  });
}
