import { CanActivate, ExecutionContext, Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { Observable } from 'rxjs';

@Injectable()
export class LoginGuard implements CanActivate {
  @Inject()
  private readonly reflector: Reflector;

  @Inject(JwtService)
  private readonly jwtService: JwtService


  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    // 获取是否需要鉴权
    const requireLogin = this.reflector.getAllAndOverride('require-login', [
      context.getClass(),
      context.getHandler()
    ])
    const authorization = request.headers.authorization;
    // 没有则放行，公共接口（不需要登录）
    if (!requireLogin) {
      return true;
    }
    // 需要鉴权，切没有token
    if (!authorization) {
      throw new UnauthorizedException('用户未登录');
    }
    try {
      const token = authorization.split(' ')[1];
      const data = this.jwtService.verify(token);
      let { iat, exp, ...userInfo } = data;
      request.userInfo = userInfo
      return true
    } catch (error) {
      throw new UnauthorizedException('用户未登录');
    }
  }
}
