from flask import Blueprint, request, jsonify
from ..db import get_conn
from ..models import rows_to_dicts

bp = Blueprint("clubs", __name__)

@bp.get("/clubs")
def list_clubs():
    """
    Filtros opcionales: country, state, city, q (texto), limit, offset
    Orden por name asc.
    """
    qparams = []
    where = []
    qtext = (request.args.get("q") or "").strip()
    country = (request.args.get("country") or "").strip()
    state   = (request.args.get("state") or "").strip()
    city    = (request.args.get("city") or "").strip()

    if country:
        where.append("country = %s"); qparams.append(country)
    if state:
        where.append("state = %s"); qparams.append(state)
    if city:
        where.append("city = %s"); qparams.append(city)
    if qtext:
        where.append("(slug ILIKE %s OR name ILIKE %s OR city ILIKE %s OR state ILIKE %s OR country ILIKE %s)")
        like = f"%{qtext}%"
        qparams += [like, like, like, like, like]

    where_sql = (" WHERE " + " AND ".join(where)) if where else ""
    limit = max(1, min(int(request.args.get("limit", 30)), 100))
    offset = max(0, int(request.args.get("offset", 0)))

    conn = get_conn()
    with conn.cursor() as cur:
        cur.execute(f"SELECT COUNT(*) FROM clubs{where_sql}", qparams)
        total = cur.fetchone()[0]

        cur.execute(
            f"""SELECT id, slug, name, city, state, country, lat, lon, image_url
                FROM clubs
                {where_sql}
                ORDER BY name ASC
                LIMIT %s OFFSET %s""",
            qparams + [limit, offset],
        )
        items = rows_to_dicts(cur)

    return jsonify({"total": total, "limit": limit, "offset": offset, "items": items})

@bp.get("/clubs/<slug>")
def get_club(slug: str):
    conn = get_conn()
    with conn.cursor() as cur:
        cur.execute("""SELECT id, slug, name, city, state, country, lat, lon, image_url
                       FROM clubs WHERE slug = %s""", [slug])
        rows = rows_to_dicts(cur)
    if not rows:
        return jsonify({"error": "not found"}), 404
    return jsonify(rows[0])