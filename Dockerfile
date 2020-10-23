FROM nodered/node-red:latest

WORKDIR /app

COPY ./ /app

RUN npm install --unsafe-perm --no-update-notifier --no-fund --only=production

WORKDIR /usr/src/node-red

RUN npm install /app