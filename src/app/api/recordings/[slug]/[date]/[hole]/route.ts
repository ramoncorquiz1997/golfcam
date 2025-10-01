import { NextResponse } from "next/server";
import path from "node:path";
import fs from "node:fs/promises";

type Clip = {
  url: string;
  ts: string;       // "HH:MM:SS"
  label: string;    // "HH:MM:SS"
  name: string;     // nombre de archivo (HHMMSS.mp4)
};

const RECORDINGS_BASE =
  process.env.RECORDINGS_BASE || "/var/www/golfcam/site/golfcam/public/recordings";
const PUBLIC_RECORDINGS_PREFIX =
  process.env.PUBLIC_RECORDINGS_PREFIX || "/recordings";

function splitDate(date: string) {
  const [YYYY, MM, DD] = date.split("-");
  return { yyyy: YYYY, mm: MM, d: String(parseInt(DD, 10)) };
}
const FILE_RE = /^(\d{6})\.mp4$/i;
const hhmmssToHuman = (s: string) => `${s.slice(0,2)}:${s.slice(2,4)}:${s.slice(4,6)}`;

export async function GET(
  _req: Request,
  ctx: { params: Promise<{ slug: string; date: string; hole: string }> }
) {
  const { slug, date, hole } = await ctx.params;

  const { yyyy, mm, d } = splitDate(date);
  const holeDir = `hole-${Number(hole)}`;
  const absDir = path.join(RECORDINGS_BASE, slug, holeDir, yyyy, mm, d);

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
    const hhmmss = m[1];
    const ts = hhmmssToHuman(hhmmss);
    clips.push({
      url: `${PUBLIC_RECORDINGS_PREFIX}/${slug}/${holeDir}/${yyyy}/${mm}/${d}/${name}`,
      ts,
      label: ts,
      name,
    });
  }

  clips.sort((a, b) => a.name.localeCompare(b.name)); // orden cronológico por HHMMSS
  return NextResponse.json(clips);
}
