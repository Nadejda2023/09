import request from 'supertest'
import { authorizationValidation } from '../../src/middlewares/inputvalidationmiddleware'
import { RouterPaths, app } from '../../src/setting'
import { BlogsInputViewModel, BlogsViewModel } from '../../src/models/blogsModel'
import { sendStatus } from '../../src/routers/sendStatus'
import { blogsCollection } from '../../src/db/db'
import { createBlog } from './blogs-tests-h'



const getRequest = () => {
    return request(app)
}
describe('tests for /blogs', () => {
    beforeAll(async () => {
        await getRequest()
        .delete('/testing/all-data')
    })
      
    beforeAll(async () => {
        authorizationValidation 
    })
      let blogs:any;


    it("should return 200 and blog", async () => {
        blogs = await getRequest()
                .get(RouterPaths.blogs)
                .expect(sendStatus.OK_200)
    })
    
    it ("should return 404 for not existing blog", async () => {
        await getRequest()
                .get(`${RouterPaths.blogs}/999999909090909090909090`)
                .expect(sendStatus.NOT_FOUND_404)
    })

    let blogId: BlogsViewModel
    it ("should get all posts fo specific blog", async () => { 
        const firstBlogId = blogs.body.items[0]    // been .id
        const posts = await getRequest()
           .get(`${RouterPaths.posts}/${firstBlogId}/posts`)
           .expect(sendStatus.OK_200)

        expect(posts.body).toEqual({
            totalCount:0,
            page: 1,
            pageSize: 10,
            pagesCount:0,
            items: expect.any(Array)

        })
        expect(posts.body.items.length).toBe(0)
   })

    it ("shouldn't create a new blog without auth", async () => {
        await getRequest().post(RouterPaths.blogs).send({}).expect(sendStatus.UNAUTHORIZED_401)

        await getRequest().post(RouterPaths.blogs).auth('login', 'password').send({}).expect(sendStatus.UNAUTHORIZED_401)  
    })

    it ("shouldn't create a new blog with incorrect input data", async () => {
        const data: BlogsViewModel = {
            id: '',
            name: '',
            description: '',
            websiteUrl: '',
            createdAt: '',
            isMembership: false
        }
        await getRequest()
                .post(RouterPaths.blogs)
                .send(data)
                .expect(sendStatus.UNAUTHORIZED_401)
        
        await getRequest()
                .get(RouterPaths.blogs)
                .expect(sendStatus.OK_200)
    })

    let createdBlog1: BlogsViewModel

    it ("should create a new blog with correct input data", async () => {
        const countOfBlogsBefore = await blogsCollection.countDocuments()
        expect(countOfBlogsBefore).toBe(0)
        const inputModel: BlogsInputViewModel = {
            name: 'new blog',
            description: 'blabla',
            websiteUrl: 'www.youtube.com',
        }

        const createResponse = await createBlog(inputModel)

        expect(createResponse.status).toBe(sendStatus.CREATED_201)

        const createdBlog: BlogsViewModel = createResponse.body
        expect(createdBlog).toEqual({
            id: expect.any(String),
            name: inputModel.name,
            description: inputModel.description,
            websiteUrl: inputModel.websiteUrl,
            isMembership: false,
            createdAt: expect.any(String),
        })
            
        const countOfBlogsAfter = await blogsCollection.countDocuments()
        expect(countOfBlogsAfter).toBe(1)
    
        
        const getByIdRes = await getRequest().get(`${RouterPaths.blogs}/${createdBlog.id}`)
            
        expect(getByIdRes.status).toBe(sendStatus.OK_200)
        expect(getByIdRes.body).toEqual(createdBlog)
        
        

        createdBlog1 = createdBlog
        expect.setState({ blog1: createdBlog})
    })
    //let createdBlog2: BlogViewModel
    it ("should create one more blog with correct input data", async () => {
        const inputModel: BlogsInputViewModel = {
            name: 'new blog',
            description: 'blabla',
            websiteUrl: 'www.youtube.com',
        }

        const createResponse = await createBlog(inputModel)

        expect.setState({ blog2: createResponse.body})
    })

    it ("shouldn't update a new blog with incorrect input data", async () => {
        const {blog1} = expect.getState()

        const emptyData: BlogsInputViewModel = {
            name: '',
            description: '',
            websiteUrl: '',
        }

        const errors = {
            errorsMessages: expect.arrayContaining([
                {message: expect.any(String), field: 'name'},
                {message: expect.any(String), field: 'description'},
                {message: expect.any(String), field: 'websiteUrl'},
        ])}

        const updateRes1 = await getRequest()
                .put(`${RouterPaths.blogs}/${blog1}`)   // be blog1.id
                .auth('admin', 'qwerty')
                .send({})

        expect(updateRes1.status).toBe(sendStatus.BAD_REQUEST_400)
        expect(updateRes1.body).toStrictEqual(errors)


        const updateRes2 = await getRequest()
                .put(`${RouterPaths.blogs}/${blog1}`)    // be blog1.id
                .auth('admin', 'qwerty')
                .send(emptyData)

        expect(updateRes2.status).toBe(sendStatus.BAD_REQUEST_400)
        expect(updateRes2.body).toStrictEqual(errors)

    })

    it ("shouldn't update blog that not exist", async () => {
        const data: BlogsViewModel = {
            id: '34456',
            name: 'new blog',
            description: 'blabla',
            websiteUrl: 'www.youtube.com',
            createdAt: '30.06.2014',
            isMembership: false
        }
        await getRequest()
                .put(`${RouterPaths.blogs}/${-234}`)
                .auth('admin', 'qwerty')
                .send(data)
                .expect(sendStatus.NOT_FOUND_404)
    })
        
    it ("should update a new blog with correct input data", async () => {
        const {blog1} = expect.getState()

        const inputModel: BlogsInputViewModel = {
            name: 'updated blog',
            description: 'upd description',
            websiteUrl: 'updwww.youtube.com',
        }

        await getRequest()
                .put(`${RouterPaths.blogs}/${blog1.id}`)  //be blog1.id
                .auth('admin', 'qwerty')
                .send(inputModel)
                .expect(sendStatus.NO_CONTENT_204)

        const updatedBlog = await getRequest().get(`${RouterPaths.blogs}/${blog1.id}`)
                
        
        expect(updatedBlog.status).toBe(sendStatus.OK_200)
        expect(updatedBlog.body).not.toBe(blog1)
        expect(updatedBlog.body).toEqual({
            id: blog1.id,
            name: inputModel.name,
            description: inputModel.description,
            websiteUrl: inputModel.websiteUrl,
            isMembership: blog1.isMembership,
            createdAt: blog1.createdAt,
        })
    })

    it ("should delete both blogs", async () => {
        const {blog1, blog2} = expect.getState()

        await getRequest()
                .delete(`${RouterPaths.blogs}/${blog1.id}`)   // be blog1.id
                .auth('admin', 'qwerty')
                .expect(sendStatus.NO_CONTENT_204)

        await getRequest()
                .get(`${RouterPaths.blogs}/${blog1.id}`)
                .expect(sendStatus.NOT_FOUND_404)

        await getRequest()
                .delete(`${RouterPaths.blogs}/${blog2.id}`)
                .auth('admin', 'qwerty')
                .expect(sendStatus.NO_CONTENT_204)
        
        await getRequest()
                .get(`${RouterPaths.blogs}/${blog2.id}`)
                .expect(sendStatus.NOT_FOUND_404)

        await getRequest()
                .get(RouterPaths.blogs)
                .expect(sendStatus.OK_200)

                expect(blogs.body).toEqual({
                    totalCount:0,
                    page: 1,
                    pageSize: 10,
                    pagesCount:0,
                    items: expect.any(Array)   
    })
    expect(blogs.body.items.length).toBe(0)
})
})    
    

        

    
     
        
   

