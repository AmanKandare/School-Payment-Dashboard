import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, PipelineStage, Types } from 'mongoose';
import { Order, OrderDocument } from '../schemas/order.schema';
import { OrderStatus, OrderStatusDocument } from '../schemas/order-status.schema';

@Injectable()
export class TransactionsService {
  constructor(
    @InjectModel(Order.name) private readonly orderModel: Model<OrderDocument>,
    @InjectModel(OrderStatus.name) private readonly orderStatusModel: Model<OrderStatusDocument>,
  ) {}

  async getAllTransactions(query: any = {}) {
    const page = parseInt(query.page) || 1;
    const limit = parseInt(query.limit) || 10;
    const sortField = query.sort || 'createdAt';
    const sortOrder = query.order === 'desc' ? -1 : 1;

    // Build match conditions
    const matchConditions: any = {};
    if (query.status) {
      matchConditions.status = query.status;
    }
    if (query.school_id) {
      matchConditions.school_id = new Types.ObjectId(query.school_id);
    }

    // Define aggregation pipeline
    const pipeline: PipelineStage[] = [
      { $match: matchConditions },
      {
        $lookup: {
          from: 'orderstatuses',
          localField: '_id',
          foreignField: 'collect_id',
          as: 'statusData'
        }
      },
      {
        $unwind: {
          path: '$statusData',
          preserveNullAndEmptyArrays: true
        }
      },
      {
        $project: {
          collect_id: '$_id',
          school_id: 1,
          gateway: '$gateway_name',
          order_amount: '$statusData.order_amount',
          transaction_amount: '$statusData.transaction_amount',
          status: '$statusData.status',
          custom_order_id: '$_id',
          student_info: '$student_info',
          payment_time: '$statusData.payment_time',
          createdAt: 1
        }
      },
      { $sort: { [sortField]: sortOrder } },
      { $skip: (page - 1) * limit },
      { $limit: limit }
    ];

    try {
      const [transactions, total] = await Promise.all([
        this.orderModel.aggregate(pipeline).exec(),
        this.orderModel.countDocuments(matchConditions)
      ]);

      return {
        success: true,
        data: transactions,
        pagination: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit)
        }
      };
    } catch (error) {
      return {
        success: false,
        message: 'Failed to fetch transactions',
        error: error.message
      };
    }
  }

  async getTransactionsBySchool(schoolId: string, query: any = {}) {
    return this.getAllTransactions({ ...query, school_id: schoolId });
  }

  async getTransactionStatus(customOrderId: string) {
    const pipeline: PipelineStage[] = [
      { $match: { _id: new Types.ObjectId(customOrderId) } },
      {
        $lookup: {
          from: 'orderstatuses',
          localField: '_id',
          foreignField: 'collect_id',
          as: 'statusData'
        }
      },
      {
        $unwind: {
          path: '$statusData',
          preserveNullAndEmptyArrays: true
        }
      },
      {
        $project: {
          collect_id: '$_id',
          status: '$statusData.status',
          transaction_amount: '$statusData.transaction_amount',
          payment_time: '$statusData.payment_time',
          custom_order_id: '$_id'
        }
      }
    ];

    try {
      const result = await this.orderModel.aggregate(pipeline).exec();
      return {
        success: true,
        data: result[0] || null
      };
    } catch (error) {
      return {
        success: false,
        message: 'Failed to fetch transaction status',
        error: error.message
      };
    }
  }
}
