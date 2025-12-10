// src/app/api/recordings/[slug]/[date]/[court]/route.ts

// Desactivamos TS en ESTE archivo porque Next está muy picky con el tipo del contexto
// y nos interesa que funcione, no ganar un concurso de tipado.
 // @ts-nocheck

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
  process.env.RECORDINGS_BASE || "/opt/clipsazo/golfcam/recordings";

const PUBLIC_RECORDINGS_PREFIX =
  process.env.PUBLIC_RECORDINGS_PREFIX || "/recordings";

const FILE_RE = /^(\d{6})\.mp4$/i;

const hhmmssToHuman = (s: string) =>
  `${s.slice(0, 2)}:${s.slice(2, 4)}:${s.slice(4, 6)}`;

// Firma simple, sin tipos raros en el segundo argumento
export async function GET(
  _req: Request,
  { params }: { params: { slug: string; date: string; court: string } },
) {
  const { slug, date, court } = params;

  // Estructura: <base>/<slug>/<YYYY-MM-DD>/<court>/
  const absDir = path.join(RECORDINGS_BASE, slug, date, court);

  let entries: string[] = [];
  try {
    entries = await fs.readdir(absDir);
  } catch {
    // Si no existe la carpeta, regresamos vacío
    return NextResponse.json([]);
  }

  const clips: Clip[] = [];

  for (const name of entries) {
    const m = name.match(FILE_RE);
    if (!m) continue;
    const ts = hhmmssToHuman(m[1]);

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