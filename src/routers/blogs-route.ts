import {Request, Response, Router} from "express";
import {authentication, blogBodyValidation, inputValidationMiddleware} from "../midlewares/input-validation-middleware";
import {
    BlogInputModel,
    BlogViewModel,
    RequestWithBody,
    RequestWithParams,
    RequestWithParamsBody
} from "../library/types";
import {blogsRepository} from "../repositories/blogs-repository";

export const blogs: BlogViewModel[] = [
    {
        id: "1",
        name: "string",
        description: "string",
        websiteUrl: "string"
    }
]
export const blogsRoute = Router({})

blogsRoute.get('/', (req: Request, res: Response) => {
    res.send(blogs)
})
blogsRoute.get('/:id', (req: RequestWithParams<{ id: string }>, res: Response) => {
    const blog = blogsRepository.getBlogById(req.params.id)
    if (blog) {
        res.status(200).send(blog)
    } else {
        res.sendStatus(404)
    }
})
blogsRoute.delete('/:id', authentication, (req: RequestWithParams<{ id: string }>, res: Response) => {
    const isBlogDeleted = blogsRepository.deleteBlog(req.params.id)
    if (isBlogDeleted) {
        res.sendStatus(204)
    } else {
        res.sendStatus(404)
    }
})
blogsRoute.post('/',
    authentication,
    blogBodyValidation,
    inputValidationMiddleware, (req: RequestWithBody<BlogInputModel>, res: Response) => {
        const newBlog = blogsRepository.creatBlog(req.body)
        res.status(201).send(newBlog)
    })
blogsRoute.put('/:id',
    authentication,
    blogBodyValidation,
    inputValidationMiddleware, (req: RequestWithParamsBody<{ id: string }, BlogInputModel>, res: Response) => {
        const isBlogUpdated = blogsRepository.updateBlog(req.params.id, req.body)
        if (isBlogUpdated) {
            res.sendStatus(204)
        } else {
            res.sendStatus(404)
        }
    })