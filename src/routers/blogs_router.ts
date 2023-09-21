import {Request, Response, Router } from "express";



import { CreateBlogValidation , UpdateBlogValidation } from "../middlewares/blogsvalidation";
import { BlogsViewDBModel, BlogsViewModel, PaginatedBlog } from "../models/blogsModel";
import { blogsService } from "../domain/blogs_service";
import { sendStatus } from "./sendStatus";
import { authorizationValidation, inputValidationErrors } from "../middlewares/inputvalidationmiddleware";
import { blogsQueryRepository } from "../repositories/queryRepo";
import { blogsRepository } from "../repositories/blogs_db__repository";
import { PaginatedPost, PostViewModel } from "../models/postsModel";
import { createPostValidation, createPostValidationForBlogRouter } from "../middlewares/postsvalidation";
import { getPaginationFromQuery, getSearchNameTermFromQuery} from "../hellpers/pagination";


export const blogsRouter = Router({})
//1
blogsRouter.get('/', async (req: Request, res: Response) : Promise<void> => {
  const pagination = getPaginationFromQuery(req.query)
  const name = getSearchNameTermFromQuery(req.query.searchNameTerm as string)
    const foundBlogs:PaginatedBlog<BlogsViewModel> = await blogsQueryRepository.findBlogs({...pagination, ...name})
    
    res.status(sendStatus.OK_200).send(foundBlogs)
  })
  

blogsRouter.post('/',
  authorizationValidation,
  ...CreateBlogValidation,
  async (req: Request , res: Response<BlogsViewDBModel | null >)  => {
    const { name, description, websiteUrl} = req.body
  const newBlog : BlogsViewDBModel| null  = await blogsService.createBlog(name, description, websiteUrl)
  console.log(newBlog);
  
  return res.status(sendStatus.CREATED_201).send(newBlog)
  
})
  
//2
blogsRouter.get('/:blogId/posts', async (req: Request, res: Response) => { /// jn async and for end function create new middleware
  //const pagination = getPaginationFromQuery(req.query)
  const blogPost:BlogsViewModel | null = await blogsRepository.findBlogById(req.params.blogId)
if(!blogPost) {
  return res.sendStatus(404)
  
 }
 
 const pagination = getPaginationFromQuery(req.query)
 
  const BlogsFindPosts: PaginatedPost<PostViewModel> = 
  await blogsQueryRepository.findPostForBlog(req.params.blogId, pagination)
  
    return res.status(200).send(BlogsFindPosts)
    
   
})

//3
blogsRouter.post('/:blogId/posts',authorizationValidation, createPostValidationForBlogRouter, async (req: Request, res: Response) => { /// jn async and for end function create new middleware
  const blogWithId: BlogsViewModel| null = await blogsRepository.findBlogById(req.params.blogId) 
  if(!blogWithId) {
    return res.sendStatus(404)
   
  }
  
    const blogsCreatePost: PostViewModel | null = await blogsQueryRepository.createPostForBlog(req.body.title, req.body.shortDescription, req.body.content, req.params.blogId)
    if(blogsCreatePost) {
      return res.status(201).send(blogsCreatePost)
      
     }
  })

  blogsRouter.get('/:id', async (req: Request, res: Response<BlogsViewModel| null>) => {
    const foundBlog: BlogsViewModel | null = await blogsService.findBlogById(req.params.id)
    if (foundBlog) {
      return res.status(sendStatus.OK_200).send(foundBlog)
    } else {
      return res.sendStatus(sendStatus.NOT_FOUND_404)
    }
})
  
blogsRouter.put('/:id',
  authorizationValidation,
  ...UpdateBlogValidation,
  async (req: Request , res: Response <boolean | undefined>) => {
    const id = req.params.id
    const { name, description, websiteUrl} = req.body

    const updateBlog = await blogsService.updateBlog(id, name, description, websiteUrl)
    if (updateBlog) {
      return res.sendStatus(sendStatus.NO_CONTENT_204)
      
    } else {
      return res.sendStatus(sendStatus.NOT_FOUND_404)
    }
})
  
blogsRouter.delete('/:id', 
  authorizationValidation,
  //inputValidationErrors, 
  async (req: Request, res: Response) => {
  const foundBlog = await blogsService.deleteBlog(req.params.id);
  if (!foundBlog) {
    return  res.sendStatus(sendStatus.NOT_FOUND_404)
  } else {
  return res.sendStatus(sendStatus.NO_CONTENT_204)
  }
}) 