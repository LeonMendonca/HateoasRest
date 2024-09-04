import express from "express";
import type { NextFunction, Request, Response } from "express";
import { createServer } from "http";

import { ClientStats, Req } from "./stats";

const app = express();
const PORT = 3000;

//chaining middleware
app.use((req, res, next) => {
  console.log('Request URL', req.originalUrl);
  next(); 
}, (req, res, next)=> {
  console.log('Request Method', req.method);
  next();
});

//array of middleware
const logs = [ClientStats, Req];
app.use(logs);

app.get('/', (req: Request, res: Response) => {  
  res.set({'Content-Type': 'application/json'}).status(200).json({message: 'server ping'});
  console.log(res.headersSent);
});

app.use((req: Request, res: Response)=> {
  res.status(404).json({error: `cannot ${req.method} ${req.path}`});
});

app.use((error: unknown, req: Request, res: Response, next: NextFunction)=> {
  if(error instanceof Error) {
    res.status(500).send(error.message);
    return;
  }
  res.status(500).send('Internal server error');
});

const server = createServer(app)
server.listen(PORT, '127.0.0.1', ()=> {
  console.log('listening to port',PORT);
});
