/**
 * GET /api/catalog-options?brand=Toyota&model=Corolla&year=2024&field=transmission
 * GET /api/catalog-options?brand=Toyota&model=Corolla&year=2024&field=fuelType&transmission=CVT
 * GET /api/catalog-options?brand=Toyota&model=Corolla&year=2024&field=engine&transmission=CVT&fuelType=Hibrit
 *
 * Returns an array of string option values from the CSV catalog.
 * Falls back to [] when csv-catalog.json is absent (CI / clean checkout).
 *
 * Data license: ODbL 1.0 — https://opendatacommons.org/licenses/odbl/1-0/
 * These options are NOT verified for the Turkish market.
 */

import { NextRequest, NextResponse } from "next/server";
import {
  getCsvEngineLabels,
  getCsvFuelTypes,
  getCsvTransmissions,
} from "@/services/csvCatalogService";

export const runtime = "nodejs"; // needs fs — cannot run on edge

export function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const brand = searchParams.get("brand") ?? "";
  const model = searchParams.get("model") ?? "";
  const yearRaw = searchParams.get("year");
  const field = searchParams.get("field") ?? "";
  const fuelType = searchParams.get("fuelType") ?? undefined;
  const transmission = searchParams.get("transmission") ?? undefined;

  if (!brand || !model || !field) {
    return NextResponse.json([], { status: 400 });
  }

  const year = yearRaw ? Number(yearRaw) : undefined;

  let options: string[] = [];

  if (field === "transmission") {
    options = getCsvTransmissions(brand, model, year);
  } else if (field === "fuelType") {
    options = getCsvFuelTypes(brand, model, year);
  } else if (field === "engine") {
    options = getCsvEngineLabels(brand, model, year, fuelType, transmission);
  } else {
    return NextResponse.json([], { status: 400 });
  }

  return NextResponse.json(options, {
    headers: { "Cache-Control": "public, max-age=3600, stale-while-revalidate=86400" },
  });
}
