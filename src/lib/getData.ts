// src/lib/getData.ts
export type Clip = {
  url: string;
  ts: string;      // "HH:MM:SS"
  label?: string;  // "TEE — 14:30:43"
  pos?: "tee" | "green";
  name?: string;
  thumb?: string;  // 👈 añade esta línea
};

export async function getVideosForHoleByDate(
  slug: string,
  hole: number,
  date: string // "YYYY-MM-DD"
): Promise<Clip[]> {
  const res = await fetch(`/api/recordings/${slug}/${date}/${hole}`, {
    cache: "no-store",
  });
  if (!res.ok) return [];
  return res.json();
}