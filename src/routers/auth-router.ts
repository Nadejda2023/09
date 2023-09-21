import {Request, Response, Router} from 'express'
import { usersService } from '../domain/users-service'
import { jwtService } from '../_application/jwt-service'
import { authMiddleware } from '../middlewares/auth-middleware'
import { authService } from '../domain/auth-service'
import { UsersInputValidation, emailConfiResValidation, loginOrEmailValidation, registrationComfiValidation } from '../middlewares/usersvalidation'
import { inputValidationErrors } from '../middlewares/inputvalidationmiddleware'
import { authCollection, usersCollection } from '../db/db'
import { usersQueryRepository } from '../repositories/usersQuery_Repository'


export const authRouter = Router({})

authRouter.post('/login',
//вернуть accessToken (10) in body and JWTrefreshToken cookie (only http) (20)

async ( req: Request, res: Response) => {
    const user = await usersService.checkCredentials(req.body.loginOrEmail, req.body.password)
    if (user) {
        const token = await jwtService.createJWT(user)
        const refreshToken = await jwtService.createJWTRT(user) 
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            //maxAge: 20000, 
            secure: true
          });
          console.log(refreshToken)
        res.status(200).json({accessToken: token})
        
    } else {
        res.sendStatus(401) 
    }

})
authRouter.get('/me', 
//to do
authMiddleware,

    async (req: Request, res: Response) => {
    if(!req.user){
        return res.sendStatus(401)
    } else {
    return res.status(200).send({
        email: req.user.email,
        login: req.user.login,
        userId: req.user.id
    }
    )
  }
 })
 authRouter.post('/refresh-token',
 async (req: Request, res: Response) => {
    try {
        const refreshToken = req.cookies.refreshToken;
    
        if (!refreshToken) {
          return res.status(401).json({ message: 'Refresh token not found' });
        }
    //check token and get payload
        const isValid = await authService.validateRefreshToken(refreshToken);
    
        if (!isValid) {
          return res.status(401).json({ message: 'Invalid refresh token' });
        }
        //check user
    const user = await usersQueryRepository.findUserById(isValid.userId);
    console.log(user)
    if(!user) return res.sendStatus(401);

//check is token in black list
const vtoken = await  usersQueryRepository.findTokenInBL(user.id, refreshToken);
         console.log(vtoken)
if(vtoken)return res.sendStatus(401); 

//create access and refreshTokens
const tokens = await authService.refreshTokens(user.id);

//add old refreshToken to black list
await usersCollection.updateOne({id: user.id}, { $push : { refreshTokenBlackList: refreshToken } });
    
        res.cookie('refreshToken', tokens.newRefreshToken, {
          httpOnly: true,
          secure: true, 
          //maxAge: 20000, 
        });
        res.status(200).json({ accessToken: tokens.accessToken });
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: '' });
      }
    });

 // from 07
 authRouter.post('/registration',
 UsersInputValidation, // ...
 async (req: Request, res: Response) => {
    
    const user = await usersService.createUser(req.body.login, req.body.email, req.body.password)
    //console.log('router:', user)
    if(user) {
    return res.sendStatus(204)
    } else {
        return res.status(400).send({
            errorsMessages: [
                {
                    message: "email already confirmed",
                    field: "email"
                }
            ]
        })   
    }
 })

 

 authRouter.post('/registration-confirmation',
 registrationComfiValidation,
 async (req: Request, res: Response) => {
     const result = await authService.confirmEmail(req.body.code)
     if(result) {
       return res.sendStatus(204)
     } else {
        return res.status(400).send({
            errorsMessages: [
                {
                    message: "test code",
                    field: "code"
                }
            ]
        })   
    }
 })


 authRouter.post('/registration-email-resending',
 //val
 emailConfiResValidation,
 async (req: Request, res: Response) => {
    const result = await authService.ressendingEmail(req.body.email)
    if(result) {
        return res.status(204).send(`	
        Input data is accepted. Email with confirmation code will be send to passed email address. Confirmation code should be inside link as query param, for example: https://some-front.com/confirm-registration?code=youtcodehere`)
        } else {
            return res.status(400).send({
                errorsMessages: [
                    {
                        message: "email already confirmed",
                        field: "email"
                    }
                ]
            })   
        }
    
    }) 

  

    authRouter.post('/logout',
    async (req: Request, res: Response) => {
        try {
            const refreshToken = req.cookies.refreshToken;
        
            if (!refreshToken) {
              return res.status(401).json({ message: 'Refresh token not found' });
            }
        //check token and get payload
            const isValid = await authService.validateRefreshToken(refreshToken);
        
            if (!isValid) {
              return res.status(401).json({ message: 'Invalid refresh token' });
            }
            //check user
        const user = await usersQueryRepository.findUserById(isValid.userId);
        if(!user) return res.sendStatus(401);
console.log('authRouter user:', user)

        //check is token in black list
        const vtoken = await  usersQueryRepository.findTokenInBL(user.id, refreshToken);
        console.log(vtoken)
if(vtoken)return res.sendStatus(401); 
    
    

    // Добавляем refreshToken в черный список (в MongoDB)
    await usersCollection.updateOne({id: user.id}, { $push : { refreshTokenBlackList: refreshToken } });
        
            // Удаляем refreshToken из куки клиента
            res.clearCookie('refreshToken', { httpOnly: true, secure: true });
        
            res.sendStatus(204);
          } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Server error' });
          }
        });