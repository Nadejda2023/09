import {Request, Response, Router } from "express";
import { DeviceDbModel, DeviceViewModel } from "../models/deviceModel";
import { deviceQueryRepository } from "../repositories/deviceQueryRepository";
import { jwtService } from "../_application/jwt-service";
import { authService } from "../domain/auth-service";

export const deviceRouter = Router({})

deviceRouter.get ('/devices',
async (req: Request, res: Response) => {
    const refreshToken = req.cookies.refreshToken;//{userId, deviceId}
    const IP = req.ip
    const URL = req.baseUrl || req.originalUrl;

    if (!refreshToken) {
        return res.status(401).json({ message: 'Refresh token not found' });
      }
  //check token and get payload
      const isValid = await authService.validateRefreshToken(refreshToken);//{userId, deviceId}
  
      if (!isValid || !isValid.userId || !isValid.deviceId) {
        return res.status(401).json({ message: 'Invalid refresh token' });
      }

        const user = await authService.findUserByID(isValid.userId)
//if(!user) -> 401
        if (!user) {
        return res.status(401).json({ message: 'User not found' });
        }

//const device = findDeviceById(deviceId)
        const device = await deviceQueryRepository.findDeviceById(isValid.deviceId);
//if(!device) -> 401
        if (!device) {
        return res.status(401).json({ message: 'Device not found' });
        }

//if (userId !== device.userId) -> 401
        if (isValid.userId !== device.userId) {
        return res.status(401).json({ message: 'Unauthorized access to device' });
        }


    const result = await deviceQueryRepository.getDeviceByUserId(isValid.userId, device.deviceId)
    console.log(result)
    if(result) {
        res.status(200).send(result)
    } else {
         res.sendStatus(401)
         }
})

//delete all devices exept current device
deviceRouter.delete ('/devices',
async (req: Request, res: Response) => {
    const refreshToken = req.cookies.refreshToken;
    const isValid = await authService.validateRefreshToken(refreshToken);
    if (!isValid || !isValid.userId || !isValid.deviceId) {
        return res.status(401).json({ message: 'Unauthorized ' });
        }

    const result = await deviceQueryRepository.deleteAllExceptOne(isValid.userId,isValid.deviceId) // delete({userId, $..: deviceId})
    if(result) {
        res.sendStatus(204)
    } else {
        res.sendStatus(500)  
    }
     
}) 
///1 token = 1 device

deviceRouter.delete ('/devices/:deviceId',
async (req: Request, res: Response) => {
    const refreshToken = req.cookies.refreshToken;
    const deviceId = req.cookies.deviceId;
    const isValid = await authService.validateRefreshToken(refreshToken);
    
      const user = await authService.findUserByID(isValid.userId);
    
      if (!user) {
        return res.status(401).json({ message: 'User not found' });
      }

    const deviceIdByUser = await deviceQueryRepository.getDeviceByUserId(isValid.userId, deviceId)
    if (!deviceIdByUser) {
        return res.sendStatus(403);
      }
    const resultDeviceId = await deviceQueryRepository.deleteDeviceId( deviceId)
    if(resultDeviceId) {
        res.sendStatus(204)  
    } else {
        res.sendStatus(204)  
    }
     
})
