import { User } from 'src/auth/user.entity';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';

@Entity('quotes')
export class Quote {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'character varying', length: 400 })
  quote: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  written: Date;

  @Column({ type: 'timestamp', nullable: true })
  updated: Date;

  @Column({ type: 'smallint' })
  upvotes: number;

  @Column({ type: 'smallint' })
  downvotes: number;

  @ManyToOne((_type) => User, (user) => user.quotes, {
    eager: false,
    onUpdate: 'CASCADE',
    onDelete: 'RESTRICT',
  })
  user: User;
}
