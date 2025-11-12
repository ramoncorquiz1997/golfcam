import psycopg2
from psycopg2.pool import SimpleConnectionPool
from flask import current_app, g

_pool: SimpleConnectionPool | None = None

def init_pool(app):
    global _pool
    if _pool:  # ya inicializado
        return
    _pool = SimpleConnectionPool(
        minconn=1,
        maxconn=8,
        host=app.config["PGHOST"],
        port=app.config["PGPORT"],
        dbname=app.config["PGDATABASE"],
        user=app.config["PGUSER"],
        password=app.config["PGPASSWORD"],
        connect_timeout=5,
    )

def get_conn():
    if "db_conn" not in g:
        if _pool is None:
            raise RuntimeError("DB pool not initialized")
        g.db_conn = _pool.getconn()
        g.db_conn.autocommit = True
    return g.db_conn

def put_conn():
    conn = g.pop("db_conn", None)
    if conn and _pool:
        _pool.putconn(conn)

def close_pool():
    global _pool
    if _pool:
        _pool.closeall()
        _pool = None

# Hook para liberar conexión por request
from flask import request_finished
@request_finished.connect
def _return_conn(sender, response, **extra):  # noqa
    put_conn()