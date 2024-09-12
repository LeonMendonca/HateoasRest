import { ObjectId } from "mongodb";
import type { TUsers, TArticles, Roles } from "../database/types";
import { articleSchema, loginSchema, userSchema } from "./validator";

import { hash } from "bcrypt";
import { ErrorCode } from "../customError/error";

type TUser = {
  name: string;
  email: string;
  password: string;
  role: Roles;
}

type TLogin = {
  email: string;
  password: string;
}

type TArticle = {
  title: string;
  author: string;
}

type TArticlePatch = {
  title?: string;
  author?: string;
}

async function createUserObject(object: unknown): Promise<TUsers> {
  try {
    if(isUser(object)) {
      await userSchema.validateAsync(object);
      const hashPassword: string = await hash(object.password, 10);
      return {
        _id: new ObjectId(),
        name: object.name,
        password: hashPassword,
        email: object.email,
        role: object.role,
      }
    } else {
      throw new ErrorCode('Not a valid object', 20000);
    }
  } catch (error) {
    throw error; 
  } 
}

async function loginExistingUserObject(object: unknown): Promise<TLogin> {
  try {
    if(isLogin(object)) {
      await loginSchema.validateAsync(object);
      return {
        email: object.email,
        password: object.password
      }
    } else {
      throw new ErrorCode('Not a valid object', 20000);
    }
  } catch (error) {
    throw error;
  }
}

async function createArticleObject(object: unknown, userId: ObjectId): Promise<TArticles> {
  try {
    if(isArticle(object)) {
      await articleSchema.validateAsync(object);
      return {
        _id: new ObjectId(),
        title: object.title,
        author: object.author,
        referenceId: userId,
        published_date: new Date(),
      }
    } else {
      throw new ErrorCode('Not a valid object', 20000);
    }
  } catch (error) {
    throw error;
  }
}

async function patchArticleObject(object: unknown): Promise<TArticlePatch> {
  try {
    if(isPatchArticle(object)) {
      const patchobject: TArticlePatch = {};
      const allowedKeys: (keyof TArticlePatch)[] = ['title', 'author'];
      for (const element of allowedKeys) {
        if(object[element]) {
          patchobject[element] = object[element];
        }
      }
      return patchobject;
    } else {
      throw new ErrorCode('Not a valid object', 20000);
    }
  } catch (error) {
    throw error;
  }  
}

function isUser(object: unknown): object is TUser {
  if(object && typeof object === 'object' && 'name' in object && 'email' in object && 'password' in object && 'role' in object) {
    return true;
  }
  return false;
}

function isLogin(object: unknown): object is TLogin {
  if(object && typeof object === 'object' && 'email' in object && 'password' in object) {
    return true;
  }
  return false;
}

function isArticle(object: unknown): object is TArticle {
  if(object && typeof object === 'object' && 'title' in object && 'author' in object) {
    return true;
  }
  return false;
}

function isPatchArticle(object: unknown): object is TArticlePatch {
  if(object && typeof object === 'object' && ('title' in object || 'author' in object)) {
    return true;
  }
  return false;
}

export { createUserObject, loginExistingUserObject, createArticleObject, patchArticleObject };
export type { TLogin, TArticlePatch };
