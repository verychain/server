import cors, { CorsOptions } from "cors";

const corsOptions: CorsOptions = {
  origin: "*", // 개발 단계에서는 전체 허용 (배포 시 특정 도메인만 허용 추천)
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

export const corsMiddleware = cors(corsOptions);
