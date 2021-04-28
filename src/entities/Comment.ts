import {
  BeforeInsert,
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
} from "typeorm";
import { makeid } from "../utils/helper";

import Base from "./Entity";
import { Post } from "./Post";
import { User } from "./User";
import { Vote } from "./Vote";

@Entity("comments")
export class Comment extends Base {
  constructor(comment: Partial<Comment>) {
    super();
    Object.assign(this, comment);
  }

  @Index()
  @Column({ unique: true })
  identifier: string;

  @Column()
  body: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: "username", referencedColumnName: "username" })
  user: User;

  @ManyToOne(() => Post, (post) => post.comments, { nullable: false})
  post: Post;

  @OneToMany(() => Vote, vote => vote.comment)
  votes: Vote[]

  @BeforeInsert()
  createIdentifier() {
    this.identifier = makeid(8);
  }
}
