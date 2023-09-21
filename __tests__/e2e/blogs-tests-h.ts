import  request  from 'supertest';
import { app } from '../../src/setting';
import { BlogsInputViewModel } from '../../src/models/blogsModel';



export const createBlog = (data: BlogsInputViewModel) => {
    return request(app)
            .post('/blogs')
            .auth('admin', 'qwerty')
            .send(data)
}