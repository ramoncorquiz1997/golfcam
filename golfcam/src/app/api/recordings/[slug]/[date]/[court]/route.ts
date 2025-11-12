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
  process.env.RECORDINGS_BASE || "/opt/clipsazo/recordings";
const PUBLIC_RECORDINGS_PREFIX =
  process.env.PUBLIC_RECORDINGS_PREFIX || "/recordings";

const FILE_RE = /^(\d{6})\.mp4$/i;
const hhmmssToHuman = (s: string) =>
  `${s.slice(0, 2)}:${s.slice(2, 4)}:${s.slice(4, 6)}`;

export async function GET(
  _req: Request,
  ctx: { params: Promise<{ slug: string; date: string; court: string }> }
) {
  const { slug, date, court } = await ctx.params;

  // Nueva estructura: <base>/<slug>/<YYYY-MM-DD>/<court>/
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
  return NextResponse.json(clips);
}