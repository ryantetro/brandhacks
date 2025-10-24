export interface User {
  id: string
  email: string
  name: string
  subscription: 'free' | 'premium'
  createdAt: Date
  updatedAt: Date
}

export interface Purchase {
  id: string
  title: string
  description: string
  brand: string
  productName: string
  purchasePrice: number
  purchaseDate: Date
  receiptImageUrl?: string
  receiptText?: string
  category: string
  tags: string[]
  storeUrl?: string
  imageUrl?: string
  userId: string
  createdAt: Date
  updatedAt: Date
}

export interface Warranty {
  id: string
  purchaseId: string
  brand: string
  duration: number
  type: 'manufacturer' | 'extended' | 'accidental'
  description: string
  coverage: string
  exclusions: string
  claimProcess: string
  expiresAt: Date
  isActive: boolean
  userId: string
  createdAt: Date
  updatedAt: Date
}

export interface ReturnPolicy {
  id: string
  purchaseId: string
  brand: string
  duration: number
  conditions: string
  process: string
  refundType: 'full' | 'store_credit' | 'exchange'
  expiresAt: Date
  isActive: boolean
  userId: string
  createdAt: Date
  updatedAt: Date
}

export interface Alert {
  id: string
  type: 'warranty_expiry' | 'return_deadline' | 'price_drop' | 'policy_update'
  title: string
  message: string
  priority: 'low' | 'medium' | 'high' | 'urgent'
  isRead: boolean
  isActive: boolean
  scheduledFor: Date
  sentAt?: Date
  warrantyId?: string
  returnPolicyId?: string
  userId: string
  createdAt: Date
  updatedAt: Date
}

export interface Brand {
  id: string
  name: string
  slug: string
  logoUrl?: string
  website?: string
  description?: string
  defaultWarranty?: number
  defaultReturnPolicy?: number
  isVerified: boolean
  createdAt: Date
  updatedAt: Date
}

export interface BrandPolicy {
  id: string
  brandId: string
  type: 'warranty' | 'return' | 'price_protection' | 'other'
  title: string
  description: string
  duration?: number
  conditions?: string
  process?: string
  exclusions?: string
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

export interface Category {
  id: string
  name: string
  slug: string
  description?: string
  createdAt: Date
}

export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

export interface PaginationParams {
  page: number
  limit: number
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

export type AuthUser = Omit<User, 'createdAt' | 'updatedAt'>
export type CreatePurchaseInput = Omit<Purchase, 'id' | 'userId' | 'createdAt' | 'updatedAt'>
export type UpdatePurchaseInput = Partial<CreatePurchaseInput>
export type CreateWarrantyInput = Omit<Warranty, 'id' | 'userId' | 'createdAt' | 'updatedAt'>
export type CreateReturnPolicyInput = Omit<ReturnPolicy, 'id' | 'userId' | 'createdAt' | 'updatedAt'>
export type CreateAlertInput = Omit<Alert, 'id' | 'userId' | 'createdAt' | 'updatedAt'>
