import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'restaurant' })
export default class Restaurant extends BaseEntity {
  @PrimaryGeneratedColumn() id: number;
  @Column({ default: 0 }) avgRating: number;
  @Column() name: string;
  @Column() description: string;
}
