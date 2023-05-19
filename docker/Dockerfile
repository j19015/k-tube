FROM node:18

WORKDIR /opt/app

RUN apt update && apt install -y vim

COPY ./entrypoint.sh /usr/bin/local/entrypoint.sh

ENTRYPOINT /usr/bin/local/entrypoint.sh
