import { 
  Controller, 
  Post, 
  Get, 
  Body, 
  Param, 
  Query, 
  UseGuards,
  UsePipes,
  ValidationPipe,
  HttpException,
  HttpStatus 
} from '@nestjs/common';
import { PaymentService } from './payment.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreatePaymentDto } from './dto/create-payment.dto';

@Controller('payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Post('create-payment')
  @UseGuards(JwtAuthGuard)
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  async createPayment(@Body() createPaymentDto: CreatePaymentDto) {
    try {
      const result = await this.paymentService.createPayment(createPaymentDto);
      return {
        success: true,
        message: 'Payment request created successfully',
        data: result,
      };
    } catch (error) {
      throw new HttpException(
        {
          success: false,
          message: 'Failed to create payment request',
          error: error.message,
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Post('webhook')
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async handleWebhook(@Body() webhookData: any) {
    try {
      const result = await this.paymentService.handleWebhook(webhookData);
      return {
        success: true,
        message: 'Webhook processed successfully',
        data: result,
      };
    } catch (error) {
      throw new HttpException(
        {
          success: false,
          message: 'Webhook processing failed',
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('status/:collectRequestId')
  @UseGuards(JwtAuthGuard)
  async checkPaymentStatus(
    @Param('collectRequestId') collectRequestId: string,
    @Query('school_id') schoolId: string,
  ) {
    try {
      if (!schoolId) {
        throw new HttpException(
          {
            success: false,
            message: 'school_id is required',
          },
          HttpStatus.BAD_REQUEST,
        );
      }

      const result = await this.paymentService.checkPaymentStatus(
        collectRequestId,
        schoolId,
      );

      return {
        success: true,
        message: 'Payment status retrieved successfully',
        data: result,
      };
    } catch (error) {
      throw new HttpException(
        {
          success: false,
          message: 'Failed to check payment status',
          error: error.message,
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Get('order/:orderId')
  @UseGuards(JwtAuthGuard)
  async getOrderDetails(@Param('orderId') orderId: string) {
    try {
      // Get order from database via orderModel
      const order = await this.paymentService.getOrderById(orderId);
      return {
        success: true,
        message: 'Order details retrieved successfully',
        data: order,
      };
    } catch (error) {
      throw new HttpException(
        {
          success: false,
          message: 'Failed to retrieve order details',
          error: error.message,
        },
        HttpStatus.NOT_FOUND,
      );
    }
  }

  @Post('callback/:orderId')
  async handleCallback(
    @Param('orderId') orderId: string,
    @Body() callbackData: any,
  ) {
    try {
      const result = await this.paymentService.handleWebhook({
        order_info: {
          order_id: orderId,
          ...callbackData,
        },
      });

      return {
        success: true,
        message: 'Callback processed successfully',
        data: result,
      };
    } catch (error) {
      throw new HttpException(
        {
          success: false,
          message: 'Callback processing failed',
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
