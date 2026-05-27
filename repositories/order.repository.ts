import { db } from '@/lib/db'

type OrderRecord = {
  id: string
  status: string
  totalInPaise: number
}

export async function findOrderById(orderId: string) {
  // Replace with a Drizzle select by id.
  return db.query<OrderRecord | null>('orders.findById', { orderId })
}

export async function updateOrderStatusRecord(orderId: string, status: string) {
  // Replace with a Drizzle update by id.
  return db.query<OrderRecord>('orders.updateStatus', { orderId, status })
}
