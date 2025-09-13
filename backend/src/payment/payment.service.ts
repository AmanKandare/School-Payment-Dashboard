import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import axios from 'axios';
import * as jwt from 'jsonwebtoken';
import { Order, OrderDocument } from '../schemas/order.schema';
import { OrderStatus, OrderStatusDocument } from '../schemas/order-status.schema';

@Injectable()
export class PaymentService {
  private readonly CASHFREE_API_URL = 'https://dev-vanilla.edviron.com/erp';
  
  constructor(
    @InjectModel(Order.name) private readonly orderModel: Model<OrderDocument>,
    @InjectModel(OrderStatus.name) private readonly orderStatusModel: Model<OrderStatusDocument>,
  ) {}

  async createPayment(paymentData: {
    school_id: string;
    amount: string;
    student_info: any;
    trustee_id: string;
  }) {
    try {
      // 1. Create order in database
      const order = new this.orderModel({
        school_id: paymentData.school_id,
        trustee_id: paymentData.trustee_id,
        student_info: paymentData.student_info,
        gateway_name: 'cashfree',
      });
      const savedOrder = await order.save();

      // 2. Generate callback URL
      const callback_url = `${process.env.FRONTEND_URL}/payment-status/${savedOrder._id}`;

      // 3. Create JWT sign - EXACTLY as per API docs
      const jwtPayload = {
        school_id: paymentData.school_id,
        amount: paymentData.amount,
        callback_url: callback_url,
      };

      const sign = jwt.sign(jwtPayload, process.env.PG_KEY);

      // 4. Call Cashfree API with EXACT endpoint
      const response = await axios.post(
        `${this.CASHFREE_API_URL}/create-collect-request`,
        {
          school_id: paymentData.school_id,
          amount: paymentData.amount,
          callback_url: callback_url,
          sign: sign,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${process.env.API_KEY}`,
          },
        }
      );

      // 5. Create initial order status
      const orderStatus = new this.orderStatusModel({
        collect_id: savedOrder._id,
        order_amount: parseFloat(paymentData.amount),
        transaction_amount: parseFloat(paymentData.amount),
        payment_mode: 'online',
        payment_details: 'Payment initiated',
        bank_reference: response.data.collect_request_id,
        payment_message: 'Payment request created',
        status: 'pending',
        payment_time: new Date(),
      });

      await orderStatus.save();

      return {
        success: true,
        order_id: savedOrder._id,
        collect_request_id: response.data.collect_request_id,
        payment_url: response.data.Collect_request_url,
        sign: response.data.sign,
      };

    } catch (error) {
      throw new Error(`Payment creation failed: ${error.message}`);
    }
  }

  async checkPaymentStatus(collectRequestId: string, schoolId: string) {
    try {
      // Create JWT for status check - EXACT payload format
      const jwtPayload = {
        school_id: schoolId,
        collect_request_id: collectRequestId,
      };

      const sign = jwt.sign(jwtPayload, process.env.PG_KEY);

      // Call status API with exact URL format
      const response = await axios.get(
        `${this.CASHFREE_API_URL}/collect-request/${collectRequestId}?school_id=${schoolId}&sign=${sign}`
      );

      return {
        success: true,
        status: response.data.status,
        amount: response.data.amount,
        details: response.data.details,
      };

    } catch (error) {
      throw new Error(`Status check failed: ${error.message}`);
    }
  }

  async handleWebhook(webhookData: any) {
    try {
      // Parse order_id from webhook (this is the collect_id)
      const collectId = webhookData.order_info?.order_id;
      
      if (!collectId) {
        throw new Error('Missing order_id in webhook payload');
      }

      // Update existing OrderStatus (don't create duplicate)
      const statusUpdate = {
        status: webhookData.order_info?.status?.toLowerCase() || 'completed',
        transaction_amount: webhookData.order_info?.amount || 0,
        payment_mode: webhookData.order_info?.payment_method || 'online',
        payment_details: JSON.stringify(webhookData.order_info),
        bank_reference: webhookData.order_info?.transaction_id || '',
        payment_message: webhookData.order_info?.status_message || 'Payment completed',
        payment_time: new Date(),
      };

      // Find and update existing record
      const updatedStatus = await this.orderStatusModel.findOneAndUpdate(
        { collect_id: collectId },
        statusUpdate,
        { new: true, upsert: true } // Create if not exists, update if exists
      );

      // Log webhook payload for debugging
      console.log('Webhook processed:', {
        collect_id: collectId,
        status: webhookData.order_info?.status,
        amount: webhookData.order_info?.amount,
      });

      return {
        success: true,
        message: 'Webhook processed successfully',
        updated_status: updatedStatus,
      };

    } catch (error) {
      console.error('Webhook processing error:', error);
      throw new Error(`Webhook processing failed: ${error.message}`);
    }
  }

  async getOrderById(orderId: string) {
    try {
      const order = await this.orderModel.findById(orderId).exec();
      if (!order) {
        throw new Error('Order not found');
      }
      return order;
    } catch (error) {
      throw new Error(`Failed to get order: ${error.message}`);
    }
  }

  async handleCallback(orderId: string, callbackData: any) {
    try {
      // Update order status based on callback
      const statusUpdate = {
        status: callbackData.status || 'completed',
        payment_details: JSON.stringify(callbackData),
        payment_time: new Date(),
      };

      const updatedStatus = await this.orderStatusModel.findOneAndUpdate(
        { collect_id: orderId },
        statusUpdate,
        { new: true }
      );

      return {
        success: true,
        message: 'Callback processed successfully',
        updated_status: updatedStatus,
      };

    } catch (error) {
      console.error('Callback processing error:', error);
      throw new Error(`Callback processing failed: ${error.message}`);
    }
  }
}
