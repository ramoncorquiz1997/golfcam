// src/app/api/recordings/[slug]/[date]/[court]/route.ts
import { NextResponse } from "next/server";
import path from "node:path";
import fs from "node:fs/promises";

// Fuerza ejecución en Node y que no se congele como estático
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

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

export async function GET(
  _req: Request,
  { params }: { params: { slug: string; date: string; court: string } }
) {
  const { slug, date, court } = params;

  const absDir = path.join(RECORDINGS_BASE, slug, date, court);

  let entries: string[] = [];
  try {
    entries = await fs.readdir(absDir);
  } catch {
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

  clips.sort((a, b) => a.name.localeCompare(b.name));
  return NextResponse.json(clips, {
    headers: {
      "Cache-Control": "no-store, max-age=0",
    },
  });
}