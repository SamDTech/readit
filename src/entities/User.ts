import { Entity, Column, Index, BeforeInsert } from "typeorm";
import bcrypt from "bcryptjs";
import { Exclude } from "class-transformer";
import Base from "./Entity";

@Entity("users")
export class User extends Base {
  constructor(user: Partial<User>) {
    super();
    Object.assign(this, user);
  }

  @Index()
  @Column({ unique: true })
  username: string;

  @Index()
  @Column({ unique: true })
  email: string;

  @Exclude()
  @Column()
  password: string;

  @BeforeInsert()
  encryptPassword = async () => {
    this.password = await bcrypt.hash(this.password, 12);
  };
}
