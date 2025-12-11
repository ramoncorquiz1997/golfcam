#!/usr/bin/env python3
import json
import os
import psycopg

# ========= CONFIG =========
DB_URL = os.getenv(
    "DATABASE_URL",
    "postgresql://clipsazo_user:Clipsazo@127.0.0.1:5432/clipsazo_db",
)
JSON_PATH = "/opt/clipsazo/clipsazo/golfcam/src/data/clubs.json"

print(f"[INFO] Conectando a BD: {DB_URL}")
print(f"[INFO] Leyendo JSON desde: {JSON_PATH}")

# ========= CONEXIÓN =========
conn = psycopg.connect(DB_URL)
cur = conn.cursor()

with open(JSON_PATH, "r", encoding="utf-8") as f:
    clubs = json.load(f)

# ========= INSERCIÓN =========
for c in clubs:
    slug = c["slug"]
    name = c["name"]
    city = c.get("city")
    state = c.get("state")
    country = c.get("country", "México")
    lat = c.get("lat")
    lon = c.get("lon")
    image = c.get("image")

    cur.execute("""
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
    """, (slug, name, city, state, country, lat, lon, image))
    club_id = cur.fetchone()[0]
    print(f"[OK] Club: {name} ({slug}) id={club_id}")

    # ---- Canchas asociadas ----
    courts = c.get("courts", [])
    for ct in courts:
        ct_slug = ct["slug"]
        ct_name = ct["name"]
        ct_image = ct.get("image")
        cur.execute("""
            INSERT INTO courts (club_id, slug, name, image_url)
            VALUES (%s,%s,%s,%s)
            ON CONFLICT (club_id, slug) DO UPDATE SET
                name = EXCLUDED.name,
                image_url = EXCLUDED.image_url;
        """, (club_id, ct_slug, ct_name, ct_image))
        print(f"   └── cancha: {ct_name} ({ct_slug})")

conn.commit()
cur.close()
conn.close()
print("\n✅ Seed completado correctamente.")