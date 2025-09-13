import { IsObject, IsOptional, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class OrderInfoDto {
  @IsOptional()
  order_id?: string;

  @IsOptional()
  status?: string;

  @IsOptional()
  amount?: number;

  @IsOptional()
  transaction_id?: string;

  @IsOptional()
  payment_method?: string;

  @IsOptional()
  status_message?: string;
}

export class WebhookDto {
  @IsObject()
  @ValidateNested()
  @Type(() => OrderInfoDto)
  @IsOptional()
  order_info?: OrderInfoDto;

  @IsOptional()
  signature?: string;

  @IsOptional()
  timestamp?: string;
}
