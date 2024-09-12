import type { ErrorCode } from "./error";
import type { NextFunction, Request, Response } from "express"

const url = 'http://localhost:3000'

function errorHandler(error: ErrorCode, req: Request, res: Response, next: NextFunction) {
  //no user found
  if(error.code === 10000) {
    res.status(404).json({ 
      error: error.message, 
      code: error.code,
      link: { 
        signup: `${url}/auth/signup`
      } 
    });
    return;
  }
  //invalid password
  if(error.code === 10001) {
    console.log('invalid pass called');
    res.status(404).json({ 
      error: error.message, 
      code: error.code,
      link: { 
        reset_password: `${url}/auth/reset`
      } 
    });
    return;
  }
  //no sessionid property
  if(error.code === 10002) {
    res.status(404).json({ 
      error: error.message, 
      code: error.code,
    });
    return;
  }
  //invalid sessionid
  if(error.code === 10003) {
    res.status(404).json({ 
      error: error.message, 
      code: error.code,
      link: { 
        login: `${url}/auth/login`
      } 
    });
    return;
  }
  //invalid data format received / empty data
  if(error.code === 20000) {
    res.status(404).json({ 
      error: error.message, 
      code: error.code 
    });
    return;
  }
  //unauthorised
  if(error.code === 30000) {
    res.status(403).json({
      error: error.message,
      code: error.code
    });
    return;
  }
  res.status(404).send('Something went wrong!');
}

export { errorHandler };
