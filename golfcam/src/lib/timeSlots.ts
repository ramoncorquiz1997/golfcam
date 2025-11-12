// src/lib/timeSlots.ts

export type ClipBase = { url: string; ts: string; thumb?: string; label?: string };

export type Slot<T extends ClipBase = ClipBase> = {
  key: string;        // p.ej. "15:00–16:00"
  label: string;
  start: Date;
  end: Date;
  items: T[];
};

type Opts = { stepMin: number; startHour: number; endHour: number };

// Extrae HHMMSS de un string (p. ej. de la URL)
function extractHHMMSS(str: string): string | null {
  const m = str.match(/(\d{6})(?:\.mp4)?$/);
  return m ? m[1] : null;
}

// ts puede ser: "HH:MM:SS", "HH:MM", "HHMMSS", ISO…
// Si no es válido, intenta sacarlo del nombre del archivo en clip.url
function parseTimeToDate(ts: string, fallbackFromUrl?: string): Date | null {
  // 1) "HH:MM:SS" o "HH:MM"
  if (/^\d{2}:\d{2}(:\d{2})?$/.test(ts)) {
    const [hh, mm, ss = "00"] = ts.split(":");
    return new Date(2000, 0, 1, Number(hh), Number(mm), Number(ss));
  }
  // 2) "HHMMSS"
  if (/^\d{6}$/.test(ts)) {
    const hh = Number(ts.slice(0, 2));
    const mm = Number(ts.slice(2, 4));
    const ss = Number(ts.slice(4, 6));
    return new Date(2000, 0, 1, hh, mm, ss);
  }
  // 3) ISO
  const d = new Date(ts);
  if (!isNaN(d.getTime())) return d;

  // 4) Fallback: de la URL/filename
  if (fallbackFromUrl) {
    const hhmmss = extractHHMMSS(fallbackFromUrl);
    if (hhmmss) {
      const hh = Number(hhmmss.slice(0, 2));
      const mm = Number(hhmmss.slice(2, 4));
      const ss = Number(hhmmss.slice(4, 6));
      return new Date(2000, 0, 1, hh, mm, ss);
    }
  }
  return null;
}

export function bucketVideosToSlots<T extends ClipBase>(clips: T[], opts: Opts): Slot<T>[] {
  const { stepMin, startHour, endHour } = opts;

  // construir slots vacíos
  const slots: Slot<T>[] = [];
  const base = new Date(2000, 0, 1);
  for (let h = startHour; h < endHour; h++) {
    for (let m = 0; m < 60; m += stepMin) {
      const start = new Date(base.getTime());
      start.setHours(h, m, 0, 0);
      const end = new Date(start.getTime() + stepMin * 60_000);
      const label = `${String(start.getHours()).padStart(2,"0")}:${String(start.getMinutes()).padStart(2,"0")}–${String(end.getHours()).padStart(2,"0")}:${String(end.getMinutes()).padStart(2,"0")}`;
      slots.push({ key: label, label, start, end, items: [] });
    }
  }

  // asignar clips al slot
  for (const clip of clips) {
    const t = parseTimeToDate(clip.ts, clip.url);
    if (!t) continue;
    const found = slots.find(s => t >= s.start && t < s.end);
    if (found) found.items.push(clip);
  }

  // filtrar solo slots con contenido
  return slots.filter(s => s.items.length > 0);
}
