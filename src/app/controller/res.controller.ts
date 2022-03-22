import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import * as Joi from 'joi';
import { JoiValidate } from '../../util';
import AdminGuard from '../guards/admin.guard';
import AuthGuard from '../guards/auth.guard';
import RestaurantService from '../service/restaurant.service';
import * as moment from 'moment';

@Controller('res')
export default class ResController {
  constructor(private readonly restaurantService: RestaurantService) {}

  @UseGuards(AdminGuard)
  @Post('')
  async add(@Body() body) {
    const { name, description } = JoiValidate(RestaurantSchema, body);
    return this.restaurantService.add({ name, description });
  }

  @UseGuards(AuthGuard)
  @Get('')
  async get(@Query('page') page = '1') {
    console.log({ page });
    return this.restaurantService.get(page);
  }

  @UseGuards(AuthGuard)
  @Post('/:rid/review')
  async addReview(@Param('rid') rid: string, @Body() body, @Req() req) {
    const { comment, rating, dateOfVisit } = JoiValidate(ReviewSchema, body);
    return this.restaurantService.addComment(
      rid,
      {
        comment,
        rating,
        dateOfVisit,
      },
      req.user,
    );
  }

  @UseGuards(AdminGuard)
  @Put('/:id')
  async update(@Param('id') id: string, @Body() data) {
    const { name, description } = JoiValidate(RestaurantSchema, data);
    return this.restaurantService.update(id, { name, description });
  }

  @UseGuards(AuthGuard)
  @Get('/:id')
  async getDetail(@Param('id') id: string) {
    return this.restaurantService.getDetail(id);
  }

  @UseGuards(AdminGuard)
  @Delete('/:id')
  async delete(@Param('id') id: string) {
    return this.restaurantService.delete(id);
  }
}

const RestaurantSchema = Joi.object({
  name: Joi.string().min(4).required(),
  description: Joi.string().min(4).required(),
});

const ReviewSchema = Joi.object({
  comment: Joi.string().min(4).required(),
  rating: Joi.number().min(1).max(5).required(),
  dateOfVisit: Joi.string().custom((val, handler) => {
    const date = moment(val, 'YYYY-MM-DD', true);
    if (
      date.isValid() &&
      date.format('YYYY-MM-DD') < moment().add(1, 'day').format('YYYY-MM-DD')
    ) {
      return val;
    } else {
      return handler.error(
        `Valid Date of format YYYY-MM-DD of today or past is only acceppted`,
      );
    }
  }),
});
