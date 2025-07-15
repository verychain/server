require('dotenv').config();

const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;
const API_PREFIX = process.env.API_PREFIX || '/api';

app.use(express.json());

// laod Router
const userRouter = require('./router/userRouter');
const tradeRouter = require('./router/tradeRouter');

// register routers
app.use(`${API_PREFIX}/user`, userRouter);
app.use(`${API_PREFIX}/trade`, tradeRouter);

// just for testing
app.get('/ping', (req, res) => {
  res.send('pong');
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});