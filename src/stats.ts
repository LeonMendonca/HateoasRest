import type { Request, Response, NextFunction } from "express";

function ClientStats(req: Request, res: Response, next: NextFunction) {
  console.log("REQUEST from:",req.hostname, req.ip);
  next();
}

function Req(req: Request, res: Response, next: NextFunction) {
  req.on('end', ()=> {
    console.log('The end of request');
  });
  next();
}

export { ClientStats, Req };
