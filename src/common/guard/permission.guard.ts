import { CanActivate, ExecutionContext, Inject, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Observable } from "rxjs";
import { BussException } from "../exception/buss.exception";

@Injectable()
export class PermissionGuard implements CanActivate {
  @Inject()
  private readonly reflector: Reflector;

  canActivate(
    context: ExecutionContext
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();

    if (!request.userInfo) {
      return true;
    }
    // 拿到用户的权限信息
    let permissions = request.userInfo.permissions;

    // 用户可能有多个角色，根据用户多个角色拥有的权限去重复
    permissions = permissions.filter(
      (item, index, self) =>
        index === self.findIndex(t => t.id === item.id)
    );

    // 是否需要鉴权
    const requirePermission = this.reflector.getAllAndOverride("require-permission", [
      context.getClass(),
      context.getHandler()
    ]);

    if (!requirePermission) {
      return true;
    }

    for (let i = 0; i < requirePermission.length; i++) {
      const curPermission = requirePermission[i];
      const found = permissions.find((item: any) => item.identifying === curPermission);
      if (!found) {
        throw new BussException("您没有访问该接口的权限");
      }
    }

    return true;
  }
}
