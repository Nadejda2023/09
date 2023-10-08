import { deviceCollection } from "../db/db"
import { DeviceDbModel } from "../models/deviceModel";



export const deviceQueryRepository = {
    async findDeviceById(deviceId: string): Promise<DeviceDbModel | null> {
        try {
          const device = await deviceCollection.findOne({ deviceId });
          return device;
        } catch (error) {
          console.error('Error finding device by ID:', error);
          return null;
        }
      },
      /*async getDeviceByUserId(userId: string): Promise<DeviceDbModel[] | null> {
        try {
          const devices = await deviceCollection.find({ userId }).toArray();
          return devices;
        } catch (error) {
          console.error('Error getting devices by user ID:', error);
          return null;
        }
      }, */
      async deleteAllExceptOne(userId: string, deviceId: string): Promise<boolean> {
        try {
          await deviceCollection.deleteMany({ userId, deviceId: { $ne: deviceId } });
      
          return true
        } catch (error) {
          throw new Error('Failed to refresh tokens');
        }
      },
      async  getDeviceByUserId(userId: string, deviceId: string): Promise<DeviceDbModel | null> {
        try {
          const device = await deviceCollection.findOne({ userId, deviceId });
          return device
        } catch (error) {
          console.error('Error getting device by user ID:', error);
          return null
        }
      },
      async deleteDeviceId(deviceId: string): Promise<boolean> {
        try {
          const result = await deviceCollection.deleteOne({ deviceId });
      
          if (result.deletedCount === 1) {
            return true
          } else {
            return false
          }
        } catch (error) {
          console.error('Error deleting device by ID:', error);
          return false
        }
      }
}