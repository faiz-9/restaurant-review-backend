import Restaurant from './entity/restaurant';
import Review from './entity/review';
import User from './entity/user';
import * as Bcryptjs from 'bcryptjs';
import * as _ from 'lodash';
import * as moment from 'moment';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

const bootstrap = async () => {
  const app = await NestFactory.createApplicationContext(AppModule);
  await Review.delete({});
  await Restaurant.delete({});
  await User.delete({});

  const admin = new User();
  admin.id = 1;
  admin.name = 'Admin User';
  admin.email = 'admin@example.com';
  admin.password = Bcryptjs.hashSync('1234', 10);
  admin.isAdmin = true;
  await admin.save();

  const regular = new User();
  regular.id = 2;
  regular.name = 'Regular User';
  regular.email = 'regular@example.com';
  regular.password = Bcryptjs.hashSync('1234', 10);
  regular.isAdmin = false;
  await regular.save();

  for (let i = 1; i < 25; i++) {
    const res = new Restaurant();
    res.id = i;
    res.name = `Restaurant Name ${i}`;
    res.description = `This is really nice Restaurant at ${i} place`;
    await res.save();
  }

  for (let i = 1; i < 100; i++) {
    const review = new Review();
    review.rating = _.random(1, 5, false);
    review.comment = `This was an interesting review at ${i}`;
    review.userId = admin.id;
    review.restaurantId = _.random(1, 24, false);
    const randomDay = _.random(0, 10, false);
    review.dateOfVisit = moment()
      .subtract(randomDay, 'day')
      .format('YYYY-MM-DD');
    await review.save();
  }
  await app.close();
};

bootstrap().then();
