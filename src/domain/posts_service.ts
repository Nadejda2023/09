import { randomUUID } from "crypto"
import { blogsCollection, db, postsCollection } from "../db/db"
import { BlogsViewModel } from "../models/blogsModel"
import { PostViewDBModel, PostViewModel } from "../models/postsModel"
import { postsRepository } from "../repositories/posts_db__repository"
import { blogsRepository } from "../repositories/blogs_db__repository"
//import { blogsRepository } from "./blogs-in-memory-repository"
 
/*type postsType = {
    id: string,
      title: string,
      shortDescription: string,
      content: string,
      blogId: string,
      blogName: string
}*/

 //export type postsArrayType = Array<postsType>
 //let postsArray: postsArrayType = []

 export const postsService = {
    async findAllPosts(): Promise<PostViewDBModel[]> { 
        return postsRepository.findAllPosts()
         
        },
        async findPostById(id: string): Promise<PostViewModel | null> {
            return postsRepository.findPostById(id)
            
        
            
        },
 
    async createPost(title: string, shortDescription: string, content: string, blogId: string): Promise<PostViewDBModel | null> {
        const blog = await blogsRepository.findBlogById(blogId)
        if(!blog) return null 
        const newPost: PostViewModel   = {
            id: randomUUID(),
            title: title,
            shortDescription: shortDescription,
            content: content,
            blogId: blogId,
            blogName: blog.name,
            createdAt: new Date().toISOString()
        }
        
        //return await postsCollection.findOne({newObjectId: newPost.id},{projection:{_id:0}})
        
       
        //const result = await postsRepository.createPost({...newPost})
        const newPostWithId =  await postsRepository.createPost(newPost)
        return newPostWithId 
    },
    async updatePost(id: string, title: string, shortDescription: string, content: string, blogId: string) : Promise<boolean | undefined> {
        let foundPost = await postsRepository.findPostById(id)
        let foundBlogName = await blogsRepository.findBlogById(blogId)
        return await postsRepository.updatePost(id, title, shortDescription, content, blogId)
          

            
        
    
    },
    async deletePost(id: string): Promise<boolean> {
        return await postsRepository.deletePost(id)
    },
    async deleteAllPosts(): Promise<boolean> {
       return await postsRepository.deleteAllPosts()  
    }
 }
