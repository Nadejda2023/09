
import { ObjectId } from "mongodb";
import { blogsCollection, db } from "../db/db";
import {  BlogsViewDBModel, BlogsViewModel, PaginatedBlog, } from "../models/blogsModel";
import { randomUUID } from "crypto";
import { body } from "express-validator/src/middlewares/validation-chain-builders";



//const dbBlogs =  client.db("project")


export const blogsRepository = {
   async findAllBlogs(title: string | null | undefined): Promise<BlogsViewDBModel[]> { 

    const filter: any = {}

    if (title) {
        filter.title = {$regex: title}
    }
    return blogsCollection.find((filter), {projection:{_id:0}}).toArray()
     
    },

   async findBlogById(id: string): Promise<BlogsViewModel | null> {
        return blogsCollection.findOne({id: id}, {projection:{_id:0}}) 

    },
    
    async createBlog(newBlog: BlogsViewModel): Promise<BlogsViewDBModel| null > {
        await blogsCollection.insertOne({...newBlog})
        const newBlogId = await blogsCollection.findOne({id:newBlog.id}, {projection:{_id:0}} )
        return newBlogId
    }, 


    async updateBlog(id: string, name: string, description: string, website: string): Promise< boolean | undefined> {
        
           
        const result = await blogsCollection.updateOne({id: id},{ $set:{name: name, description: description, websiteUrl: website}})
        return result.matchedCount === 1
        
    
    },

    async deleteBlog(id: string) {
        //const filter = {_id:id}
         const result = blogsCollection.deleteOne({id:id})

         return (await result).deletedCount === 1
        
    },

    async deleteAllBlogs(): Promise<boolean> {
        const result = await blogsCollection.deleteMany({})
        try { await blogsCollection.deleteMany({})
            return result.acknowledged
        }catch(e){
                return false
            }
        
    } 
} 