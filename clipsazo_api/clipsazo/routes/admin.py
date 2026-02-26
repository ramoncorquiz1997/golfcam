# clipsazo/routes/admin.py
from flask import Blueprint, request, jsonify
from ..db import get_conn
from ..models import rows_to_dicts

import os
import re
import unicodedata

bp = Blueprint("admin", __name__, url_prefix="/api/admin")

CLUB_IMAGE_DIR = os.environ.get(
    "CLUB_IMAGES_DIR",
    "/opt/clipsazo/golfcam/public/images/clubs",
)


def _slugify(value: str) -> str:
    """Convierte 'Valle Dorado Golf' -> 'valle_dorado_golf'"""
    value_norm = unicodedata.normalize("NFKD", value)
    value_ascii = value_norm.encode("ascii", "ignore").decode("ascii")
    value_clean = re.sub(r"[^a-zA-Z0-9]+", "_", value_ascii)
    value_clean = value_clean.strip("_").lower()
    return value_clean or "club"


def _generate_club_slug(name: str, city: str | None, conn) -> str:
    base_text = f"{name}_{city}" if city else name
    base = _slugify(base_text)

    slug = base
    i = 2
    with conn.cursor() as cur:
        while True:
            cur.execute("SELECT 1 FROM clubs WHERE slug = %s", (slug,))
            if cur.fetchone() is None:
                return slug
            slug = f"{base}_{i}"
            i += 1


ALLOWED_TABLES = {
    "clubs": """
        SELECT id, slug, name, city, state, country, lat, lon, image_url, created_at
        FROM clubs
    """,
    "holes": """
        SELECT id, club_id, slug, name, number, par, yardage, image_url
        FROM holes
    """,
    "events": """
        SELECT id, title, club_id, date, status, cta, created_at
        FROM events
    """,
}


@bp.get("/tables")
def admin_tables():
    return jsonify({"tables": list(ALLOWED_TABLES.keys())})


@bp.get("/table/<name>")
def admin_table(name: str):
    name = name.strip()

    if name not in ALLOWED_TABLES:
        return jsonify({"error": "table not allowed"}), 404

    try:
        limit = max(1, min(int(request.args.get("limit", 50)), 200))
    except (TypeError, ValueError):
        limit = 50

    try:
        offset = max(0, int(request.args.get("offset", 0)))
    except (TypeError, ValueError):
        offset = 0

    base_sql = ALLOWED_TABLES[name]
    sql = f"""
        {base_sql}
        ORDER BY 1
        LIMIT %s OFFSET %s
    """

    conn = get_conn()
    with conn.cursor() as cur:
        cur.execute(sql, (limit, offset))
        items = rows_to_dicts(cur)

    return jsonify(
        {
            "table": name,
            "limit": limit,
            "offset": offset,
            "items": items,
        }
    )


@bp.get("/clubs")
def admin_list_clubs():
    conn = get_conn()
    with conn.cursor() as cur:
        cur.execute(
            """
            SELECT id, slug, name, city, state, country, lat, lon, image_url, created_at
            FROM clubs
            ORDER BY id
            """
        )
        items = rows_to_dicts(cur)
    return jsonify({"items": items})


@bp.post("/clubs")
def admin_create_club():
    conn = get_conn()

    ctype = request.content_type or ""
    is_json = "application/json" in ctype

    if is_json:
        data = request.get_json(force=True) or {}

        name = (data.get("name") or "").strip()
        country = (data.get("country") or "").strip()
        city = (data.get("city") or "").strip() or None
        state = (data.get("state") or "").strip() or None
        slug_input = (data.get("slug") or "").strip()
        image_url_input = (data.get("image_url") or "").strip() or None

        lat = data.get("lat")
        lon = data.get("lon")

    else:
        form = request.form
        name = (form.get("name") or "").strip()
        country = (form.get("country") or "").strip()
        city = (form.get("city") or "").strip() or None
        state = (form.get("state") or "").strip() or None
        slug_input = (form.get("slug") or "").strip()
        image_url_input = (form.get("image_url") or "").strip() or None

        lat_str = (form.get("lat") or "").strip()
        lon_str = (form.get("lon") or "").strip()
        lat = float(lat_str) if lat_str else None
        lon = float(lon_str) if lon_str else None

    if not name or not country:
        return jsonify({"error": "name y country son obligatorios"}), 400

    slug = slug_input or _generate_club_slug(name, city, conn)

    image_file = request.files.get("image") if not is_json else None
    image_url: str | None = None

    if image_file and image_file.filename:
        _, ext = os.path.splitext(image_file.filename)
        ext = (ext or ".jpg").lower()

        os.makedirs(CLUB_IMAGE_DIR, exist_ok=True)
        filename = f"{slug}{ext}"
        fs_path = os.path.join(CLUB_IMAGE_DIR, filename)
        image_file.save(fs_path)

        image_url = f"images/clubs/{filename}"
    else:
        image_url = image_url_input

    with conn.cursor() as cur:
        cur.execute(
            """
            INSERT INTO clubs (slug, name, city, state, country, lat, lon, image_url)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
            RETURNING id, slug, name, city, state, country, lat, lon, image_url, created_at
            """,
            (slug, name, city, state, country, lat, lon, image_url),
        )
        rows = rows_to_dicts(cur)

    return jsonify(rows[0]), 201


@bp.delete("/clubs/<int:club_id>")
def admin_delete_club(club_id: int):
    conn = get_conn()
    with conn.cursor() as cur:
        cur.execute("DELETE FROM clubs WHERE id = %s", (club_id,))
        if cur.rowcount == 0:
            return jsonify({"error": "not found"}), 404
    return jsonify({"ok": True})
