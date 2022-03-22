import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  UnauthorizedException,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { verifyJwtToken } from '../../util';

export default class AuthGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = request.headers.jwt;
    const user = await verifyJwtToken(token);
    if (user) {
      request.user = user;
      return true;
    } else throw new UnauthorizedException();
  }
}
