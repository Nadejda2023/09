
import {MongoClient} from 'mongodb';
import { DB } from '../setting';
import * as dotenv from 'dotenv'
dotenv.config()


import { PostViewModel } from '../models/postsModel';
import { BlogsViewDBModel, BlogsViewModel } from '../models/blogsModel';
import { UsersModel, UsersModelSw } from '../models/usersModel';
import { commentDBViewModel, commentViewModel } from '../models/commentModels';
import { AuthViewModel } from '../models/authModels';
import { DeviceViewModel } from '../models/deviceModel';






const url = process.env.MONGO_URL 
console.log('url:', url)
if(!url) {
  throw new Error('! Url doesn\'t found')
}


export type blogsType = {
  id:  string,
  name: string,
  description: string,
  websiteUrl: string, 
  createdAt: string,
  isMembership: boolean 
}

export type postsType =
{
  id: string,
  title: string,
  shortDescription: string,
  content: string,
  blogId: string,
  blogName: string,
  createdAt: string
}

export const client = new MongoClient(url);

export const blogsCollection = client.db("project").collection<BlogsViewModel>("blogs")
export const postsCollection = client.db("project").collection<PostViewModel>("posts")
export const usersCollection = client.db("project").collection<UsersModel>("users")
export const commentCollection = client.db("project").collection<commentDBViewModel>("comments")
export const authCollection = client.db("project").collection<AuthViewModel>("auth")
export const deviceCollection = client.db("project").collection<DeviceViewModel>("security")

export async function runDB() {
  try{
    await client.connect();
    await client.db().command({ ping:1 });
    console.log("Connected successfully to mongo server");

  } catch {
    console.log("Can't connected to db");
    await client.close();
  }
}

export const db : DB = { //нужно ли это вообще если есть модельки
  blogs: [
  {
    id: "string",
    name: "Nadejda",
    description: "string",
    websiteUrl: "string",
    createdAt: "2023-07-13T14:09:36.550Z",
  isMembership: false
    
  },
  //
  {
    id: "string",
    name: "string",
    description: "string",
    websiteUrl: "string",
    createdAt: "2023-07-13T14:09:36.550Z",
  isMembership: false
    }
  ],
  posts: [    
  {
    id: "01",
    title: "First",
    shortDescription: "string",
    content: "string",
    blogId: "0",
    blogName: "string",
    createdAt: "2023-07-13T14:09:36.550Z"
},

  {
    id: "02",
    title: "First",
    shortDescription: "string",
    content: "string",
    blogId: "1",
    blogName: "string",
    createdAt: "2023-07-13T14:09:36.550Z"
  }]
};

