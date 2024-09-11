import express from "express";
import type { NextFunction, Request, Response } from "express";
import { createServer } from "http";
import type { Collection } from "mongodb";

import { ClientStats, Req } from "./stats";
import { MongoDbConnect } from "./database/conn";
import { r } from "./routes";
import { uriHelper } from "./misc/helperUri";
import type { TUsers, TArticles } from "./database/types";


const app = express();
const PORT = 3000;

//instances for database collections
let collectionUserInst: Collection<TUsers>
let collectionArticleInst: Collection<TArticles>

//express parsers
app.use(express.json());
app.use(express.urlencoded({ extended: false }));


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

//auth router middleware
app.use('/auth',r);

app.get('/', (req: Request, res: Response) => {  
  res.set({'Content-Type': 'application/json'}).status(200).json({ 
    message: 'dashboard', 
    links: { 
      login: '/auth/login',
      signup: '/auth/signup',
    } 
  });
  console.log(res.headersSent);
});

//404 middleware
app.use((req: Request, res: Response)=> {
  const uris = uriHelper(req.url);
  let helperMessage = uris;
  if(typeof uris === 'string') {
    helperMessage = uris;
  } else {
    helperMessage = `Did you mean? ${uris.join(" or ")}`;
  }
  res.status(404).json({error: `cannot ${req.method} ${req.path}. ${helperMessage}`});
//
});

app.use((error: unknown, req: Request, res: Response, next: NextFunction)=> {
  if(error instanceof Error) {
    res.status(500).send(error.message);
    return;
  }
  res.status(500).send('Internal server error');
});

(async()=>{
  try {
    const { collectionUser, collectionArticle } = await MongoDbConnect();
    collectionUserInst = collectionUser;
    collectionArticleInst = collectionArticle;
    const server = createServer(app);
    server.listen(PORT, '127.0.0.1', ()=> {
      console.log('listening to port',PORT);
    });
  } catch (error) {
    if(error instanceof Error) {
      console.log(error.message);
      return;
    }
    console.log(error);
  } 
})()

export { collectionUserInst, collectionArticleInst };
