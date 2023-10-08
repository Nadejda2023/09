import { ObjectId } from "mongodb";
import { UsersModel, UsersModelSw } from "../models/usersModel";
import jwt from 'jsonwebtoken'
import { accessTokenSecret1, refreshTokenSecret2, settings } from "../setting";
import { usersCollection } from "../db/db";
import { DeviceViewModel } from "../models/deviceModel";



export const jwtService = {
    async createJWT(user: UsersModel) {
        const token = jwt.sign({userId: user.id}, accessTokenSecret1, {expiresIn: '10sec'})
        return token
          },
    
    async createJWTRT(userId: string, deviceId: string) {
        const rtoken = jwt.sign({ userId, deviceId}, refreshTokenSecret2, { expiresIn: '20s' });
        return rtoken
    },
   // async getDeviceIdByRefreshToken(token: string): Promise<string> {
      //const result:any = jwt.decode(token);
      //return result.deviceId
 // },
  async getSessionAtByRefreshToken(token: string): Promise<string | null> {
    try {
      const result:any = jwt.verify(token, settings.JWT_SECRET)
      return (new Date ((result.iat)*1000)).toISOString()
    }
    catch (e) {
      return null
    }
},
async getLastActiveDate(token: string) {
  const result: any = jwt.decode(token)
  return new Date(result.iat * 1000).toISOString()
},

 

    async getUserIdByToken(token: string): Promise<string | null> {
        try {
            const result: any = jwt.verify(token, settings.JWT_SECRET)
            return result.userId;
        } catch (error) {
            console.log(error)
            return null
        
        }
    },
    async  isTokenInvalidated(token: string) {
        const result = await usersCollection.findOne({ token });
        return result;
      },
    async verifyRefreshToken(refreshToken: string, refreshTokenSecret: string) {
        return new Promise((resolve, reject) => {
          jwt.verify(refreshToken, refreshTokenSecret, (err, user) => {
            if (err) {
              reject('Invalid refresh token');
            } else {
              resolve(user);
            }
          });
        })
}
}