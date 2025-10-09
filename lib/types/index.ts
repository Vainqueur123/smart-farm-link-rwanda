export type PaymentMethod = 'mobile_money' | 'credit_card' | 'bank_transfer';

export type ProductCategory = 'vegetables' | 'fruits' | 'grains' | 'dairy' | 'meat' | 'other';

export interface BaseProduct {
  id: string;
  name: string;
  description: string;
  pricePerKg: number;
  imageUrl: string;
  rating: number;
  reviewCount: number;
  category: 'vegetables' | 'fruits' | 'grains' | 'dairy' | 'meat' | 'other';
  unit: 'kg' | 'g' | 'piece' | 'bunch';
  availableQuantity: number;
  sellerId: string;
  sellerName: string;
  createdAt: Date | string;
  updatedAt: Date | string;
}

export interface Product extends BaseProduct {
  id: string;
  sellerId: string;
  sellerName: string;
  createdAt: string;
  updatedAt: string;
}

export interface OrderItem {
  id: string;
  orderId: string;
  productId: string;
  productName: string;
  quantity: number;
  unit: string;
  pricePerUnit: number;
  totalPrice: number;
  imageUrl?: string;
  category: 'vegetables' | 'fruits' | 'grains' | 'dairy' | 'meat' | 'other';
}

export interface Order {
  id: string;
  buyerId: string;
  sellerId: string;
  items: OrderItem[];
  totalAmount: number;
  currency: string;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
  paymentMethod: PaymentMethod;
  deliveryAddress: {
    district: string;
    address: string;
    contactPhone: string;
  };
  deliveryMethod: 'pickup' | 'delivery';
  estimatedDelivery: Date | string;
  actualDelivery?: Date | string;
  createdAt: Date | string;
  updatedAt: Date | string;
}

export interface ApiResponse<T = any> {
  data?: T;
  error?: string;
  success: boolean;
  message?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: 'admin' | 'buyer' | 'farmer';
  isActive: boolean;
  isVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
  lastLoginAt?: Date;
}

