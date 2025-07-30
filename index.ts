import express from "express";
import dotenv from "dotenv";
dotenv.config();

const PORT = process.env.PORT || 3000;
const API_PREFIX = process.env.API_PREFIX || "/api";

const app = express();

app.use(express.json());

// laod Router
import userRouter from "./router/userRouter";
import tradeRouter from "./router/tradeRouter";

// register routers
app.use(`${API_PREFIX}/user`, userRouter);
app.use(`${API_PREFIX}/trade`, tradeRouter);

// just for testing
app.get("/ping", (req, res) => {
  res.send("pong");
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});