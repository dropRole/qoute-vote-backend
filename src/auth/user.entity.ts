import { Exclude } from 'class-transformer';
import { Quote } from '../quotes/quote.entity';
import { Entity, PrimaryColumn, Column, OneToMany } from 'typeorm';
import { Vote } from '../quotes/vote.entity';

@Entity('users')
export class User {
  @PrimaryColumn({ type: 'character varying', length: 20 })
  username: string;

  @Column({ type: 'character varying', length: 64 })
  @Exclude({ toPlainOnly: true })
  pass: string;

  @Column({ type: 'character varying', length: 13 })
  name: string;

  @Column({ type: 'character varying', length: 20 })
  surname: string;

  @Column({ type: 'character varying', length: 64 })
  email: string;

  @Column({ type: 'text', nullable: true })
  avatar: string;

  @OneToMany((_type) => Quote, (quote) => quote.user, { eager: false })
  quotes: Quote[];
  
  @OneToMany((_type) => Vote, (vote) => vote.user, { eager: false })
  votes: Vote[];
}