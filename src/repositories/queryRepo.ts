import { Collection, FindCursor, InsertOneResult, ObjectId, WithId } from "mongodb"
import { BlogsViewDBModel, BlogsViewModel, PaginatedBlog } from "../models/blogsModel"
import { blogsCollection, postsCollection } from "../db/db"
import { PaginatedPost, PostViewDBModel, PostViewModel } from "../models/postsModel"
import { title } from "process"
import { randomUUID } from "crypto"
import e from "express"
import { blogsRepository } from "./blogs_db__repository"
import { TPagination } from "../hellpers/pagination"



export const blogsQueryRepository = {
    //1
    async findBlogs(pagination: TPagination):
     Promise<PaginatedBlog<BlogsViewModel>> {
        const filter = {name: { $regex :pagination.searchNameTerm, $options: 'i'}}
        const result : WithId<WithId<BlogsViewModel>>[] = await blogsCollection.find(filter, {projection: {_id: 0}})
    
    .sort({[pagination.sortBy]: pagination.sortDirection})
    .skip(pagination.skip)
    .limit(pagination.pageSize)
    .toArray()
        const totalCount: number = await blogsCollection.countDocuments(filter)
        const pageCount: number = Math.ceil(totalCount / pagination.pageSize)


    return {
        pagesCount: pageCount,
        page: pagination.pageNumber,
        pageSize: pagination.pageSize,
        totalCount: totalCount,
        items: result
        }
    },



    async findPostForBlog(blogId: string,pagination: TPagination):
     Promise<PaginatedPost<PostViewModel>> {
        const result: WithId<WithId<PostViewModel>>[] = await postsCollection.find({blogId}, {projection: {_id: 0}})
    .sort({[pagination.sortBy]: pagination.sortDirection})
    .skip(pagination.skip)
    .limit(pagination.pageSize)
    .toArray() 

        
        const totalCount: number = await postsCollection.countDocuments({blogId})
        const pageCount: number = Math.ceil(totalCount / pagination.pageSize)


    const response: PaginatedPost<PostViewModel> = {
        pagesCount: pageCount,
        page: pagination.pageNumber,
        pageSize: pagination.pageSize,
        totalCount: totalCount,
        items: result
        }
        



        return  response//postsCollection.findOne({}, {projection:{_id:0}}) 

    },
    
   
    //createPostForBlog to do

async createPostForBlog(title: string, shortDescription: string, content: string,  blogId: string):
 Promise <PostViewModel | null> {
    
    const  blog = await blogsRepository.findBlogById(blogId)
    if(!blog) return null
    const createPostForBlog: PostViewModel= {
        id: randomUUID(),
        title: title,
        shortDescription: shortDescription,
        content: content,
        blogId: blog.id,
        blogName: blog.name,
        createdAt: new Date().toISOString()
        }

     await postsCollection.insertOne({...createPostForBlog})
    return createPostForBlog


},



    //1
    async findAllPosts(pagination: TPagination):
     Promise<PaginatedPost<PostViewModel>> {
        const result : WithId<WithId<PostViewModel>>[] = await postsCollection.find({}, {projection: {_id: 0}})
    .sort({[pagination.sortBy]: pagination.sortDirection })
    .skip(pagination.skip)
    .limit(pagination.pageSize)
    .toArray()


    

        const totalCount: number = await postsCollection.countDocuments({})
        const pageCount: number = Math.ceil(totalCount / pagination.pageSize)


    const response: PaginatedPost<PostViewModel> = {
        pagesCount: pageCount,
        page: pagination.pageNumber,
        pageSize: pagination.pageSize,
        totalCount: totalCount,
        items: result
        }
        return response
    }
    





}
