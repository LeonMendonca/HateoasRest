import { ObjectId } from 'mongodb'

type Roles = 'everyone' | 'admin' | 'moderator';

type Users = {
  _id: ObjectId;
  name: string;
  email: string;
  role: Roles;
}

type Articles = {
  _id: ObjectId;
  title: string;
  author: string;
  published_date: Date;
}

export type { Users, Articles }
