import { WebSocket } from "ws";
import { userConnections } from "@/common/config/websocketConfig";

export type WsMessage = {
  type: string;
  payload: any;
};

// 특정 클라이언트에 메시지
export function sendToClient(ws: WebSocket, type: string, payload: any) {
  const msg: WsMessage = { type, payload };
  ws.send(JSON.stringify(msg));
}

// 특정 유저에게 메시지
export function sendToUser(
  userId: string,
  type: string,
  payload: any
) {
  const sockets = userConnections.get(userId);
  if (!sockets) return;

  const msg: WsMessage = { type, payload };
  const data = JSON.stringify(msg);

  sockets.forEach((ws) => {
    if (ws.readyState === WebSocket.OPEN) {
      ws.send(data);
    }
  });
}