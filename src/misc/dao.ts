import { collectionUserInst, collectionArticleInst } from "../index";
import { MongoServerError, type UpdateResult} from "mongodb";

import { ObjectId, type InsertOneResult, type WithId } from "mongodb";
import type { TUsers, TArticles } from "../database/types"
import type { TArticlePatch, TLogin } from "./factoryFunctions";

class DAOclass {
  static async createNewUserDAO(user: TUsers) {
    try {
      const response = await collectionUserInst.insertOne(user);
      return response;
    } catch (error) {
      if(error instanceof MongoServerError) {
        console.log("Wait what?",error);
      }
      throw error;
    }
  }

  static async loginExistingUserDAO(login: TLogin): Promise<WithId<TUsers> | null> {
    try {
      const response = await collectionUserInst.findOne({ email: login.email })
      return response;
    } catch (error) {
      throw error;
    }
  }

  static async getUserArticlesDAO(userid: ObjectId) {
    try {
      const response = await collectionArticleInst.find({ referenceId : userid }).toArray();
      return response;
    } catch (error) {
      throw error;
    }
  }

  static async getAllArticlesDAO(pageno: number): Promise<WithId<TArticles>[]> {
    const docPerPage: number = 5;
    try {
      const response = await collectionArticleInst.find()
      .sort({ _id: 1 })
      .skip( (pageno > 0) ? (pageno - 1) * docPerPage : 0 )
      .limit(docPerPage)
      .toArray();
      return response;
    } catch (error) {
      throw error;
    }
  }

  static async createArticleDAO(article: TArticles): Promise<InsertOneResult<TArticles>> {
    try {
      const response = await collectionArticleInst.insertOne(article);
      return response;
    } catch (error) {
      throw error;
    }
  }

  static async patchArticleDAO(patcharticle: TArticlePatch, articleid: string): Promise<UpdateResult<TArticles>> {
    try {
      const blogObjectId = new ObjectId(articleid);
      console.log(blogObjectId);
      const response = await collectionArticleInst.updateOne({ _id: blogObjectId }, { $set: patcharticle })
      return response;
    } catch (error) {
      throw error;
    }
  }
}

export { DAOclass };
