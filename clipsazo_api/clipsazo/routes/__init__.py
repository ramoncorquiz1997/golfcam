# clipsazo/routes/__init__.py

from flask import Flask
from .admin import bp as admin_bp
from .clubs import bp as clubs_bp


def register_blueprints(app: Flask) -> None:
    app.register_blueprint(clubs_bp)
    app.register_blueprint(admin_bp)
