import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  Param,
  Post,
  Put,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import * as Joi from 'joi';
import UserService from '../service/user.service';
import { JoiValidate } from '../../util';
import AdminGuard from '../guards/admin.guard';

@Controller('user')
export default class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('/login')
  async login(@Body() body) {
    const { email, password } = JoiValidate(LoginSchema, body);
    return this.userService.login({ email, password });
  }

  @Post('/signup')
  async signup(@Body() body) {
    const { name, email, password } = JoiValidate(SignupSchema, body);
    return this.userService.signup({ email, password, name });
  }

  @UseGuards(AdminGuard)
  @Post('/add')
  async add(@Body() data) {
    const { email, password, name, isAdmin } = JoiValidate(AddUserSchema, data);
    return this.userService.add({ email, password, name, isAdmin });
  }

  @UseGuards(AdminGuard)
  @Get('/')
  async get(@Query('page') page = '1') {
    return this.userService.get(page);
  }

  @UseGuards(AdminGuard)
  @Put('/:id')
  async update(@Param('id') id: string, @Body() data) {
    const { email, password, name, isAdmin } = JoiValidate(UpdateSchema, data);
    return this.userService.update(id, { email, password, name, isAdmin });
  }

  @UseGuards(AdminGuard)
  @Delete('/:id')
  async delete(@Param('id') id: string, @Req() req) {
    if (req.user.id == id)
      throw new HttpException("Logged in user can't delete himself", 400);
    return this.userService.delete(id);
  }
}

const LoginSchema = Joi.object({
  password: Joi.string().min(4).required(),
  email: Joi.string().email().required(),
});

const SignupSchema = LoginSchema.keys({
  name: Joi.string().min(4).required(),
});

const AddUserSchema = SignupSchema.keys({
  isAdmin: Joi.boolean().required(),
});

const UpdateSchema = Joi.object({
  email: Joi.string().email().required(),
  isAdmin: Joi.boolean().required(),
  name: Joi.string().min(4).required(),
  password: Joi.string().min(4).allow(null),
});
