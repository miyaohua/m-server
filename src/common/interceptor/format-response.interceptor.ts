import { CallHandler, ExecutionContext, HttpStatus, Injectable, Logger, NestInterceptor } from "@nestjs/common";
import { map, Observable } from "rxjs";
import { BeCurrent } from "../model/beCurrent-response";

@Injectable()
export class FormatResponseInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(map((data) => {
      return new BeCurrent(HttpStatus.OK, "success", data || null);
    }));
  }
}
