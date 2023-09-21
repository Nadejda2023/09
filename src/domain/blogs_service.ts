
import { blogsCollection, db } from "../db/db";
import {  BlogsViewDBModel, BlogsViewModel, PaginatedBlog, } from "../models/blogsModel";
import { randomUUID } from "crypto";
import { blogsRepository } from "../repositories/blogs_db__repository";


//const dbBlogs =  client.db("project")


export const blogsService = {
   async findAllBlogs(title: string | null | undefined): Promise<BlogsViewDBModel[]> { 
    return blogsRepository.findAllBlogs(title)
     
    },

   async findBlogById(id: string): Promise<BlogsViewModel | null> {
        return blogsRepository.findBlogById(id) ////что делать с айдишкой

    },
    
    async createBlog(name: string, description: string, website: string): Promise<BlogsViewDBModel| null > {
        const newBlog: BlogsViewModel = {
            id: randomUUID(),   
            name: name,
            description: description,
            websiteUrl: website,
            createdAt: (new Date()).toISOString(),
            isMembership: false,
            
        }
        //await blogsRepository.createBlog({...newBlog})
        const newBlogId = await blogsRepository.createBlog(newBlog)
        return newBlogId
    }, 

    async updateBlog(id: string, name: string, description: string, website: string): Promise< boolean | undefined> {
         return await blogsRepository.updateBlog(id, name, description, website)
       
        
    
    },

    async deleteBlog(id: string) {
        return await blogsRepository.deleteBlog(id)
       
        
    },

    async deleteAllBlogs(): Promise<boolean> {
        return await blogsRepository.deleteAllBlogs()
        
    } 
} 