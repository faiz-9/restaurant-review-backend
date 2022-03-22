import {
  Body,
  Controller,
  Delete,
  Param,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import * as Joi from 'joi';
import { JoiValidate } from '../../util';
import AdminGuard from '../guards/admin.guard';
import AuthGuard from '../guards/auth.guard';
import * as moment from 'moment';
import ReviewService from '../service/review.service';

@Controller('review')
export default class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}

  @UseGuards(AuthGuard)
  @Put('/:id')
  async update(@Param('id') reviewId: string, @Body() data, @Req() req) {
    const { comment, rating, dateOfVisit } = JoiValidate(ReviewSchema, data);
    return this.reviewService.update(
      reviewId,
      {
        comment,
        rating,
        dateOfVisit,
      },
      req.user,
    );
  }

  @UseGuards(AuthGuard) //changes ADMIN GAURD to AUTH GAURD
  @Delete('/:id')
  async delete(@Param('id') reviewId: string, @Req() req) {
    return this.reviewService.delete(reviewId, req.user);
  }
}

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
        `Valid Date of format YYYY-MM-DD of today or past is only accepted`,
      );
    }
  }),
});
