# clipsazo/routes/admin.py
from flask import Blueprint, request, jsonify
from ..db import get_conn
from ..models import rows_to_dicts

import os
import re
import unicodedata

bp = Blueprint("admin", __name__, url_prefix="/api/admin")

# -------------------------------------------------------------------
# Config: ruta donde se guardan las imágenes de clubs
# -------------------------------------------------------------------
# Por defecto: /opt/clipsazo/golfcam/public/images/clubs
CLUB_IMAGE_DIR = os.environ.get(
    "CLUB_IMAGES_DIR",
    "/opt/clipsazo/golfcam/public/images/clubs",
)

# -------------------------------------------------------------------
# Helpers para slug / nombre de archivo
# -------------------------------------------------------------------


def _slugify(value: str) -> str:
    """Convierte 'Costa Padel Ensenada' -> 'costa_padel_ensenada'"""
    value_norm = unicodedata.normalize("NFKD", value)
    value_ascii = value_norm.encode("ascii", "ignore").decode("ascii")
    value_clean = re.sub(r"[^a-zA-Z0-9]+", "_", value_ascii)
    value_clean = value_clean.strip("_").lower()
    return value_clean or "club"


def _generate_club_slug(name: str, city: str | None, conn) -> str:
    """
    Genera un slug único a partir de name + city.
    Si ya existe, le agrega _2, _3, etc.
    """
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


# -------------------------------------------------------------------
# Tablas que permitimos ver desde el admin (solo lectura genérica)
# -------------------------------------------------------------------
ALLOWED_TABLES = {
    "clubs": """
        SELECT id, slug, name, city, state, country, lat, lon, image_url, created_at
        FROM clubs
    """,
    "courts": """
        SELECT id, club_id, slug, name, image_url
        FROM courts
    """,
    "events": """
        SELECT id, title, club_id, date, status, cta, created_at
        FROM events
    """,
}


@bp.get("/tables")
def admin_tables():
    """
    Devuelve la lista de tablas administrables para el front.
    Ejemplo de respuesta:
    { "tables": ["clubs", "courts", "events"] }
    """
    return jsonify({"tables": list(ALLOWED_TABLES.keys())})


@bp.get("/table/<name>")
def admin_table(name: str):
    """
    Devuelve filas de la tabla indicada (solo lectura).
    Respuesta:
    {
      "table": "clubs",
      "limit": 50,
      "offset": 0,
      "items": [ ... ]
    }
    """
    name = name.strip()

    if name not in ALLOWED_TABLES:
        return jsonify({"error": "table not allowed"}), 404

    # Paginación básica con try/except por si mandan basura
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


# -------------------------------------------------------------------
# CRUD específico de clubs para el panel (listar / crear / borrar)
# -------------------------------------------------------------------


@bp.get("/clubs")
def admin_list_clubs():
    """
    Lista rápida de clubs. No la está usando el front ahorita,
    pero es útil para depurar.
    """
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
    """
    Crea un nuevo club.

    Soporta dos modos:

    1) JSON (por scripts / herramientas):
       Content-Type: application/json
       {
         "slug": "san_marino_padel",
         "name": "San Marino Padel",
         "country": "México",
         "city": "Ensenada",
         "state": "Baja California",
         "image_url": "images/clubs/san_marino_padel.jpg",
         "lat": 31.123,
         "lon": -116.123
       }

    2) multipart/form-data (desde el panel admin con upload):
       - name (obligatorio)
       - country (obligatorio)
       - city, state, lat, lon (opcionales)
       - slug (opcional, si no viene se genera)
       - image_url (opcional, si no hay archivo se usa tal cual)
       - image (archivo opcional; si viene, se guarda como images/clubs/<slug>.<ext>)
    """

    conn = get_conn()

    # Detectamos si es JSON o form-data
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

    # slug: si te lo mandan lo respetas, si no, lo generas
    if slug_input:
        slug = slug_input
    else:
        slug = _generate_club_slug(name, city, conn)

    image_file = request.files.get("image") if not is_json else None
    image_url: str | None = None

    if image_file and image_file.filename:
        # Caso: archivo subido → lo guardamos en images/clubs/<slug>.<ext>
        _, ext = os.path.splitext(image_file.filename)
        ext = (ext or ".jpg").lower()

        os.makedirs(CLUB_IMAGE_DIR, exist_ok=True)
        filename = f"{slug}{ext}"
        fs_path = os.path.join(CLUB_IMAGE_DIR, filename)
        image_file.save(fs_path)

        image_url = f"images/clubs/{filename}"
    else:
        # Si no hay archivo pero sí image_url_input, se usa directo
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
    """
    Elimina un club por id.
    """
    conn = get_conn()
    with conn.cursor() as cur:
        cur.execute("DELETE FROM clubs WHERE id = %s", (club_id,))
        if cur.rowcount == 0:
            return jsonify({"error": "not found"}), 404
    return jsonify({"ok": True})