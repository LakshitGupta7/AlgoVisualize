FROM python:3.11-slim

WORKDIR /app

RUN pip install --no-cache-dir django djangorestframework djangorestframework-simplejwt django-cors-headers gunicorn

COPY . .

EXPOSE 8001

CMD ["gunicorn", "--bind", "0.0.0.0:8001", "dsa_auth.wsgi:application"]
