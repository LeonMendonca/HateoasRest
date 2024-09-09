import type {Request, Response, NextFunction } from "express";
import { getPayloadFromSid } from "./session";

function checkSession(req: Request, res: Response, next: NextFunction) {
  const payload = (req.query?.sessionid) ? getPayloadFromSid(String(req.query.sessionid)) : null ;
  if(payload === null) {
    throw new Error('No session id provided');
  } else if(payload === undefined) {
    throw new Error('Not a valid session Id!');
  } else {
    return res.send(payload);
  }
}

export { checkSession };
