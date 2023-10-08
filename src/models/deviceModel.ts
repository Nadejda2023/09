import { ObjectId } from "mongodb"

export type DeviceDbModel =
{
    _id: ObjectId
    ip : string,
    title : string,
    lastActiveDate:string,
    deviceId : string,
    userId: string
}

export type DeviceViewModel =
{
    ip : string,
    title : string,
    lastActiveDate:string,
    deviceId : string
}
