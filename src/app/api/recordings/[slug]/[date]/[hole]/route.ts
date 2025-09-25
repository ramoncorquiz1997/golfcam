// src/app/api/recordings/[slug]/[date]/[hole]/route.ts
import { NextResponse } from "next/server";
import path from "node:path";
import fs from "node:fs/promises";

type Clip = {
  url: string;
  ts: string;       // "HH:MM:SS"
  label: string;    // "TEE — 14:30:43"
  pos: "tee" | "green";
  name: string;     // nombre de archivo
};

const RECORDINGS_BASE =
  process.env.RECORDINGS_BASE || "/var/www/golfcam/site/golfcam/public/recordings";
const PUBLIC_RECORDINGS_PREFIX =
  process.env.PUBLIC_RECORDINGS_PREFIX || "/recordings";

function splitDate(date: string) {
  const [YYYY, MM, DD] = date.split("-");
  return { yyyy: YYYY, mm: MM, d: String(parseInt(DD, 10)) };
}

function hhmmssToHuman(hhmmss: string) {
  return `${hhmmss.slice(0, 2)}:${hhmmss.slice(2, 4)}:${hhmmss.slice(4, 6)}`;
}

const FILE_RE = /^(\d{6})_(tee|green)\.mp4$/i;

export async function GET(
  request: Request,
  context: { params: Promise<{ slug: string; date: string; hole: string }> }
) {
  const { slug, date, hole } = await context.params;

  const { yyyy, mm, d } = splitDate(date);
  const holeDir = `hole-${Number(hole)}`;
  const absDir = path.join(RECORDINGS_BASE, slug, holeDir, yyyy, mm, d);

  let entries: string[] = [];
  try {
    entries = await fs.readdir(absDir);
  } catch {
    return NextResponse.json([]); // no hay carpeta → sin clips
  }

  const clips: Clip[] = [];
  for (const name of entries) {
    const match = name.match(FILE_RE);
    if (!match) continue;

    const hhmmss = match[1];
    const pos = match[2].toLowerCase() as "tee" | "green";
    const ts = hhmmssToHuman(hhmmss);

    clips.push({
      url: `${PUBLIC_RECORDINGS_PREFIX}/${slug}/${holeDir}/${yyyy}/${mm}/${d}/${name}`,
      ts,
      label: `${pos.toUpperCase()} — ${ts}`,
      pos,
      name,
    });
  }

  clips.sort((a, b) => a.name.localeCompare(b.name));
  return NextResponse.json(clips);
}