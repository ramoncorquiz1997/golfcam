import path from "node:path";
import fs from "node:fs/promises";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const RECORDINGS_BASE =
  process.env.RECORDINGS_BASE ?? "/opt/clipsazo/golfcam/recordings";

const PUBLIC_RECORDINGS_PREFIX =
  process.env.PUBLIC_RECORDINGS_PREFIX ?? "/recordings";

const FILE_RE = /^(\d{6})\.mp4$/;

function hhmmssToHuman(s) {
  return `${s.slice(0, 2)}:${s.slice(2, 4)}:${s.slice(4, 6)}`;
}

export async function GET(_req, { params }) {
  const { slug, date, court } = params;

  // Estructura: <base>/<slug>/<YYYY-MM-DD>/<court>/
  const absDir = path.join(RECORDINGS_BASE, slug, date, court);

  console.log("[recordings] absDir =", absDir);

  let entries;
  try {
    entries = await fs.readdir(absDir);
  } catch (err) {
    console.error("[recordings] readdir error:", err);
    return NextResponse.json([]);
  }

  const clips = [];

  for (const name of entries) {
    const m = name.match(FILE_RE);
    if (!m) continue;

    const tsCode = m[1]; // HHMMSS
    const ts = hhmmssToHuman(tsCode);

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