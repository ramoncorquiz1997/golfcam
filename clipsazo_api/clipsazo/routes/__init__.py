# clipsazo/routes/__init__.py

from flask import Flask

# Importa tus blueprints individuales
from .clubs import bp as clubs_bp
# Más adelante aquí puedes agregar:
# from .courts import bp as courts_bp
# from .events import bp as events_bp

def register_blueprints(app: Flask) -> None:
    """Registra todos los blueprints en la app Flask."""
    app.register_blueprint(clubs_bp)
    # Cuando tengas más blueprints:
    # app.register_blueprint(courts_bp)
    # app.register_blueprint(events_bp)
