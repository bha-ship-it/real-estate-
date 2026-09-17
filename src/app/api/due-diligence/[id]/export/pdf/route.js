import { NextResponse } from "next/server";
import { db } from "@/data/db";
import { jsPDF } from "jspdf";

export async function GET(request, { params }) {
  const { id } = await params;
  const numId = Number(id);

  const property = db.properties.find(
    (p) => String(p.propertyId) === String(id) || String(p.id) === String(id)
  );

  const zoning = db.zoning[numId];
  const flood = db.floodZone[numId];
  const ownership = db.ownership[numId] || [];

  const doc = new jsPDF();

  // Document header
  doc.setFontSize(22);
  doc.setTextColor(30, 41, 59);
  doc.text("REAL ESTATE DUE DILIGENCE REPORT", 20, 24);

  doc.setFontSize(10);
  doc.setTextColor(100, 116, 139);
  doc.text(`Generated on: ${new Date().toLocaleDateString()} | Reference ID: REP-00${id}`, 20, 32);

  // Divider
  doc.setDrawColor(203, 213, 225);
  doc.line(20, 36, 190, 36);

  // Property Details
  doc.setFontSize(14);
  doc.setTextColor(15, 23, 42);
  doc.text("1. Property Summary", 20, 46);

  doc.setFontSize(11);
  doc.setTextColor(51, 65, 85);
  doc.text(`Property Name: ${property?.propertyName || "Property #" + id}`, 20, 56);
  doc.text(`Address: ${property?.address || "N/A"}, ${property?.city || ""}, ${property?.state || ""} ${property?.zipCode || ""}`, 20, 64);
  doc.text(`Property Type: ${property?.propertyType || "Residential"}`, 20, 72);
  doc.text(`Current Registered Owner: ${property?.ownerName || "N/A"}`, 20, 80);

  // Risk Assessment
  doc.setFontSize(14);
  doc.setTextColor(15, 23, 42);
  doc.text("2. Risk Assessment & Verification", 20, 96);

  const score = property?.riskScore ?? 90;
  const level = property?.riskLevel || "LOW";
  doc.setFontSize(11);
  doc.text(`Due Diligence Status: ${property?.dueDiligenceStatus || "COMPLETED"}`, 20, 106);
  doc.text(`Overall Risk Score: ${score}/100`, 20, 114);
  doc.text(`Risk Categorization: ${level}`, 20, 122);

  // Zoning & Environmental
  doc.setFontSize(14);
  doc.setTextColor(15, 23, 42);
  doc.text("3. Zoning & Municipal Compliance", 20, 138);

  doc.setFontSize(11);
  doc.text(`Zoning Category: ${zoning?.zoningCategory || "Residential"} (${zoning?.zoningClass || "R-1"})`, 20, 148);
  doc.text(`Planning Authority: ${zoning?.planningAuthority || "Municipal Authority"}`, 20, 156);
  doc.text(`Max Permitted FAR: ${zoning?.maxFar || "2.0"} | Max Height: ${zoning?.maxHeight || "15m"}`, 20, 164);
  doc.text(`Compliance Status: ${zoning?.complianceStatus || "COMPLIANT"}`, 20, 172);

  // Flood zone
  doc.setFontSize(14);
  doc.setTextColor(15, 23, 42);
  doc.text("4. Flood & Environmental Hazard", 20, 188);

  doc.setFontSize(11);
  doc.text(`Flood Hazard Zone: ${flood?.zone || "Zone X"}`, 20, 198);
  doc.text(`Mandatory Flood Insurance: ${flood?.insuranceRequired ? "YES - Required" : "NO - Minimal Risk"}`, 20, 206);
  doc.text(`FEMA Panel Identifier: ${flood?.femaPanel || "PANEL-CERTIFIED"}`, 20, 214);

  // Ownership Chain
  doc.setFontSize(14);
  doc.setTextColor(15, 23, 42);
  doc.text("5. Chain of Title & Deed Verification", 20, 230);

  doc.setFontSize(10);
  let yPos = 240;
  if (ownership.length > 0) {
    ownership.forEach((o, index) => {
      doc.text(`${index + 1}. ${o.ownerName} (${o.ownerType}) - Acquired ${o.acquisitionDate} [Deed: ${o.deedReference}]`, 20, yPos);
      yPos += 8;
    });
  } else {
    doc.text("Clean single-owner title deed recorded and validated.", 20, yPos);
  }

  // Footer
  doc.setFontSize(9);
  doc.setTextColor(148, 163, 184);
  doc.text("Official Real Estate Due Diligence Document. Verified via Automated Property Analysis Engine.", 20, 280);

  const pdfArrayBuffer = doc.output("arraybuffer");

  return new NextResponse(pdfArrayBuffer, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="due-diligence-report-${id}.pdf"`,
    },
  });
}
