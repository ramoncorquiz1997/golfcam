# clipsazo/routes/admin.py
from flask import Blueprint, request, jsonify
from ..db import get_conn
from .models import rows_to_dicts  # ajusta el import según donde tengas rows_to_dicts

bp = Blueprint("admin", __name__, url_prefix="/api/admin")


# GET /api/admin/clubs → lista TODOS los clubs (sin filtros fancy)
@bp.get("/clubs")
def admin_list_clubs():
    conn = get_conn()
    with conn.cursor() as cur:
        cur.execute(
            """
            SELECT id, slug, name, city, state, country, lat, lon, image_url
            FROM clubs
            ORDER BY id ASC
            """
        )
        items = rows_to_dicts(cur)
    return jsonify({"items": items})


# POST /api/admin/clubs → crea un club nuevo
@bp.post("/clubs")
def admin_create_club():
    data = request.get_json(force=True) or {}

    required = ["slug", "name", "country"]
    missing = [k for k in required if not data.get(k)]
    if missing:
        return jsonify({"error": f"Missing fields: {', '.join(missing)}"}), 400

    conn = get_conn()
    with conn.cursor() as cur:
        cur.execute(
            """
            INSERT INTO clubs (slug, name, city, state, country, lat, lon, image_url)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
            RETURNING id, slug, name, city, state, country, lat, lon, image_url
            """,
            [
                data.get("slug"),
                data.get("name"),
                data.get("city"),
                data.get("state"),
                data.get("country"),
                data.get("lat"),
                data.get("lon"),
                data.get("image_url"),
            ],
        )
        row = rows_to_dicts(cur)[0]
    return jsonify(row), 201


# PUT /api/admin/clubs/<int:club_id> → update parcial
@bp.put("/clubs/<int:club_id>")
def admin_update_club(club_id: int):
    data = request.get_json(force=True) or {}

    conn = get_conn()
    with conn.cursor() as cur:
        # Cargamos el actual
        cur.execute(
            """
            SELECT id, slug, name, city, state, country, lat, lon, image_url
            FROM clubs WHERE id = %s
            """,
            [club_id],
        )
        rows = rows_to_dicts(cur)
        if not rows:
            return jsonify({"error": "not found"}), 404
        current = rows[0]

        # Mezclamos campos
        updated = {
            "slug": data.get("slug", current["slug"]),
            "name": data.get("name", current["name"]),
            "city": data.get("city", current["city"]),
            "state": data.get("state", current["state"]),
            "country": data.get("country", current["country"]),
            "lat": data.get("lat", current["lat"]),
            "lon": data.get("lon", current["lon"]),
            "image_url": data.get("image_url", current["image_url"]),
        }

        cur.execute(
            """
            UPDATE clubs
               SET slug = %s,
                   name = %s,
                   city = %s,
                   state = %s,
                   country = %s,
                   lat = %s,
                   lon = %s,
                   image_url = %s
             WHERE id = %s
            RETURNING id, slug, name, city, state, country, lat, lon, image_url
            """,
            [
                updated["slug"],
                updated["name"],
                updated["city"],
                updated["state"],
                updated["country"],
                updated["lat"],
                updated["lon"],
                updated["image_url"],
                club_id,
            ],
        )
        row = rows_to_dicts(cur)[0]

    return jsonify(row)


# DELETE /api/admin/clubs/<int:club_id> → borra club
@bp.delete("/clubs/<int:club_id>")
def admin_delete_club(club_id: int):
    conn = get_conn()
    with conn.cursor() as cur:
        cur.execute("DELETE FROM clubs WHERE id = %s RETURNING id", [club_id])
        rows = rows_to_dicts(cur)
        if not rows:
            return jsonify({"error": "not found"}), 404
    return jsonify({"ok": True, "id": club_id})
