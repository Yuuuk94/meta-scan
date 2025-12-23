# ---- build stage ----
FROM node:20-slim AS build
WORKDIR /app

# 빌드에 필요한 OS 패키지 (선택: openssl 등)
RUN apt-get update && apt-get install -y --no-install-recommends \
  ca-certificates git && \
  rm -rf /var/lib/apt/lists/*

COPY package*.json ./
# devDependencies 포함 설치(빌드용)
RUN npm ci

COPY tsconfig.json ./
COPY src ./src
RUN npm run build

# ---- runtime stage ----
FROM node:20-slim
WORKDIR /app

# Chromium & 폰트 설치 (Lighthouse/Chrome 의존성)
RUN apt-get update && apt-get install -y --no-install-recommends \
  chromium \
  fonts-liberation \
  tzdata \
  ca-certificates && \
  rm -rf /var/lib/apt/lists/*

# 런타임 의존성만 설치
COPY package*.json ./
RUN npm ci --omit=dev

# 빌드 산출물 복사
COPY --from=build /app/dist ./dist

# Cloud Run 기본 포트
ENV PORT=8080
ENV NODE_ENV=production
ENV PUBLIC_URL=https://meta-scan-api-752797429874.us-central1.run.app
ENV FRONT_URL=https://*.vercel.app
ENV FRONT_TEST_URL=https://*.vercel.app
# chrome-launcher가 사용할 경로 지정 (배포 이미지 내 Chromium 경로)
ENV CHROME_PATH=/usr/bin/chromium

# 헬스체크/로그에 타임존 필요 시
# ENV TZ=Asia/Seoul

# Cloud Run은 비루트 유저로 실행됨. 추가 권한 설정 불필요.
CMD ["node", "dist/app.js"]