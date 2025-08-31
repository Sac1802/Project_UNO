import express from "express";
import dotenv from "dotenv";
import gameRouter from "./routes/gameRoutes.js";
import playerRouter from "./routes/playerRoutes.js";
import cardRouter from "./routes/cardRoutes.js";
import scroreRouter from "./routes/scoreRoutes.js";
import loginRouter from "./routes/loginRoutes.js";
import matchRouter from "./routes/matchRoutes.js";
import trackingRouter from "./routes/trackingRoutes.js";
import { eitherLogger } from "./middlewares/middleware.js";
import { verifyToken } from "./middlewares/verifyToken.js";
import { initSocket } from "./utils/socket.js";
import http from "http";
import responseTime from "response-time";

dotenv.config();
const app = express();
const port = process.env.PORT;

app.use(express.json());
const server = http.createServer(app);

app.use(responseTime((req, res, time) => {
  res.locals.responseTime = parseFloat(time.toFixed(3));
}));


const io = initSocket(server);

const excludedRoutes = ["/api/auth/login", "/api/players"];

app.use((req, res, next) => {
  const isExcluded = excludedRoutes.includes(req.path);
  if (isExcluded) {
    return next();
  }
  verifyToken(req, res, next);
});


app.use("/api/games", gameRouter);
app.use("/api/players", playerRouter);
app.use("/api/cards", cardRouter);
app.use("/api/scores", scroreRouter);
app.use("/api/auth", loginRouter);
app.use("/api/match", matchRouter);
app.use("/api/stats", trackingRouter);

app.use(eitherLogger);

app.listen(port, () => {
  console.log(`The server app is listening on port ${port}`);
  console.log(`URL: http://localhost:${port}`);
});

export default app;
