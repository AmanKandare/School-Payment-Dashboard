import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { User, UserSchema } from './schemas/user.schema';
import { Order, OrderSchema } from './schemas/order.schema';
import { OrderStatus, OrderStatusSchema } from './schemas/order-status.schema';
import { WebhookLog, WebhookLogSchema } from './schemas/webhook-logs.schema';
import { AuthModule } from './auth/auth.module';
import { PaymentModule } from './payment/payment.module';
import { TransactionsModule } from './transactions/transactions.module';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('MONGODB_URI'),
      }),
      inject: [ConfigService],
    }),
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Order.name, schema: OrderSchema },
      { name: OrderStatus.name, schema: OrderStatusSchema },
      { name: WebhookLog.name, schema: WebhookLogSchema },
    ]),
    AuthModule,
    PaymentModule,
    TransactionsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
