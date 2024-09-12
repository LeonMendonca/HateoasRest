import { compare } from "bcrypt";
import type { Request, Response, NextFunction } from "express";

import { DAOclass } from "./misc/dao";
import { createArticleObject, createUserObject, loginExistingUserObject, patchArticleObject } from "./misc/factoryFunctions";
import { checkSessionId, createSessionId, getPayloadFromSid } from "./misc/session";
import { ErrorCode } from "./customError/error";
import { atLogin, userArticles } from "./misc/hypertextConst";

const url = 'http://localhost:3000';

class Controllers {
  static async createNewUser(req: Request, res: Response, next: NextFunction) {
    try {
      const body: unknown = req.body;
      const user = await createUserObject(body);
      const response = await DAOclass.createNewUserDAO(user);
      res.status(201).json({ message: response.insertedId });
    } catch (error) {
      if(error instanceof ErrorCode) {
        next(error);
        return;
      }
      res.send(404).send("Something went wrong");
    }
  } 

  static async loginExistingUser(req: Request, res: Response, next: NextFunction) {
    try {
      const body: unknown = req.body;
      const loginUser = await loginExistingUserObject(body);
      const response = await DAOclass.loginExistingUserDAO(loginUser);
      if(!response) {
        throw new ErrorCode('no user found', 10000);
      }
      const isValidPass = await compare(loginUser.password, response.password);
      if(!isValidPass) {
        throw new ErrorCode('not a valid password', 10001);
      }
      let sessionid: string | undefined = undefined;
      sessionid = checkSessionId(String(response._id));
      if(!sessionid) {
        sessionid = createSessionId(response);
      }
      res.status(200).json({ 
        sessionid: sessionid, 
        links: atLogin(response, sessionid)
      });
    } catch (error) {
      if(error instanceof ErrorCode) {
        //call error middleware
        next(error);
        return;
      }
      res.send(404).send("Something went wrong");
    }
  }

  static async getUserArticles(req: Request, res: Response, next: NextFunction) {
    try {
      const payload = getPayloadFromSid(String(req.query.sessionid))
      if(!payload) {
        throw new ErrorCode("not a valid session ID", 10003);
      }
      const response = await DAOclass.getUserArticlesDAO(payload._id);
      res.status(200).json({ 
        links: userArticles(response),
        response 
      });
    } catch (error) {
      if(error instanceof ErrorCode) {
        //call error middleware
        next(error);
        return;
      }
      res.send(404).send("Something went wrong");
    }
  }

  static async getAllArticles(req: Request, res: Response, next: NextFunction) {
    try {
      const payload = getPayloadFromSid(String(req.query.sessionid))
      if(!payload) {
        throw new ErrorCode("not a valid session ID", 10003);
      }
      if(payload.role !== 'admin') {
        throw new ErrorCode("not authorised", 30000);
      }
      console.log();
      const pageno: number | undefined = (req.query?.pageno) ? parseInt(req.query.pageno as string) : undefined;
      //pageno = 0 also evaluates false
      if(pageno === undefined) {
        throw new ErrorCode("pageno required", 20000);
      } 
      if(pageno <= 0) {
        throw new ErrorCode("pageno=1", 20000);
      }
      const response = await DAOclass.getAllArticlesDAO(pageno);
      res.status(200).json(response);
    } catch (error) {
      if(error instanceof ErrorCode) {
        next(error);
        return;
      }
      res.status(404).json({ error });
    }
  }

  static async createArticle(req: Request, res: Response, next: NextFunction) {
    try {
      const body: unknown = req.body;
      const payload = getPayloadFromSid(String(req.query.sessionid));
      if(!payload) {
        throw new ErrorCode('Not a valid sessionid', 10003);
      }
      const article = await createArticleObject(body, payload._id);
      const response = await DAOclass.createArticleDAO(article);
      res.status(201).json({ uploadedArticleId: response.insertedId });
    } catch (error) {
      if(error instanceof ErrorCode) {
        next(error);
        return;
      }
      res.status(404).json({ error });
    }
  }

  static async patchArticle(req: Request, res: Response, next: NextFunction) {
    try {
      const body: unknown = req.body; 
      const articleid: string | undefined = req.params.articleid;
      const payload = getPayloadFromSid(String(req.query.sessionid));
      if(!payload) {
        throw new ErrorCode('Not a valid sessionid', 10003);
      }
      if(!articleid) {
        throw new ErrorCode('No blog id', 10004);
      }
      if(payload.role !== 'admin') {
        throw new ErrorCode('Not authorised', 30000);
      }
      const patchArticle = await patchArticleObject(body);
      const response = await DAOclass.patchArticleDAO(patchArticle, articleid);
      res.status(203).json(response);
    } catch (error) {
      if(error instanceof ErrorCode) {
        next(error);
        return;
      }
      res.status(404).json({ error });
    }
  }
}

export { Controllers }
