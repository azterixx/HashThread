import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Thread } from '../thread/thread.schema';

@Schema({ versionKey: false })
export class Comment {
  @Prop({ type: Types.ObjectId, ref: Thread.name, required: true })
  threadId: Types.ObjectId;

  @Prop({ required: true })
  text: string;

  @Prop({ type: Number, default: 0 })
  replyCount: number;

  @Prop({ required: true })
  messageNumber: number;

  @Prop({ type: Number, default: null })
  replyTo: number | null;

  @Prop({ type: Date, default: Date.now })
  createdAt: Date;

  @Prop({ default: false })
  isOp: boolean;

  @Prop({ type: [String], default: [], index: true })
  likedBy: string[];

  @Prop({ type: Number, default: 0 })
  likeCount: number;

  @Prop({ type: [String], default: [] })
  files: string[];

  @Prop({ type: Date })
  threadExpiresAt?: Date;
}

export type CommentDocument = Comment &
  Document & {
  _id: Types.ObjectId;
  likeCount: number;
  replyCount: number;
};

export const CommentSchema = SchemaFactory.createForClass(Comment);

CommentSchema.index({ threadId: 1, messageNumber: 1 }, { unique: true });
CommentSchema.index({ threadId: 1, createdAt: 1 });
CommentSchema.index({ likeCount: -1, threadId: 1 });
CommentSchema.index({ threadExpiresAt: 1 }, { expireAfterSeconds: 0 });
CommentSchema.index({ text: 'text' });
