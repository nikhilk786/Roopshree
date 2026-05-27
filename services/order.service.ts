import {
  findOrderById,
  updateOrderStatusRecord,
} from '@/repositories/order.repository'

const allowedOrderStatuses = ['pending', 'paid', 'shipped', 'delivered', 'cancelled']

export async function updateOrderStatus(orderId: string, status: string) {
  if (!allowedOrderStatuses.includes(status)) {
    throw new Error('Invalid order status')
  }

  const order = await findOrderById(orderId)

  if (!order) {
    throw new Error('Order not found')
  }

  return updateOrderStatusRecord(orderId, status)
}
