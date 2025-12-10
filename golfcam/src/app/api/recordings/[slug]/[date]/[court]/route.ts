// src/app/api/recordings/[slug]/[date]/[court]/route.ts
import { NextRequest, NextResponse } from "next/server";
import path from "node:path";
import fs from "node:fs/promises";

export const dynamic = "force-dynamic";

type RouteParams = {
  slug: string;
  date: string;
  court: string;
};

type Clip = {
  url: string;
  ts: string;
  label: string;
  name: string;
};

const RECORDINGS_BASE =
  process.env.RECORDINGS_BASE ?? "/opt/clipsazo/golfcam/recordings";

const PUBLIC_RECORDINGS_PREFIX =
  process.env.PUBLIC_RECORDINGS_PREFIX ?? "/recordings";

const FILE_RE = /^(\d{6})\.mp4$/;

function hhmmssToHuman(s: string): string {
  return `${s.slice(0, 2)}:${s.slice(2, 4)}:${s.slice(4, 6)}`;
}

export async function GET(
  _req: NextRequest,
  context: { params: RouteParams }
) {
  const { slug, date, court } = context.params;

  const absDir = path.join(RECORDINGS_BASE, slug, date, court);

  // Logs para debug (no rompen el build)
  console.log("[recordings] absDir =", absDir);

  let entries: string[];
  try {
    entries = await fs.readdir(absDir);
  } catch (err) {
    console.error("[recordings] readdir error:", err);
    return NextResponse.json<Clip[]>([]);
  }

  const clips: Clip[] = [];

  for (const file of entries) {
    const match = file.match(FILE_RE);
    if (!match) continue;

    const tsCode = match[1]; // HHMMSS
    const ts = hhmmssToHuman(tsCode);

    clips.push({
      url: `${PUBLIC_RECORDINGS_PREFIX}/${slug}/${date}/${court}/${file}`,
      ts,
      label: ts,
      name: file,
    });
  }

  clips.sort((a, b) => a.name.localeCompare(b.name));

  return NextResponse.json(clips);
}