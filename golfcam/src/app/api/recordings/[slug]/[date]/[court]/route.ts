// src/app/api/recordings/[slug]/[date]/[court]/route.ts
import { NextResponse } from "next/server";
import path from "node:path";
import fs from "node:fs/promises";

type Clip = {
  url: string;
  ts: string;    // "HH:MM:SS"
  label: string; // "HH:MM:SS"
  name: string;  // "HHMMSS.mp4"
};

const RECORDINGS_BASE =
  process.env.RECORDINGS_BASE ?? "/opt/clipsazore/golfcam/recordings";

const PUBLIC_RECORDINGS_PREFIX =
  process.env.PUBLIC_RECORDINGS_PREFIX ?? "/recordings";

const FILE_RE = /^(\d{6})\.mp4$/i;

function hhmmssToHuman(s: string): string {
  return `${s.slice(0, 2)}:${s.slice(2, 4)}:${s.slice(4, 6)}`;
}

export async function GET(request: Request) {
  // URL: /api/recordings/[slug]/[date]/[court]
  const { pathname } = new URL(request.url);
  const segments = pathname.split("/");
  // ["", "api", "recordings", slug, date, court]
  const slug = segments[3];
  const date = segments[4];
  const court = segments[5];

  if (!slug || !date || !court) {
    // Params mal formados → regresamos vacío
    return NextResponse.json([]);
  }

  // Estructura en disco: <base>/<slug>/<YYYY-MM-DD>/<court>/
  const absDir = path.join(RECORDINGS_BASE, slug, date, court);

  let entries: string[];
  try {
    entries = await fs.readdir(absDir);
  } catch {
    // Si no existe el directorio, regresamos lista vacía
    return NextResponse.json([]);
  }

  const clips: Clip[] = [];

  for (const name of entries) {
    const match = name.match(FILE_RE);
    if (!match) continue;

    const tsRaw = match[1]; // "HHMMSS"
    const ts = hhmmssToHuman(tsRaw);

    clips.push({
      url: `${PUBLIC_RECORDINGS_PREFIX}/${slug}/${date}/${court}/${name}`,
      ts,
      label: ts,
      name,
    });
  }

  // Ordenar por nombre de archivo (HHMMSS.mp4) → cronológico
  clips.sort((a, b) => a.name.localeCompare(b.name));

  return NextResponse.json(clips);
}