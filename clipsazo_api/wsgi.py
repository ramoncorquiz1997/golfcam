from app import create_app

app = create_app()

# Gunicorn entrypoint: gunicorn -c gunicorn.conf.py wsgi:app