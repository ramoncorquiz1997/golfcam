// src/lib/getData.ts
export type Clip = {
  url: string;
  ts: string;          // "HH:MM:SS"
  label?: string;
  name?: string;
  thumb?: string;
};

/**
 * PÁDEL: clips por club/cancha/fecha
 * API esperada: /api/recordings/[slug]/[date]/[court]
 */
export async function getVideosForCourtByDate(
  slug: string,
  court: string,
  date: string
): Promise<Clip[]> {
  try {
    if (!slug || !date || !court) return [];
    const res = await fetch(`/api/recordings/${slug}/${date}/${court}`, { cache: "no-store" });
    if (!res.ok) return [];
    const data = (await res.json()) as Clip[];
    return (Array.isArray(data) ? data : []).filter(
      (c) => typeof c?.url === "string" && typeof c?.ts === "string"
    );
  } catch {
    return [];
  }
}