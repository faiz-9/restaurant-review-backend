import { Module } from '@nestjs/common';
import UserController from './app/controller/user.controller';
import ReviewController from './app/controller/review.controller';
import ResController from './app/controller/res.controller';
import RestaurantService from './app/service/restaurant.service';
import ReviewService from './app/service/review.service';
import UserService from './app/service/user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import Restaurant from './entity/restaurant';
import User from './entity/user';
import Review from './entity/review';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'sqlite.db',
      synchronize: true,
      entities: [Restaurant, User, Review],
      logging: false,
    }),
  ],
  controllers: [ResController, ReviewController, UserController],
  providers: [RestaurantService, ReviewService, UserService],
})
export class AppModule {}
