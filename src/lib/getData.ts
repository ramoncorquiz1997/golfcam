// src/lib/getData.ts
export type Clip = {
  url: string;
  ts: string;
  label?: string;
  thumb?: string;
};

// src/lib/getData.ts
export async function getVideosForHoleByDate(
  slug: string,
  hole: number,
  date: string // formato "YYYY-MM-DD"
) {
  const base = `/recordings/${slug}/${date}/${hole}`;
  return [
    { url: `${base}/051235.mp4`, ts: "05:12:35", },
    // en producción aquí iterarías sobre los archivos reales
  ];
}