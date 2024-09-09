import { MongoClient, ServerApiVersion } from "mongodb";
import type { TUsers, TArticles } from "./types";

const uri = 'mongodb://localhost:27017'

const mongodbClient = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true
  },
  monitorCommands: true,
});

async function MongoDbConnect() {
  await mongodbClient.connect();
  const cmsDatabase = mongodbClient.db('cms');
  const collectionUser = await cmsDatabase.createCollection<TUsers>('users');
  cmsDatabase.createIndex('users', 'name' ,{ unique: true });
  const collectionArticle = await cmsDatabase.createCollection<TArticles>('articles');
  return { collectionUser, collectionArticle };
};

mongodbClient.on('connectionCreated' ,()=> {
  console.log('connected to database');
});

mongodbClient.on('error',(error)=> {
  console.log(error.message);
});

export { MongoDbConnect };
