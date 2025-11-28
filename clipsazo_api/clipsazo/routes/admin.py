# clipsazo/routes/admin.py
from flask import Blueprint, request, jsonify
from ..db import get_conn
from ..models import rows_to_dicts

bp = Blueprint("admin", __name__, url_prefix="/api/admin")

# Tablas que SÍ permites administrar
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
def list_tables():
    """Lista de tablas que el admin puede ver."""
    return jsonify({"tables": list(ALLOWED_TABLES.keys())})


@bp.get("/table/<name>")
def table_data(name: str):
    """Regresa filas de una tabla (solo lectura, con paginación básica)."""
    name = name.strip()
    if name not in ALLOWED_TABLES:
        return jsonify({"error": "table not allowed"}), 404

    limit = max(1, min(int(request.args.get("limit", 50)), 200))
    offset = max(0, int(request.args.get("offset", 0)))

    base_sql = ALLOWED_TABLES[name]
    sql = f"{base_sql} ORDER BY 1 LIMIT %s OFFSET %s"

    conn = get_conn()
    with conn.cursor() as cur:
        cur.execute(sql, (limit, offset))
        items = rows_to_dicts(cur)

    return jsonify({
        "table": name,
        "limit": limit,
        "offset": offset,
        "items": items,
    })
