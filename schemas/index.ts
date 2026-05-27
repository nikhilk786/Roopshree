export type ProductTable = {
  id: string
  name: string
  slug: string
  priceInPaise: number
  stock: number
  isActive: boolean
}

export type OrderTable = {
  id: string
  userId: string
  status: string
  totalInPaise: number
}

export type UserTable = {
  id: string
  email: string
  role: 'user' | 'admin'
}
