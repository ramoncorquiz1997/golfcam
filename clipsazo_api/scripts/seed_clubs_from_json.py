#!/usr/bin/env python3
import json
import os
from pathlib import Path

import psycopg

DEFAULT_JSON_PATH = (
    Path(__file__).resolve().parents[2] / "golfcam" / "src" / "data" / "clubs.json"
)

DB_URL = os.getenv(
    "DATABASE_URL",
    "postgresql://clipsazo:Clipsazo@127.0.0.1:5432/clipsazo",
)
JSON_PATH = os.getenv("JSON_PATH", str(DEFAULT_JSON_PATH))


def slugify(value: str) -> str:
    cleaned = "".join(ch.lower() if ch.isalnum() else "-" for ch in value).strip("-")
    while "--" in cleaned:
        cleaned = cleaned.replace("--", "-")
    return cleaned or "hoyo"


print(f"[INFO] Conectando a BD: {DB_URL}")
print(f"[INFO] Leyendo JSON desde: {JSON_PATH}")

conn = psycopg.connect(DB_URL)
cur = conn.cursor()

with open(JSON_PATH, "r", encoding="utf-8-sig") as f:
    clubs = json.load(f)

for c in clubs:
    slug = c["slug"]
    name = c["name"]
    city = c.get("city")
    state = c.get("state")
    country = c.get("country", "Mexico")
    lat = c.get("lat")
    lon = c.get("lon")
    image = c.get("image") or c.get("image_url")

    cur.execute(
        """
        INSERT INTO clubs (slug, name, city, state, country, lat, lon, image_url)
        VALUES (%s,%s,%s,%s,%s,%s,%s,%s)
        ON CONFLICT (slug) DO UPDATE SET
            name = EXCLUDED.name,
            city = EXCLUDED.city,
            state = EXCLUDED.state,
            country = EXCLUDED.country,
            lat = EXCLUDED.lat,
            lon = EXCLUDED.lon,
            image_url = EXCLUDED.image_url
        RETURNING id;
    """,
        (slug, name, city, state, country, lat, lon, image),
    )
    club_id = cur.fetchone()[0]
    print(f"[OK] Club: {name} ({slug}) id={club_id}")

    holes = c.get("holes") or c.get("courts") or []
    for idx, h in enumerate(holes, start=1):
        hole_slug = (h.get("slug") or "").strip() or slugify(h.get("name", "hoyo"))
        hole_name = (h.get("name") or f"Hoyo {idx}").strip()
        hole_image = h.get("image") or h.get("image_url")
        hole_number = h.get("number") or idx
        hole_par = h.get("par")
        hole_yardage = h.get("yardage")

        cur.execute(
            """
            INSERT INTO holes (club_id, slug, name, number, par, yardage, image_url)
            VALUES (%s,%s,%s,%s,%s,%s,%s)
            ON CONFLICT (club_id, slug) DO UPDATE SET
                name = EXCLUDED.name,
                number = EXCLUDED.number,
                par = EXCLUDED.par,
                yardage = EXCLUDED.yardage,
                image_url = EXCLUDED.image_url;
        """,
            (club_id, hole_slug, hole_name, hole_number, hole_par, hole_yardage, hole_image),
        )
        print(f"   -> Hoyo: {hole_name} ({hole_slug})")

conn.commit()
cur.close()
conn.close()
print("\nSeed completado correctamente.")
