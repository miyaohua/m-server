import { Injectable, NestMiddleware } from "@nestjs/common";
import { Request, Response, NextFunction } from "express";

@Injectable()
export class resetTokenMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    // console.log(req);
    // console.log("Request...");
    next(); // 将控制权传递给下一个中间件或处理器
  }
}