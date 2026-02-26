// src/app/api/recordings/[slug]/[date]/[hole]/route.ts
import { NextResponse } from "next/server";
import path from "node:path";
import fs from "node:fs/promises";

type Clip = {
  url: string;
  ts: string;
  label: string;
  name: string;
};

const RECORDINGS_BASE = process.env.RECORDINGS_BASE ?? "/opt/clipsazo/golfcam/recordings";
const PUBLIC_RECORDINGS_PREFIX = process.env.PUBLIC_RECORDINGS_PREFIX ?? "/recordings";
const FILE_RE = /^(\d{6})\.mp4$/i;

function hhmmssToHuman(s: string): string {
  return `${s.slice(0, 2)}:${s.slice(2, 4)}:${s.slice(4, 6)}`;
}

export async function GET(request: Request) {
  const { pathname } = new URL(request.url);
  const segments = pathname.split("/");
  const slug = segments[3];
  const date = segments[4];
  const hole = segments[5];

  if (!slug || !date || !hole) {
    return NextResponse.json([]);
  }

  const absDir = path.join(RECORDINGS_BASE, slug, date, hole);

  let entries: string[];
  try {
    entries = await fs.readdir(absDir);
  } catch {
    return NextResponse.json([]);
  }

  const clips: Clip[] = [];
  for (const name of entries) {
    const match = name.match(FILE_RE);
    if (!match) continue;
    const ts = hhmmssToHuman(match[1]);
    clips.push({
      url: `${PUBLIC_RECORDINGS_PREFIX}/${slug}/${date}/${hole}/${name}`,
      ts,
      label: ts,
      name,
    });
  }

  clips.sort((a, b) => a.name.localeCompare(b.name));
  return NextResponse.json(clips);
}
