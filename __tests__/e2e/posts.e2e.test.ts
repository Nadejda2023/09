import request  from "supertest"
import { app } from "../../src/setting";
import { authorizationValidation } from "../../src/middlewares/inputvalidationmiddleware";
import { sendStatus } from "../../src/routers/sendStatus";
import { PostViewModel } from "../../src/models/postsModel";
import { BlogsViewModel } from "../../src/models/blogsModel";
import { randomUUID } from 'crypto';


const getRequest = () => {
    return request(app)
}
describe('tests for /posts', () => {
    beforeAll(async () => {
        await getRequest()
        .delete('/all-data')
        .set('Authorization', 'Basic YWRtaW46cXdlcnR5')
    })
      
    beforeAll(async () => {
        authorizationValidation 
    })
    
    it("should return 200 and post", async () => {
        await getRequest()
                .get('/blogs')
                .expect(sendStatus.OK_200)
    })
    
    it ("should return 404 for not existing post", async () => {
        await getRequest()
                .get('/posts/9999999')
                .expect(sendStatus.NOT_FOUND_404)
    })

    it ("shouldn't create a new post with incorrect input data", async () => {
        const data: PostViewModel = {
            id: '',
            title: '',
            shortDescription: '',
            content: '',
            blogId: '',
            blogName: '',
            createdAt: ''
        }
        await getRequest()
                .post('/posts')
                .send(data)
                .expect(sendStatus.UNAUTHORIZED_401)
    })

    it ("should create a new post with correct input data", async () => {
        const blog: BlogsViewModel = {
            id: randomUUID(),
            name: 'Ananasia',
            description: 'blablabla1',
            websiteUrl: 'it-incubator.com',
            createdAt: new Date().toISOString(),
            isMembership: false
        }
        const createResponse = await getRequest()
                .post('/blogs')
                .auth('admin', 'qwerty')
                .send(blog)           
                .expect(sendStatus.CREATED_201)
        
        const data: PostViewModel = {
            id: '34456',
            title: 'new blog',
            shortDescription: 'blabla',
            content: 'i love you',
            blogId: createResponse.body.id,
            blogName: 'Ananasia',
            createdAt: '30.06.14', 
        }
         await getRequest()
                .post('/posts')
                .auth('admin', 'qwerty')
                .send(data)
                .expect(sendStatus.CREATED_201)
    })

    it ("shouldn't get all posts for specific blog if blog invalid", async () => {  
        await getRequest()
                .get('/blogs/999999909090909090909090/posts')
                .expect(sendStatus.NOT_FOUND_404)
    })

    

    it ("should create a post for specific blog" , async () => { 

    })
     
    it ("should delete a posts for blogId", async () => {

    })

    it ("should delete all posts",async () => {

    })
})