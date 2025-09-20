// src/lib/timeSlots.ts
export type ClipBase = { url: string; ts: string; thumb?: string; label?: string };

export type Slot<T extends ClipBase = ClipBase> = {
  key: string;        // p.ej. "05:10-05:20"
  label: string;      // lo mismo, para UI
  start: Date;
  end: Date;
  items: T[];
};

type Opts = { stepMin: number; startHour: number; endHour: number };

// ts: "HH:MM:SS" (o ISO) -> Date del mismo día "ficticio"
function parseTimeToDate(ts: string): Date {
  // admite "HH:MM:SS" o ISO
  if (/^\d{2}:\d{2}(:\d{2})?$/.test(ts)) {
    const [hh, mm, ss = "00"] = ts.split(":");
    const d = new Date(2000, 0, 1, Number(hh), Number(mm), Number(ss));
    return d;
  }
  const d = new Date(ts);
  return isNaN(d.getTime()) ? new Date(2000,0,1) : d;
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
    const t = parseTimeToDate(clip.ts);
    const found = slots.find(s => t >= s.start && t < s.end);
    if (found) found.items.push(clip);
  }

  // filtrar solo slots con contenido
  return slots.filter(s => s.items.length > 0);
}