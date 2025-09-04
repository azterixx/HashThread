import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class UserIdMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const COOKIE_NAME = 'userId';


    let userId = req.cookies?.[COOKIE_NAME];
    if (!userId) {
      userId = uuidv4();
      res.cookie(COOKIE_NAME, userId, {
        httpOnly: true,
        secure: true,
        sameSite: 'none',
        maxAge: 1000 * 60 * 60 * 24 * 30,
      });
    }

    (req as any).userId = userId;

    next();
  }
}
