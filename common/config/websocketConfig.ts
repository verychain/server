import { WebSocketServer, WebSocket } from "ws";
import http from "http";
import jwt from "jsonwebtoken"; // JWT 검증용 (선택)
import { sendToClient } from "@/common/utils/wsMessegeSender";

export const userConnections = new Map<string, Set<WebSocket>>();
export const anonymousConnections = new Set<WebSocket>();

export function setupWebSocket(server: http.Server) {
  const wss = new WebSocketServer({ server });

  wss.on("connection", (ws: WebSocket) => {
    console.log("🔌 WebSocket 연결됨 (로그인 전)");
    anonymousConnections.add(ws);

    ws.on("message", (msg) => {
      try {
        const data = JSON.parse(msg.toString());

        // 로그인 인증 메시지 처리
        if (data.type === "AUTH" && data.token) {
          try {
            if (!data.token.startsWith('Bearer ')) {
              sendToClient(ws, "AUTH_FAILED", { reason: "Invalid token format" });
              return 
            }
          
            const token = data.token.split(' ')[1];
            // JWT 검증 (예시: username 추출)
            const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);
            const username = decoded.username;

            // 기존 anonymous set에서 제거 후 userConnections에 추가
            anonymousConnections.delete(ws);

            if (!userConnections.has(username)) {
              userConnections.set(username, new Set());
            }
            userConnections.get(username)!.add(ws);

            console.log(`✅ 유저 ${username} 인증 성공`);
            sendToClient(ws, "AUTH_SUCCESS", { username });
          } catch (err) {
            console.log("❌ AUTH 실패:", err);
            sendToClient(ws, "AUTH_FAILED", { reason: "Invalid token" });
          }
        }
      } catch (err) {
        console.log("❌ 메시지 파싱 실패:", err);
      }
    });

    ws.on("close", () => {
      anonymousConnections.delete(ws);
      // 유저별 연결에서도 제거
      for (const [username, sockets] of userConnections) {
        if (sockets.has(ws)) {
          sockets.delete(ws);
          if (sockets.size === 0) userConnections.delete(username);
        }
      }
      console.log("❌ WebSocket 연결 종료");
    });
  });

  return { wss, userConnections };
}
