import { ObjectId } from 'mongodb'

type Roles = 'everyone' | 'admin' | 'moderator';

type TUsers = {
  _id: ObjectId;
  name: string;
  email: string;
  password: string;
  role: Roles;
}

type TArticles = {
  _id: ObjectId;
  title: string;
  author: string;
  referenceId: ObjectId;
  published_date: Date;
}

export type { TUsers, TArticles, Roles }
