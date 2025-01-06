FROM ubuntu:24.04

RUN apt-get update && apt-get install -y curl bash

RUN curl -fsSL https://ollama.com/install.sh | sh

RUN ollama pull kulick/t-lite:latest

CMD [ "ollama", "serve" ]