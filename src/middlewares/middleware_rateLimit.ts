import { Request, Response, NextFunction } from 'express';
import { rateLimitCollection } from "../db/db";

const maxRequests = 5;
const interval = 10 * 1000;


// Rate limit middleware
export async function customRateLimit(req: Request, res: Response, next: NextFunction) {
    const ip = req.ip;
    const url = req.baseUrl || req.originalUrl;
    const date = new Date()

  try {
   
    const count = await rateLimitCollection.countDocuments({
      IP: ip,
      URL,
      date: { $gte: new Date(+date - interval) },
    });

    if (count + 1 > maxRequests) {
      return res.sendStatus(429)
    }

    await rateLimitCollection.insertOne({ IP: ip, URL: url, date: date });

    next();
  } catch (err) {
    console.error(err);
  }
}



