import {
  HttpException,
  Injectable,
  NotFoundException,
  Req,
} from '@nestjs/common';
import User from '../../entity/user';
import Review from '../../entity/review';

@Injectable()
export default class ReviewService {
  async update(
    reviewId: string,
    { rating, comment, dateOfVisit },
    authUser: User,
  ) {
    const review = await Review.findOne(reviewId);
    if (review) {
      if (review.userId === authUser.id || authUser.isAdmin) {
        review.comment = comment;
        review.dateOfVisit = dateOfVisit;
        review.rating = rating;
        await review.save();
        return review;
      } else throw new HttpException('Permission denied', 403);
    } else throw new NotFoundException();
  }

  async delete(reviewId: string, authUser: User) {
    const review = await Review.findOne(reviewId);
    if (review) {
      if (review.userId === authUser.id || authUser.isAdmin) {
        // await Review.delete(reviewId);
        await Review.remove(review);
        return {};
      } else throw new HttpException('Permission denied', 403);
    } else throw new NotFoundException();
  }
}
