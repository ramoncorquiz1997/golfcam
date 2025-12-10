// src/app/api/recordings/[slug]/[date]/[court]/route.ts
import { NextRequest, NextResponse } from "next/server";
import path from "node:path";
import fs from "node:fs/promises";

type RouteParams = {
  slug: string;
  date: string;
  court: string;
};

type Clip = {
  url: string;
  ts: string;    // "HH:MM:SS"
  label: string; // "HH:MM:SS"
  name: string;  // "HHMMSS.mp4"
};

const RECORDINGS_BASE =
  process.env.RECORDINGS_BASE ?? "/opt/clipsazo/golfcam/recordings";

const PUBLIC_RECORDINGS_PREFIX =
  process.env.PUBLIC_RECORDINGS_PREFIX ?? "/recordings";

const FILE_RE = /^(\d{6})\.mp4$/i;

function hhmmssToHuman(s: string): string {
  return `${s.slice(0, 2)}:${s.slice(2, 4)}:${s.slice(4, 6)}`;
}

// OJO: dejamos el segundo argumento como `any`
// para que Next no marque el tipo como inválido.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function GET(_req: NextRequest, context: any) {
  const { slug, date, court } = context.params as RouteParams;

  // Estructura: <base>/<slug>/<YYYY-MM-DD>/<court>/
  const absDir = path.join(RECORDINGS_BASE, slug, date, court);

  let entries: string[];
  try {
    entries = await fs.readdir(absDir);
  } catch {
    // Si no existe la carpeta, regresamos vacío
    return NextResponse.json<Clip[]>([]);
  }

  const clips: Clip[] = [];

  for (const name of entries) {
    const m = name.match(FILE_RE);
    if (!m) continue;

    const tsCode = m[1]; // "HHMMSS"
    const ts = hhmmssToHuman(tsCode);

    clips.push({
      url: `${PUBLIC_RECORDINGS_PREFIX}/${slug}/${date}/${court}/${name}`,
      ts,
      label: ts,
      name,
    });
  }

  // Orden cronológico por nombre de archivo (HHMMSS.mp4)
  clips.sort((a, b) => a.name.localeCompare(b.name));

  return NextResponse.json(clips);
}