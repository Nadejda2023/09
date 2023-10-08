import cors from "cors";
import express from "express";
import { blogsRouter } from "./routers/blogs_router";
import { postsRouter } from "./routers/posts-router";
import { testingRouter } from "./routers/testing-router";
import { BlogsViewModel } from "./models/blogsModel";
import { PostViewModel } from "./models/postsModel";
import { UsersModel } from "./models/usersModel";
import { usersRouter } from "./routers/users_router";
import { authRouter } from "./routers/auth-router";
import { commentRouter } from "./routers/comment_router";
import { emailRouter } from "./routers/email-router";
import cookieParser from "cookie-parser";
import { deviceRouter } from "./routers/deviceRouter";
import { customRateLimit } from "./middlewares/middleware_rateLimit";



export const app =  express()

app.set('trust proxy', true);


export const settings = {
  MONGO_URI: process.env.mongoURI || "mongodb+srv://fsklever:popova12345@cluster0.su82uvr.mongodb.net/blog-dev?retryWrites=true&w=majority",
  JWT_SECRET: process.env.JWT_SECRET || "123",
  
  
}

export const accessTokenSecret1= process.env.ACCESS_TOKEN || "123"
export const refreshTokenSecret2 = process.env.REFRESH_TOKEN || "789"

export const RouterPaths:{blogs:string, posts: string, testing: string, users:string, auth: string, comments: string, email:string, device: string} ={
    blogs: '/blogs',
    posts: '/posts',
    testing: '/testing',
    users: '/users',
    auth: '/auth',
    comments: '/comments',
    email: '/email',
    device: '/security'
  }
  
  export type DB = {
    blogs: BlogsViewModel[]
    posts: PostViewModel[]
  }
  export type U = {
    users: UsersModel[]
  }
  
//
const corsMiddleware = cors();
app.use(corsMiddleware)
app.use(cookieParser())
const jsonBodyMiddleware = express.json()
app.use(jsonBodyMiddleware)






app.use(RouterPaths.blogs, blogsRouter) 

app.use(RouterPaths.posts, postsRouter)

app.use(RouterPaths.testing, testingRouter)
app.use(RouterPaths.users, usersRouter)
app.use(RouterPaths.auth, authRouter)
app.use(RouterPaths.comments, commentRouter)
app.use(RouterPaths.email, emailRouter)
app.use(RouterPaths.device, deviceRouter)
