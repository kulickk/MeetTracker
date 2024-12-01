#FROM python:3.10.15-bullseye
#
#COPY pyproject.toml .
#
#RUN pip install poetry
#
#RUN poetry install
#
#WORKDIR /app
#
#COPY /src/main.py /app/main.py
#
#ENTRYPOINT ["python", "main.py"]

# 1. Базовый образ
FROM python:3.10-slim

# 2. Метаданные
LABEL maintainer="lilrik1328@gmail.com"
LABEL description="Meet-Tracker application"

# 3. Установка системных зависимостей
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    curl \
    ffmpeg \
    libsndfile1 \
    libpq-dev \
    supervisor && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

# 4. Установка poetry
RUN curl -sSL https://install.python-poetry.org | python3 - && \
    ln -s /root/.local/bin/poetry /usr/local/bin/poetry

# 5. Установка рабочей директории
WORKDIR /app

# 6. Копирование зависимостей
COPY pyproject.toml poetry.lock ./

# 7. Установка Python-зависимостей через poetry
RUN poetry config virtualenvs.create false && \
    poetry install --no-dev --no-interaction --no-ansi

# 8. Копирование исходного кода
COPY . .

# 9. Экспорт переменных окружения
ENV PYTHONUNBUFFERED=1 \
    ENV_FILE_PATH="/app/.env"

# 10. Установка конфигурации supervisord
COPY supervisord.conf /etc/supervisor/conf.d/supervisord.conf

# 11. Открытие портов
EXPOSE 8000 5000

# 12. Запуск supervisord
CMD ["supervisord", "-c", "/etc/supervisor/conf.d/supervisord.conf"]