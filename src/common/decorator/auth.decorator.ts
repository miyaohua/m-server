import { createParamDecorator, ExecutionContext, SetMetadata } from '@nestjs/common';
// import { Request } from "express";

// 登录鉴权
export const requireLogin = () => SetMetadata('require-login', true)

// 用户权限鉴权
export const requirePermission = (...permissions: string[]) => SetMetadata('require-permission', permissions)


// 获取用户信息
export const UserInfo = createParamDecorator(
    (data: string, ctx: ExecutionContext) => {
        const request: any = ctx.switchToHttp().getRequest<Request>();
        if (!request.userInfo) {
            return null;
        }
        return data ? request.userInfo[data] : request.userInfo;
    },
)