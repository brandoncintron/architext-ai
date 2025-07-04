# Stage 1: Build the Next.js frontend
FROM node:22-slim AS builder
WORKDIR /app

COPY package.json package-lock.json ./

RUN npm install

COPY . .

RUN npm run build

# Stage 2: Production image
FROM node:22-slim

WORKDIR /app

RUN apt-get update && apt-get install -y python3 python3-pip python3-venv

COPY --from=builder /app/package.json /app/package-lock.json ./
RUN npm install --omit=dev

COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/next.config.ts ./next.config.ts

ENV VIRTUAL_ENV=/app/venv
RUN python3 -m venv $VIRTUAL_ENV
ENV PATH="$VIRTUAL_ENV/bin:$PATH"

COPY api/requirements.txt ./requirements.txt
RUN pip install --no-cache-dir -r requirements.txt
RUN pip install gunicorn
COPY api/ ./api

COPY run.sh ./run.sh
RUN chmod +x ./run.sh

EXPOSE 3000 8000
CMD ["./run.sh"]