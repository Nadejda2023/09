import { Request, Response, Router,  } from "express"
import { blogsRepository } from "../repositories/blogs_db__repository";
import { postsRepository} from "../repositories/posts_db__repository";
import { usersTwoRepository } from "../repositories/usersRepository";
import { commentQueryRepository } from "../repositories/commentQueryRepository";
import { authQueryRepository } from "../repositories/authQueryRepositorii";


export const testingRouter = Router()

testingRouter.delete('/all-data',
async (req: Request, res: Response) => {
    await  Promise.all([
      blogsRepository.deleteAllBlogs(),
      postsRepository.deleteAllPosts(),
      usersTwoRepository.deleteAllUsers(),
      commentQueryRepository.deleteAllComment()])
    
    //await authQueryRepository.deleteAllAuth()
   return res.status(204).send('All data is deleted')
})
/*export const testingRouter = Router()

  testingRouter.delete('/all-data', async (req: Request, res: Response) => {
  await Promise.all([blogsRepository.deleteAllBlogs(),
    postsRepository.deleteAllPosts()]);
    res.status(204).send('All data is deleted')
})*/
