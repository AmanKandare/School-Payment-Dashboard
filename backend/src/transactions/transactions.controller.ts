import { Controller, Get, Query, Param, ParseIntPipe, DefaultValuePipe } from '@nestjs/common';
import { TransactionsService } from './transactions.service';

@Controller('transactions')
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @Get()
  async getAllTransactions(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
    @Query('sort', new DefaultValuePipe('createdAt')) sort: string,
    @Query('order', new DefaultValuePipe('asc')) order: string,
    @Query('status') status?: string,
    @Query('school_id') school_id?: string,
  ) {
    try {
      const result = await this.transactionsService.getAllTransactions({
        page,
        limit,
        sort,
        order,
        status,
        school_id,
      });

      return {
        success: true,
        message: 'Transactions retrieved successfully',
        data: result.data,
        pagination: result.pagination,
      };
    } catch (error) {
      return {
        success: false,
        message: 'Failed to retrieve transactions',
        error: error.message,
      };
    }
  }

  @Get('school/:schoolId')
  async getTransactionsBySchool(
    @Param('schoolId') schoolId: string,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
    @Query('sort', new DefaultValuePipe('createdAt')) sort: string,
    @Query('order', new DefaultValuePipe('asc')) order: string,
  ) {
    try {
      const result = await this.transactionsService.getTransactionsBySchool(schoolId, {
        page,
        limit,
        sort,
        order,
      });

      return {
        success: true,
        message: 'School transactions retrieved successfully',
        data: result.data,
        pagination: result.pagination,
      };
    } catch (error) {
      return {
        success: false,
        message: 'Failed to retrieve school transactions',
        error: error.message,
      };
    }
  }
}
