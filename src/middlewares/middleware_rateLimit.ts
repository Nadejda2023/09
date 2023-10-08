import { Request, Response, NextFunction } from 'express';
import { rateLimitCollection } from "../db/db";
import { rateLimitDBModel } from '../models/rateLimitModels';

const maxRequests = 5;
const interval = 10 * 1000;
const connections: rateLimitDBModel[] = []

// Rate limit middleware
export async function customRateLimit(req: Request, res: Response, next: NextFunction) {
    const IP = req.ip;
    const URL = req.baseUrl || req.originalUrl;
    const date = new Date()

  try {
   
    const count = connections.filter(c => c.IP === IP && c.URL === URL && date >= new Date(+date - interval)).length;// =

    if (count > maxRequests) { //>
      return res.sendStatus(429)
    }

    connections.push({ IP: IP, URL: URL, date: date });

    next();
  } catch (err) {
    console.error(err);
  }
}

 /*export async function customRateLimit(req: Request, res: Response, next: NextFunction) {
   const IP = req.ip;
   const URL = req.baseUrl || req.originalUrl;
   const date = new Date()

 try {
 
   const count = await rateLimitCollection.countDocuments({
     IP: IP,
     URL: URL,
     date: { $gte: new Date(+date - interval) },
   });

   if (count + 1 > maxRequests) {
     return res.sendStatus(429)
  }

   await rateLimitCollection.insertOne({ IP: IP, URL: URL, date: date });

   next();
 } catch (err) {
   console.error(err);
 } 
 } */





