import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type WebhookLogDocument = WebhookLog & Document;

@Schema({ timestamps: true })
export class WebhookLog {
  @Prop({ required: true })
  endpoint: string;

  @Prop({ required: true, type: Object })
  payload: any;

  @Prop({ required: true })
  status_code: number;

  @Prop()
  response: string;

  @Prop()
  error_message: string;
}

export const WebhookLogSchema = SchemaFactory.createForClass(WebhookLog);
