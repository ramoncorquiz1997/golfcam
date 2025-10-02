// src/app/api/recordings/[slug]/[date]/[hole]/route.ts
import { NextResponse } from "next/server";
import path from "node:path";
import fs from "node:fs/promises";

type Clip = {
  url: string;
  ts: string;       // "HH:MM:SS"
  label: string;    // "TEE — 14:30:43" | "GREEN — 14:30:43" | "CAM — 14:30:43" | "CLIP — 14:30:43"
  pos: "tee" | "green" | "cam" | "clip";
  name: string;
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

// Acepta: "HHMMSS.mp4"  o  "HHMMSS_tee.mp4" / "HHMMSS_green.mp4" / "HHMMSS_cam.mp4"
const FILE_RE = /^(\d{6})(?:_(tee|green|cam))?\.mp4$/i;

export async function GET(
  _req: Request,
  { params }: { params: Record<string, string | string[]> }
) {
  // Normalizamos params (pueden venir como string[])
  const slug = Array.isArray(params.slug) ? params.slug[0] : params.slug;
  const date = Array.isArray(params.date) ? params.date[0] : params.date;
  const hole = Array.isArray(params.hole) ? params.hole[0] : params.hole;

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
    const pos: Clip["pos"] = match[2] ? (match[2].toLowerCase() as Clip["pos"]) : "clip";
    const ts = hhmmssToHuman(hhmmss);

    const url = `${PUBLIC_RECORDINGS_PREFIX}/${slug}/${holeDir}/${yyyy}/${mm}/${d}/${name}`;
    const label = `${pos === "clip" ? "CLIP" : pos.toUpperCase()} — ${ts}`;

    clips.push({ url, ts, label, pos, name });
  }

  // Orden cronológico por nombre (HHMMSS…)
  clips.sort((a, b) => a.name.localeCompare(b.name));

  return NextResponse.json(clips);
}
