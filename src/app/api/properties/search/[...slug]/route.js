import { NextResponse } from "next/server";
import { db } from "../../../../../data/db";

export async function GET(request, { params }) {
  const { slug } = await params;
  if (!slug || slug.length < 2) {
    return NextResponse.json(db.properties);
  }

  const [field, query] = slug;
  const decoded = decodeURIComponent(query).toLowerCase().trim();

  let results = [];
  if (field === "city") {
    results = db.properties.filter((p) => p.city?.toLowerCase().includes(decoded));
  } else if (field === "state") {
    results = db.properties.filter((p) => p.state?.toLowerCase().includes(decoded));
  } else if (field === "pincode" || field === "zipCode") {
    results = db.properties.filter((p) => (p.zipCode || p.pincode || "").toLowerCase().includes(decoded));
  } else if (field === "type") {
    results = db.properties.filter((p) => p.propertyType?.toLowerCase().includes(decoded));
  } else {
    results = db.properties.filter(
      (p) =>
        p.propertyName?.toLowerCase().includes(decoded) ||
        p.address?.toLowerCase().includes(decoded) ||
        p.city?.toLowerCase().includes(decoded)
    );
  }

  return NextResponse.json(results);
}
