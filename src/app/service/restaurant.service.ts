import { HttpException, Injectable, NotFoundException } from '@nestjs/common';
import User from '../../entity/user';
import Restaurant from '../../entity/restaurant';
import { PageSize } from '../../util';
import Review from '../../entity/review';
import review from '../../entity/review';

@Injectable()
export default class RestaurantService {
  async add({ name, description }) {
    const res = new Restaurant();
    res.name = name;
    res.description = description;
    await res.save();
    return res;
  }

  async get(p: string) {
    const page = Math.max(Number(p) || 1, 1);
    const restaurants = await Restaurant.find({
      order: { avgRating: 'DESC' },
      take: PageSize,
      skip: (page - 1) * PageSize,
    });

    const totalRestaurantCount = await Restaurant.count({});
    const pageCount = Math.ceil(totalRestaurantCount / PageSize);
    return { restaurants, page, pageCount };
  }

  async update(id: string, { name, description }) {
    const res = await Restaurant.findOne(id);
    if (res) {
      res.name = name;
      res.description = description;
      await res.save();
      return res;
    } else throw new NotFoundException();
  }

  async delete(id: string) {
    const res = await Restaurant.findOne(id);
    if (res) {
      await Restaurant.delete(id);
      return {};
    }
    throw new NotFoundException();
  }

  async getDetail(restaurantId: string) {
    const res = await Restaurant.findOne(restaurantId);
    if (res) {
      const reviewHighest = await Review.findOne({
        where: { restaurantId: res.id },
        relations: ['user'],
        order: { rating: 'DESC' },
      });
      const reviewLowest = await Review.findOne({
        where: { restaurantId: res.id },
        relations: ['user'],
        order: { rating: 'ASC' },
      });
      const reviewLatest = await Review.findOne({
        where: { restaurantId: res.id },
        relations: ['user'],
        order: { dateOfVisit: 'DESC' },
      });
      // @ts-ignore
      reviewHighest?.user = reviewHighest?.user?.name;
      // @ts-ignore
      reviewLowest?.user = reviewLowest?.user?.name;
      // @ts-ignore
      reviewLatest?.user = reviewLatest?.user?.name;

      return {
        ...res,
        reviewHighest,
        reviewLowest,
        reviewLatest,
      };
    } else throw new NotFoundException();
  }

  async addComment(
    rid: string,
    { rating, comment, dateOfVisit },
    authUser: User,
  ) {
    const res = await Restaurant.findOne(rid);
    if (res) {
      const existingReview = await Review.findOne({
        restaurantId: res.id,
        userId: authUser.id,
      });
      if (existingReview) {
        throw new HttpException('You have already rated this restaurant', 400);
      } else {
        const review = new Review();
        review.restaurantId = res.id;
        review.userId = authUser.id;
        review.rating = rating;
        review.comment = comment;
        review.dateOfVisit = dateOfVisit;
        await review.save();
        return review;
      }
    } else throw new NotFoundException();
  }
}
