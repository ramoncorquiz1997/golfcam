import { NextResponse } from "next/server";
import path from "node:path";
import fs from "node:fs/promises";

type Clip = {
  url: string;
  ts: string;         // "HH:MM:SS"
  label?: string;     // opcional
  pos?: "tee" | "green"; // opcional (ya no viene)
  name: string;       // nombre de archivo
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

// Soporta ambos:
// - NUEVO: 152634.mp4
// - LEGADO: 152634_tee.mp4 o 152634_green.mp4
const FILE_RE = /^(\d{6})(?:_(tee|green))?\.mp4$/i;

export async function GET(
  _request: Request,
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
    // no hay carpeta → sin clips
    return NextResponse.json([]);
  }

  const clips: Clip[] = [];
  for (const name of entries) {
    const match = name.match(FILE_RE);
    if (!match) continue;

    const hhmmss = match[1];              // "152634"
    const posRaw = match[2]?.toLowerCase() as "tee" | "green" | undefined;
    const ts = hhmmssToHuman(hhmmss);     // "15:26:34"

    clips.push({
      url: `${PUBLIC_RECORDINGS_PREFIX}/${slug}/${holeDir}/${yyyy}/${mm}/${d}/${name}`,
      ts,
      // si trae pos, lo ponemos en label; si no, solo la hora
      label: posRaw ? `${posRaw.toUpperCase()} — ${ts}` : ts,
      pos: posRaw,
      name,
    });
  }

  // Orden por nombre (equivale a orden cronológico por HHMMSS)
  clips.sort((a, b) => a.name.localeCompare(b.name));

  return NextResponse.json(clips);
}
