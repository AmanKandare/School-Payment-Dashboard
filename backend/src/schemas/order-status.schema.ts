import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as mongoose from 'mongoose';

export type OrderStatusDocument = OrderStatus & Document;

@Schema({ timestamps: true })
export class OrderStatus {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Order', required: true })
  collect_id: mongoose.Schema.Types.ObjectId;

  @Prop({ required: true })
  order_amount: number;

  @Prop({ required: true })
  transaction_amount: number;

  @Prop({ required: true })
  payment_mode: string;

  @Prop({ required: true })
  payment_details: string;

  @Prop({ required: true })
  bank_reference: string;

  @Prop({ required: true })
  payment_message: string;

  @Prop({ required: true })
  status: string;

  @Prop()
  error_message: string;

  @Prop({ required: true })
  payment_time: Date;
}

export const OrderStatusSchema = SchemaFactory.createForClass(OrderStatus);
// Add performance indexes  
OrderStatusSchema.index({ collect_id: 1 });
OrderStatusSchema.index({ status: 1 });
OrderStatusSchema.index({ payment_time: -1 });