import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  UnauthorizedException,
} from '@nestjs/common';
import { verifyJwtToken } from '../../util';

export default class AdminGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = request.headers.jwt;
    console.log(token);
    console.log(request.headers);
    const user = await verifyJwtToken(token);
    console.log('user', user);
    if (user) {
      request.user = user;
      if (user.isAdmin) {
        return true;
      } else throw new ForbiddenException();
    } else throw new UnauthorizedException();
  }
}
