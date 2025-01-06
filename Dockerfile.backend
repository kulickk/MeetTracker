FROM python:3.10-bullseye

WORKDIR /app
ENV PYTHONPATH=/app

COPY src /app/src
COPY pyproject.toml /app/
COPY poetry.toml /app/
COPY poetry.lock /app/
COPY alembic /app/alembic
COPY alembic.ini /app/alembic.ini
EXPOSE 8000
RUN apt-get update && apt-get install -y curl && apt-get clean
RUN apt install -y ffmpeg
RUN pip install poetry
RUN poetry install --no-root

CMD ["uvicorn", "src.main:app", "--reload", "--port", "8000", "--host", "0.0.0.0"]
