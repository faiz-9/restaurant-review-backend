import {
  AfterInsert,
  AfterRemove,
  AfterUpdate,
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import Restaurant from './restaurant';
import User from './user';

@Entity({ name: 'review' })
export default class Review extends BaseEntity {
  @AfterInsert()
  @AfterUpdate()
  @AfterRemove()
  async onAddOrUpdate() {
    const res = await Restaurant.findOne(this.restaurantId);
    const reviews = await Review.find({
      where: { restaurantId: this.restaurantId },
    });
    const totalRating = reviews.reduce(
      (totalRating, review) => review.rating + totalRating,
      0,
    );
    const avgRating =
      reviews.length === 0
        ? 0
        : Number(Number(totalRating / reviews.length).toFixed(2));
    res.avgRating = avgRating;
    await res.save();
  }

  @PrimaryGeneratedColumn() id: number;
  @Column() restaurantId: number;
  @Column() userId: number;
  @Column() comment: string;
  @Column() rating: number;
  @Column() dateOfVisit: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'userId', referencedColumnName: 'id' })
  user: User;
}
