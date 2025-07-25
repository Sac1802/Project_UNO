import express from 'express';
import dotenv from 'dotenv';
import router from './routes/routes.js';
import { errorHandler, notFoundHandler } from './middleware/middleware.js';

dotenv.config();
const app = express();
const port = process.env.PORT;

app.use(express.json());

app.use('/api', router);

app.use(notFoundHandler);
app.use(errorHandler);

app.listen(port, () => {
  console.log(`The server app is listening on port ${port}`);
  console.log(`URL: http://localhost:${port}`);
});
