FROM nvidia/cuda:12.2.2-cudnn8-runtime-ubuntu22.04

ENV DEBIAN_FRONTEND=noninteractive
ENV TZ=Europe/Moscow

RUN rm -f /etc/apt/sources.list.d/cuda* \
    && rm -f /etc/apt/sources.list.d/nvidia* && \
    apt-get update && \
    apt-get install -y curl software-properties-common && \
    add-apt-repository ppa:deadsnakes/ppa && \
    apt-get update && \
    DEBIAN_FRONTEND=noninteractive apt-get -y install python3.11 python3.11-distutils && \
    curl -sS https://bootstrap.pypa.io/get-pip.py | python3.11

WORKDIR /app
ENV PYTHONPATH=/app

COPY . /app/src/
EXPOSE 8081

RUN apt-get update && apt-get install -y curl && apt-get clean
RUN apt install -y ffmpeg

RUN apt-get remove --purge -y python3.10 && apt-get autoremove -y

RUN pip install poetry
WORKDIR /app/src

RUN poetry install --no-root

CMD ["uvicorn", "whisper.whisper:app", "--reload", "--port", "8081", "--host", "0.0.0.0"]