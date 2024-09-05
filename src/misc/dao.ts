import { collectionUserInst, collectionArticleInst } from "../index";
import type { Users, Articles } from "../database/types"
import { ObjectId } from "mongodb";

const user: Users = {
  _id: new ObjectId(),
  name: 'leon',
  email: 'leon@gmail.com',
  role: 'moderator'
}

class DAOclass {
  static async createNewUser() {
    try {
      const response = await collectionUserInst.insertOne(user);
      return response;
    } catch (error) {
      throw error;
    }
  }
}

await DAOclass.createNewUser();

export { DAOclass };
