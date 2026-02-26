// src/lib/getData.ts
export type Clip = {
  url: string;
  ts: string;
  label?: string;
  name?: string;
  thumb?: string;
};

export async function getVideosForHoleByDate(
  slug: string,
  hole: string,
  date: string,
): Promise<Clip[]> {
  try {
    if (!slug || !date || !hole) return [];
    const res = await fetch(`/api/recordings/${slug}/${date}/${hole}`, {
      cache: "no-store",
    });
    if (!res.ok) return [];
    const data = (await res.json()) as Clip[];
    return (Array.isArray(data) ? data : []).filter(
      (c) => typeof c?.url === "string" && typeof c?.ts === "string",
    );
  } catch {
    return [];
  }
}

export const getVideosForCourtByDate = getVideosForHoleByDate;
