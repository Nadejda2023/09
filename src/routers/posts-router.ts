import {Request, Response, Router } from "express";
import { postsService } from "../domain/posts_service";
import { sendStatus } from "./sendStatus";
import { authorizationValidation} from "../middlewares/inputvalidationmiddleware";
import { createPostValidation} from "../middlewares/postsvalidation";
import { updatePostValidation } from "../middlewares/postsvalidation";
import { PaginatedPost, PostViewDBModel, PostViewInputModel, PostViewModel } from "../models/postsModel";
import { blogsRepository } from "../repositories/blogs_db__repository";
import { blogsQueryRepository } from "../repositories/queryRepo";
import { getPaginationFromQuery } from "../hellpers/pagination";
import { postsRepository } from "../repositories/posts_db__repository";
import { PaginatedCommentViewModel, commentDBViewModel, commentViewModel } from "../models/commentModels";
import { commentQueryRepository } from "../repositories/commentQueryRepository";
import { postsQueryRepository } from "../repositories/postsQueryRepository";
import { authMiddleware } from "../middlewares/auth-middleware";
import { createPostValidationC } from "../middlewares/commentInputValidation";

export const postsRouter = Router({})

//1
postsRouter.get('/:postId/comments', async (req: Request, res: Response) => { 
  //const pagination = getPaginationFromQuery(req.query)
  const foundedPostId = await postsRepository.findPostById(req.params.postId)
if(!foundedPostId) {
  return res.sendStatus(404)
  
 }
 
 const pagination = getPaginationFromQuery(req.query)
const allCommentsForPostId: PaginatedCommentViewModel<commentDBViewModel> =
await commentQueryRepository.getAllCommentsForPost(req.params.postId, pagination) //req.params.postId,
  
    return res.status(200).send(allCommentsForPostId)
    
   
})

postsRouter.post('/:postId/comments', authMiddleware, createPostValidationC, async (req: Request, res: Response) => { /// jn async and for end function create new middleware
    const postWithId: PostViewModel| null = await postsRepository.findPostById(req.params.postId);
    if(!postWithId) {
      return res.sendStatus(404)
    
    }
  
  const comment: commentDBViewModel | null = await postsQueryRepository
  .createPostComment(postWithId.id, req.body.content, {userId: req.user!.id, userLogin: req.user!.login})
  
      return res.status(201).send(comment)
      
     
  })

postsRouter.get('/', async (req: Request, res: Response<PaginatedPost<PostViewModel>>) => {
  const pagination = getPaginationFromQuery(req.query)
  const foundPost: PaginatedPost<PostViewModel> = await blogsQueryRepository.findAllPosts(pagination)
  if(!foundPost){
    return res.sendStatus(sendStatus.NOT_FOUND_404)
  } else {
    return res.status(sendStatus.OK_200).send(foundPost)
  }
  
  })

postsRouter.get('/:id', async (req: Request, res: Response<PostViewModel| undefined | null>) => {
  
  const foundPost = await postsService.findPostById(req.params.id)    //req.params.id ////blogId
    if (foundPost) {
      return res.status(sendStatus.OK_200).send(foundPost)
      
    } else {
      
      return res.sendStatus(sendStatus.NOT_FOUND_404)
  }
  })
  
postsRouter.post('/', 
  authorizationValidation,
  createPostValidation,
async (req: Request, res: Response<PostViewDBModel| undefined | null>) => {
  const findBlogById =  await blogsRepository.findBlogById(req.body.blogId)
  
  if (findBlogById) {
    const { title ,shortDescription, content, blogId} = req.body
  const newPost : PostViewDBModel | null= await postsService.createPost(title,shortDescription, content, blogId)
    if(!newPost) {
      
      return res.sendStatus(sendStatus.BAD_REQUEST_400 )
  } else {
    
    return res.status(sendStatus.CREATED_201).send(newPost)
  }
}

})
  

postsRouter.put('/:id', 
authorizationValidation,
updatePostValidation,

  async (req: Request , res: Response<boolean | undefined>) => {
    const id = req.params.id
    const { title, shortDescription, content, blogId} = req.body // НАДЯ!!!
    const updatePost = await postsService.updatePost(id, title, shortDescription, content, blogId)

  
    if (!updatePost) {
      return res.sendStatus(sendStatus.NOT_FOUND_404)
    } else {
      return res.sendStatus(sendStatus.NO_CONTENT_204)
    }
})
  
postsRouter.delete('/:id', 
authorizationValidation,
//inputValidationErrors,
async (req: Request, res: Response) => {
const foundPost = await postsService.deletePost(req.params.id)
if (!foundPost) {
  return res.sendStatus(sendStatus.NOT_FOUND_404);
  } 
 res.sendStatus(sendStatus.NO_CONTENT_204)
}
)
