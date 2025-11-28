# clipsazo/routes/admin.py
from flask import Blueprint, request, jsonify
from ..db import get_conn
from ..models import rows_to_dicts

bp = Blueprint("admin", __name__, url_prefix="/api/admin")

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
# CRUD específico de clubs para el panel (crear / borrar)
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
    Espera JSON:
    {
      "slug": "san-marino-padel",
      "name": "San Marino Padel",
      "country": "México",
      "city": "Ensenada",
      "state": "Baja California",
      "image_url": "images/clubs/san_marino_padel.jpg",
      "lat": 31.123,
      "lon": -116.123
    }
    """
    data = request.get_json(force=True) or {}

    slug = (data.get("slug") or "").strip()
    name = (data.get("name") or "").strip()
    country = (data.get("country") or "").strip()

    if not slug or not name or not country:
        return (
            jsonify(
                {"error": "slug, name y country son obligatorios"}
            ),
            400,
        )

    city = (data.get("city") or "").strip() or None
    state = (data.get("state") or "").strip() or None
    image_url = (data.get("image_url") or "").strip() or None

    lat = data.get("lat")
    lon = data.get("lon")

    conn = get_conn()
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