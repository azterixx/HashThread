import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({
  versionKey: false,
  toJSON: {
    virtuals: true,
    transform: (_, ret) => {
      ret.id = ret._id;
      delete ret._id;
      delete ret.__v;
      return ret;
    },
  },
})
export class Thread {
  @Prop({ required: true })
  text: string;

  @Prop({ default: 0 })
  messageCount: number;

  @Prop({ default: 0 })
  likeCount: number;

  @Prop({ type: Date, default: Date.now, expires: 86400 })
  createdAt: Date;

  @Prop({ index: true })
  ownerId: string;

  @Prop({ default: 0 })
  clicks: number;

  @Prop({ type: [String], default: [], index: true })
  likedBy: string[];

  @Prop({ type: [String], default: [] })
  files: string[];

  @Prop({ type: [String], default: [], index: true })
  clickedBy: string[];
}

export type ThreadDocument = Thread &
  Document & {
  _id: Types.ObjectId;
  likeCount: number;
};

export const ThreadSchema = SchemaFactory.createForClass(Thread);

ThreadSchema.index({ createdAt: -1 });
ThreadSchema.index({ likeCount: -1 });
ThreadSchema.index({ clicks: -1 });
ThreadSchema.index({ ownerId: 1, createdAt: -1 });
ThreadSchema.index({ text: 'text' });
