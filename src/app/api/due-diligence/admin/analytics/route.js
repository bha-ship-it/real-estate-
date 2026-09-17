import { NextResponse } from "next/server";
import { db } from "@/data/db";

export async function GET() {
  const totalProperties = db.properties.length;
  const totalReports = db.reports.length;
  const completedReports = db.reports.filter((r) => r.status === "COMPLETED").length;
  const highRiskCount = db.properties.filter((p) => p.riskLevel === "HIGH_RISK" || (p.riskScore && p.riskScore < 50)).length;
  const lowRiskCount = db.properties.filter((p) => p.riskLevel === "LOW" || (p.riskScore && p.riskScore >= 80)).length;
  const concernsCount = totalProperties - highRiskCount - lowRiskCount;

  return NextResponse.json({
    totalProperties,
    totalReports,
    completedReports,
    pendingReports: totalProperties - completedReports,
    totalUsers: db.users.length,
    highRiskCount,
    lowRiskCount,
    concernsCount,
    averageRiskScore:
      totalProperties > 0
        ? Math.round(
            db.properties.reduce((acc, p) => acc + (p.riskScore || 0), 0) /
              totalProperties
          )
        : 85,
    riskDistribution: [
      { name: "Low Risk", value: lowRiskCount, color: "#10b981" },
      { name: "Concerns Found", value: concernsCount, color: "#f59e0b" },
      { name: "High Risk", value: highRiskCount, color: "#ef4444" },
    ],
    recentActivity: db.auditLogs.slice(0, 5),
  });
}
