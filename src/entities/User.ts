import { Entity, Column, Index, BeforeInsert, OneToMany } from "typeorm";
import bcrypt from "bcryptjs";
import { Exclude } from "class-transformer";
import Base from "./Entity";
import { Post } from "./Post";
import { Vote } from "./Vote";

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

  @OneToMany(() => Post, (post) => post.user)
  posts: Post[];

  @OneToMany(() => Vote, (vote) => vote.user)
  votes: Vote[];

  @BeforeInsert()
  async encryptPassword()  {
    this.password = await bcrypt.hash(this.password, 12);
  };
}
