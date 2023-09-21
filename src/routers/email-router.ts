import { Request, Response, Router } from "express";
import { emailAdapter } from "../adapters/email-adapter";
import { bussinessService } from "../domain/business-service";


export const emailRouter = Router({})

/*emailRouter.post('/send', async ( req: Request, res: Response) => {

   await bussinessService.doOperation()
   res.sendStatus(200)
    
})*/