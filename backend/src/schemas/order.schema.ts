import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as mongoose from 'mongoose';

export type OrderDocument = Order & Document;

@Schema({ _id: false })
export class StudentInfo {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  id: string;

  @Prop({ required: true })
  email: string;
}

@Schema({ timestamps: true })
export class Order {
  @Prop({ type: mongoose.Schema.Types.ObjectId, required: true })
  school_id: mongoose.Schema.Types.ObjectId;

  @Prop({ type: mongoose.Schema.Types.ObjectId, required: true })
  trustee_id: mongoose.Schema.Types.ObjectId;

  @Prop({ type: StudentInfo, required: true })
  student_info: StudentInfo;

  @Prop({ required: true })
  gateway_name: string;
}

export const OrderSchema = SchemaFactory.createForClass(Order);

// Add performance indexes
OrderSchema.index({ school_id: 1 });
OrderSchema.index({ 'student_info.id': 1 });
OrderSchema.index({ createdAt: -1 });