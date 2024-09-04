import express, {  } from "express";
import { createServer } from "http";

const app = express();
const PORT = 3000;

app.get('/', (req, res) => {
  res.status(200).send('hello world');
});

const server = createServer(app)
server.listen(PORT, '127.0.0.1', ()=> {
  console.log('listening to port',PORT);
});
