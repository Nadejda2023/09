import {Request, Response, Router} from 'express'
import { usersService } from '../domain/users-service'
import { jwtService } from '../_application/jwt-service'
import { authMiddleware } from '../middlewares/auth-middleware'
import { authService } from '../domain/auth-service'
import { UsersInputValidation, emailConfiResValidation, registrationComfiValidation } from '../middlewares/usersvalidation'
import { deviceCollection, usersCollection } from '../db/db'
import { usersQueryRepository } from '../repositories/usersQuery_Repository'
import { randomUUID } from 'crypto'
import { customRateLimit } from '../middlewares/middleware_rateLimit'
import { DeviceDbModel, DeviceViewModel } from '../models/deviceModel'
import { ObjectId } from 'mongodb'
import { deviceQueryRepository } from '../repositories/deviceQueryRepository'


export const authRouter = Router({})

authRouter.post('/login',
//customRateLimit,
async ( req: Request, res: Response) => {
    const user = await usersService.checkCredentials(req.body.loginOrEmail, req.body.password)
    if (user) {
        const deviceId = randomUUID()
        const userId = user.id
        const accessToken = await jwtService.createJWT(user)
        const refreshToken = await jwtService.createJWTRT(userId, deviceId)
        const lastActiveDate = await jwtService.getLastActiveDate(refreshToken)
        const newDevice: DeviceDbModel =  {
            _id: new ObjectId(),
            ip: req.ip,
            title: req.headers['user-agent'] || 'title',
            lastActiveDate,
            deviceId,
            userId
        }
        await deviceCollection.insertOne(newDevice)
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: true
          });
          console.log(refreshToken)
        res.status(200).json({accessToken})  
    } else {
        res.sendStatus(401) 
    }

})

authRouter.get('/me', 
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
   //todo update tokens and device
    try {
        const refreshToken = req.cookies.refreshToken;
    
        if (!refreshToken) {
          return res.status(401).json({ message: 'no rt in cookie' });
        }
    //check token and get payload
        const isValid = await authService.validateRefreshToken(refreshToken);
    
        if (!isValid) {
          return res.status(401).json({ message: 'rt secretinvalid or rt expired' });
        }
        //check user
        const user = await usersQueryRepository.findUserById(isValid.userId);
        if (!user) {
           return res.status(401).json({ message: 'no user' });
          }

        const device = await deviceCollection.findOne({deviceId: isValid.deviceId})

        if(!device){
            return res.status(401).json({ message: 'no device' });
            }

          const lastActiveDate = await jwtService.getLastActiveDate(refreshToken)
          if (lastActiveDate !== device.lastActiveDate) {
            return res.status(401).json({ message: 'Invalid refresh token version' });

          }
        
        const newTokens = await authService.refreshTokens(user.id, device.deviceId); 
        const newLastActiveDate = await jwtService.getLastActiveDate(newTokens.newRefreshToken)
        await deviceCollection.updateOne({ deviceId: device.deviceId },{ $set: {lastActiveDate: newLastActiveDate}})
         


    
        res.cookie('refreshToken', newTokens.newRefreshToken, {
          httpOnly: true,
          secure: true, 
           
        });
        res.status(200).json({ accessToken: newTokens.accessToken });
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: '' });
      }
    });

 // from 07
 authRouter.post('/registration',
 customRateLimit,
 UsersInputValidation, 
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
 //customRateLimit,
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
 //customRateLimit,
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

        const device = await deviceCollection.findOne({deviceId: isValid.deviceId})
        if(!device){
            return res.status(401).json({ message: 'Invalid refresh token' });
            }

          const lastActiveDate = await jwtService.getLastActiveDate(refreshToken)
          if (lastActiveDate !== device.lastActiveDate) {
            return res.status(401).json({ message: 'Invalid refresh token' });

          }
          
          await deviceQueryRepository.deleteDeviceId(isValid.deviceId)

        
            // Удаляем refreshToken из куки клиента
            res.clearCookie('refreshToken', { httpOnly: true, secure: true });
        
            res.sendStatus(204);
          } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Server error' });
          }
        });