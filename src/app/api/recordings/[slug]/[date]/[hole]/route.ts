import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

const RECORDINGS_BASE =
  process.env.RECORDINGS_BASE || "/var/www/golfcam/site/golfcam/public/recordings";
const PUBLIC_PREFIX =
  process.env.PUBLIC_RECORDINGS_PREFIX || "/recordings";

// 143043_green.mp4 / 091254_tee.mp4
const FILE_RE = /^(\d{6})_(tee|green)\.mp4$/i;
const hhmmss = (h: string) => `${h.slice(0,2)}:${h.slice(2,4)}:${h.slice(4,6)}`;
function splitDate(date: string) {
  const p = date.includes("-") ? date.split("-") : date.split("/");
  if (p.length !== 3) throw new Error("bad date");
  const [Y, M, D] = p;
  return { yyyy: Y, mm: M.padStart(2, "0"), d: String(parseInt(D, 10)) }; // carpeta del día sin 0 izq
}

export async function GET(
  _req: Request,
  { params }: { params: { slug: string; date: string; hole: string } }
) {
  const { slug, date, hole } = params;
  const holeDir = `hole-${Number(hole)}`;
  const { yyyy, mm, d } = splitDate(date);
  const absDir = path.join(RECORDINGS_BASE, slug, holeDir, yyyy, mm, d);

  let entries: string[] = [];
  try { entries = await fs.readdir(absDir); } catch { return NextResponse.json([]); }

  const clips = entries
    .map(name => {
      const m = name.match(FILE_RE);
      if (!m) return null;
      const time = hhmmss(m[1]);
      const pos = m[2].toLowerCase();
      return {
        url: `${PUBLIC_PREFIX}/${slug}/${holeDir}/${yyyy}/${mm}/${d}/${name}`,
        ts: time,
        label: `${pos.toUpperCase()} — ${time}`,
        pos,
        name,
      };
    })
    .filter(Boolean) as any[];

  clips.sort((a, b) => a.name.localeCompare(b.name));
  return NextResponse.json(clips);
}