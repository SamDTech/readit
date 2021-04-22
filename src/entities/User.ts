import { IsEmail, IsEmpty, Length, Min } from "class-validator";
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  Index,
  CreateDateColumn,
  UpdateDateColumn,
  BeforeInsert,
} from "typeorm";
import bcrypt from "bcryptjs";
import { classToPlain, Exclude } from "class-transformer";

@Entity("users")
export class User extends BaseEntity {
  constructor(user: Partial<User>) {
    super();
    Object.assign(this, user);
  }

  @Exclude()
  @PrimaryGeneratedColumn()
  id: number;

  @Index()
  @Length(3)
  @Column({ unique: true })
  username: string;

  @Index()
  @Column({ unique: true })
  @IsEmail()
  email: string;

  @Exclude()
  @Length(5)
  @Column()
  password: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @BeforeInsert()
  encryptPassword = async () => {
    this.password = await bcrypt.hash(this.password, 12);
  };

  toJSON() {
    return classToPlain(this);
  }
}
