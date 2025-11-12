from typing import Any, Dict, Iterable, List, Tuple

def rows_to_dicts(cursor) -> List[Dict[str, Any]]:
    cols = [c.name for c in cursor.description]
    return [dict(zip(cols, row)) for row in cursor.fetchall()]

# Campos esperados:
# clubs: id, slug, name, city, state, country, lat, lon, image_url, created_at
# events: id, title, club_id, date_utc, status, cta_url, image_url, created_at