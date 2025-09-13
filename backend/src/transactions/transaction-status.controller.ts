import { Controller, Get, Param } from '@nestjs/common';
import { TransactionsService } from './transactions.service';

@Controller('transaction-status')
export class TransactionStatusController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @Get(':custom_order_id')
  async getTransactionStatus(@Param('custom_order_id') customOrderId: string) {
    try {
      const result = await this.transactionsService.getTransactionStatus(customOrderId);
      
      return {
        success: true,
        message: 'Transaction status retrieved successfully',
        data: result.data,
      };
    } catch (error) {
      return {
        success: false,
        message: 'Failed to retrieve transaction status',
        error: error.message,
      };
    }
  }
}
