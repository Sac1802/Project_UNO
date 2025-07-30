import express from 'express';
import dotenv from 'dotenv';
import gameRouter from './routes/gameRoutes.js'
import playerRouter from './routes/playerRoutes.js'
import cardRouter from './routes/cardRoutes.js'
import scroreRouter from './routes/scoreRoutes.js'
import { errorHandler, notFoundHandler } from './middlewares/middleware.js';

dotenv.config();
const app = express();
const port = process.env.PORT;

app.use(express.json());

app.use('/api/games', gameRouter);
app.use('/api/players', playerRouter);
app.use('/api/cards', cardRouter);
app.use('/api/scores', scroreRouter);

app.use(notFoundHandler);
app.use(errorHandler);

app.listen(port, () => {
  console.log(`The server app is listening on port ${port}`);
  console.log(`URL: http://localhost:${port}`);
});
