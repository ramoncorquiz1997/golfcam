from flask import Flask, jsonify
from flask_cors import CORS
from config import get_config
from clipsazo.db import init_pool  # 👈 ya no importamos close_pool
from clipsazo.routes import register_blueprints


def create_app():
    app = Flask(__name__)
    app.config.from_object(get_config()())

    # CORS
    CORS(app, resources={r"/api/*": {"origins": app.config["CORS_ORIGINS"]}})

    # DB pool (se crea una sola vez por proceso)
    init_pool(app)

    # Blueprints
    register_blueprints(app)

    @app.get("/api/health")
    def health():
        return jsonify({"ok": True})

    # 👇 IMPORTANTE: ya NO cerramos el pool en cada request
    # @app.teardown_appcontext
    # def _shutdown(_exc):
    #     close_pool()

    return app


if __name__ == "__main__":
    app = create_app()
    app.run(
        host="0.0.0.0",
        port=app.config["PORT"],
        debug=app.config.get("DEBUG", False),
    )
