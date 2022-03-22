import { HttpException, Injectable, NotFoundException } from '@nestjs/common';
import User from '../../entity/user';
import * as Bcryptjs from 'bcryptjs';
import * as Jwt from 'jsonwebtoken';
import { JwtSecret, PageSize } from '../../util';

@Injectable()
export default class UserService {
  async login({ email, password }) {
    const user = await User.findOne({
      where: { email: email.toLowerCase() },
      select: ['email', 'password', 'name', 'id', 'isAdmin'],
    });
    if (user) {
      if (Bcryptjs.compareSync(password, user.password)) {
        return {
          ...user,
          password: undefined,
          jwt: Jwt.sign({ id: user.id }, JwtSecret, { expiresIn: '1d' }),
        };
      } else throw new HttpException('Email and password not match', 400);
    } else throw new HttpException('Email and password not match', 400);
  }

  async signup({ email, password, name }) {
    let user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      user = new User();
      user.email = email.toLowerCase();
      user.password = Bcryptjs.hashSync(password, 10);
      user.name = name;
      await user.save();
      return {
        ...user,
        password: undefined,
      };
    } else throw new HttpException('Email already exist', 400);
  }

  async add({ email, password, name, isAdmin }) {
    const user = await this.signup({ email, password, name });
    const u = await User.findOne(user.id);
    u.isAdmin = isAdmin;
    await u.save();
    return u;
  }

  async update(id, { name, email, isAdmin, password }) {
    const u = await User.findOne(id);
    const userEmail = await User.findOne({ email: email.toLowerCase() });

    if (userEmail) {
      throw new HttpException('Email already exist', 400);
    } else if (u) {
      u.name = name;
      u.email = email.toLowerCase();
      u.isAdmin = isAdmin;
      if (password) {
        u.password = Bcryptjs.hashSync(password, 10);
      }
      await u.save();
      return u;
    } else throw new NotFoundException();
  }

  async delete(id) {
    const u = await User.findOne(id);
    if (u) {
      await User.delete(id);
      return {};
    } else throw new NotFoundException();
  }

  async get(p: string) {
    const page = Math.max(Number(p) || 1, 1);
    const users = await User.find({
      take: PageSize,
      skip: (page - 1) * PageSize,
      order: { id: 'DESC' },
    });
    const total = await User.count({});
    return { users, page, pageCount: Math.ceil(total / PageSize) };
  }
}
