import express from 'express';
import dotenv from 'dotenv';
import router  from './routes/routes.js'

dotenv.config();
const app = express();
const port = process.env.PORT;

app.use(express.json());

app.use('/api', router);

app.listen(port, ()=>{
    console.log(`The server app listen in port ${port}`);
    console.log(`URL: http://localhost:${port}`);
})