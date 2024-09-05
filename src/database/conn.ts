import { MongoClient, ServerApiVersion } from "mongodb";
import type { Users, Articles } from "./types";

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
  const collectionUser = await mongodbClient.db('cms').createCollection<Users>('users');
  const collectionArticle = await mongodbClient.db('cms').createCollection<Articles>('articles');
  return { collectionUser, collectionArticle };
};

mongodbClient.on('connectionCreated',()=> {
  console.log('connected to database');
});

mongodbClient.on('error',(error)=> {
  console.log(error.message);
});

export { MongoDbConnect };
