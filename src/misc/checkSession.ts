import type {Request, Response, NextFunction } from "express";
import { getPayloadFromSid } from "./session";
import { ErrorCode } from "../customError/error";

function checkSession(req: Request, res: Response, next: NextFunction) {
  try {
    const payload = (req.query?.sessionid) ? getPayloadFromSid(String(req.query.sessionid)) : null ;
    if(payload === null) {
      throw new ErrorCode('No sessionid property provided', 10002);
    } else if(payload === undefined) {
      throw new ErrorCode('Not a valid session Id!', 10003);
    } else {
      next();
    }  
  } catch (error) {
    if(error instanceof ErrorCode) {
      next(error);
    }
  }
  
}

export { checkSession };
