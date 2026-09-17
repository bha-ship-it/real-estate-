import { NextResponse } from "next/server";
import { db } from "@/data/db";

export async function POST(request, { params }) {
  const { id } = await params;
  const numId = Number(id);

  const property = db.properties.find(
    (p) => String(p.propertyId) === String(id) || String(p.id) === String(id)
  );

  if (!property) {
    return NextResponse.json({ error: "Property not found" }, { status: 404 });
  }

  // Update property status
  property.dueDiligenceStatus = "COMPLETED";

  // Calculate or retrieve risk score
  const pubRecs = db.publicRecords[numId] || [];
  const flood = db.floodZone[numId];
  let calculatedScore = 95;
  let calculatedLevel = "LOW";

  if (pubRecs.length > 0) {
    calculatedScore -= pubRecs.length * 20;
  }
  if (flood?.insuranceRequired) {
    calculatedScore -= 15;
  }
  if (calculatedScore < 50) {
    calculatedLevel = "HIGH_RISK";
  } else if (calculatedScore < 80) {
    calculatedLevel = "CONCERNS_FOUND";
  } else {
    calculatedLevel = "LOW";
  }

  property.riskScore = calculatedScore;
  property.riskLevel = calculatedLevel;

  const newReportId = db.reports.length + 1;
  const reportObj = {
    id: newReportId,
    reportId: `REP-00${newReportId}`,
    propertyId: numId,
    propertyName: property.propertyName,
    city: property.city,
    state: property.state,
    status: "COMPLETED",
    riskScore: calculatedScore,
    riskLevel: calculatedLevel,
    durationMs: 1350,
    reportUrl: `/api/due-diligence/${numId}/export/pdf`,
    completedAt: new Date().toISOString(),
    createdAt: new Date().toISOString(),
    property: { ...property },
    summary:
      calculatedLevel === "LOW"
        ? "Comprehensive title search verified clear ownership, zero recorded encumbrances, compliant zoning, and nominal flood risk."
        : calculatedLevel === "CONCERNS_FOUND"
        ? "Property title clear with notable zoning or flood insurance advisories requiring buyer verification."
        : "Significant title disputes, active municipal notices, or critical flood hazard factors identified.",
  };

  db.reports.unshift(reportObj);

  // Add notification
  db.notifications.unshift({
    id: `notif-${Date.now()}`,
    type: calculatedLevel === "LOW" ? "SUCCESS" : calculatedLevel === "CONCERNS_FOUND" ? "WARNING" : "CRITICAL",
    title: `Due Diligence Completed: ${property.propertyName}`,
    message: `Assessment finished with Risk Score ${calculatedScore}/100 (${calculatedLevel}).`,
    propertyId: numId,
    propertyName: property.propertyName,
    timestamp: new Date().toISOString(),
    read: false,
  });

  // Audit log
  db.auditLogs.unshift({
    id: db.auditLogs.length + 1,
    userEmail: "admin@example.com",
    role: "ADMIN",
    action: "PROCESS_DUE_DILIGENCE",
    targetEntity: "DueDiligenceReport",
    entityId: String(reportObj.id),
    details: `Processed due diligence report for ${property.propertyName} (Score: ${calculatedScore})`,
    status: "SUCCESS",
    timestamp: new Date().toISOString(),
  });

  return NextResponse.json(reportObj);
}
