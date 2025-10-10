# Order Tracking Implementation

## Overview
This document describes the order increment and tracking system implemented for the Smart Farm Link Rwanda platform.

## Features Implemented

### 1. Order Increment on "Proceed to Buy"
**Location**: `app/checkout/page.tsx`

When a buyer clicks "Place Order" on the checkout page:
- The system calls `/api/orders` with `merge: true`
- If the buyer has an existing pending/processing order for the same product, the quantity is incremented
- If no matching order exists, a new order is created
- The order count increases by 1 for each purchase

**Key Implementation Details**:
- Quantity increment: Adds 1 unit to existing order
- Status check: Only merges with orders in "pending" or "processing" status
- Product matching: Checks if the product ID matches the first item in existing orders
- Total recalculation: Automatically updates order total when quantity changes

### 2. Order Merge Logic
**Location**: `app/api/orders/route.ts`

The API endpoint supports merging orders:
```typescript
{
  buyerId: string,
  farmerId: string,
  productId: string,
  quantity: number,
  address: string,
  totalAmount: number,
  merge: true  // Enable merge/increment behavior
}
```

**Merge Algorithm**:
1. Fetch all buyer's orders from the index
2. Loop through orders to find a match:
   - Status must be "pending" or "processing"
   - Product ID must match
3. If found:
   - Increment quantity
   - Recalculate totals
   - Update `updatedAt` timestamp
4. If not found:
   - Create a new order

### 3. Order Status Tracking
**Location**: `app/api/orders/[id]/status/route.ts`

Sellers/admins can update order status via PATCH request:
```typescript
PATCH /api/orders/{orderId}/status
{
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled",
  estimatedDelivery?: string,
  actualDelivery?: string,
  trackingNotes?: string
}
```

**Status Flow**:
- **PENDING**: Order placed, awaiting confirmation
- **PROCESSING**: Order confirmed, being prepared
- **SHIPPED**: Order dispatched for delivery
- **DELIVERED**: Order successfully delivered
- **CANCELLED**: Order cancelled

**Auto-timestamps**:
- When status changes to "delivered", `actualDelivery` is automatically set to current time if not provided

### 4. Buyer Order Tracking UI
**Location**: `components/order-tracking.tsx`

Visual timeline showing order progress:
- **Status Icons**: Package → Clock → Truck → CheckCircle
- **Progress Bar**: Visual indicator connecting status steps
- **Delivery Info**: Shows delivery address and estimated/actual delivery dates
- **Order Items**: Lists all products with quantities and prices
- **Tracking Notes**: Displays seller notes about the order
- **Actions**: Contact seller, leave review (when delivered)

### 5. Order Tracking Page
**Location**: `app/orders/[id]/page.tsx`

Dedicated page for viewing detailed order tracking:
- Accessible via `/orders/{orderId}`
- Shows full OrderTracking component
- Back button to return to dashboard
- Integrated with DashboardLayout

### 6. Buyer Dashboard Integration
**Location**: `components/buyer/buyer-dashboard-content.tsx`

The buyer dashboard displays:
- **Order Statistics**: Total spent, total orders, delivered count
- **Recent Orders**: List of all orders with status badges
- **Quick Actions**:
  - View Details → Links to `/orders/{orderId}`
  - Contact Seller → Opens messaging
  - Reorder → Adds items back to cart (for delivered orders)

## API Endpoints

### Create/Increment Order
```
POST /api/orders
Body: {
  buyerId, farmerId, productId, quantity, address,
  totalAmount, currency, merge
}
Response: { order }
```

### Get Order by ID
```
GET /api/orders/{id}
Response: { order }
```

### Get Buyer's Orders
```
GET /api/orders/buyer/{buyerId}
Response: { orders: [] }
```

### Update Order Status
```
PATCH /api/orders/{id}/status
Body: { status, estimatedDelivery?, actualDelivery?, trackingNotes? }
Response: { order }
```

## Database Schema

### Order Document Structure
```typescript
{
  id: string
  buyerId: string
  sellerId: string
  items: OrderItem[]
  totalAmount: number
  currency: "RWF"
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled"
  paymentStatus: "pending" | "paid" | "failed"
  paymentMethod: string
  deliveryAddress: string
  deliveryMethod: "delivery" | "pickup"
  estimatedDelivery?: Date
  actualDelivery?: Date
  trackingNotes?: string
  createdAt: Date
  updatedAt: Date
}
```

### Order Indexes
- `orders_by_buyer/{buyerId}`: { orderIds: string[] }
- `orders_by_seller/{sellerId}`: { orderIds: string[] }

## User Flow

### Buyer Journey
1. **Browse Products** → Marketplace
2. **Add to Cart** → Select products
3. **Checkout** → Enter delivery info
4. **Place Order** → Click "Proceed to Buy"
   - Order created or quantity incremented
   - Redirected to dashboard
5. **Track Order** → View status in dashboard
6. **View Details** → Click "View Details" for timeline
7. **Receive Delivery** → Status updates to "delivered"
8. **Leave Review** → Optional feedback

### Seller Journey
1. **Receive Order** → Notification of new order
2. **Confirm Order** → Update status to "processing"
3. **Prepare Items** → Package products
4. **Ship Order** → Update status to "shipped"
   - Add estimated delivery date
   - Add tracking notes
5. **Confirm Delivery** → Update status to "delivered"

## Testing Scenarios

### Test 1: New Order
1. Login as buyer
2. Go to checkout page
3. Fill delivery info
4. Click "Place Order"
5. Verify order created in dashboard

### Test 2: Order Increment
1. Place first order for Product A
2. Go back to checkout
3. Place second order for Product A
4. Verify quantity incremented (not new order)

### Test 3: Order Tracking
1. Place an order
2. Click "View Details" in dashboard
3. Verify tracking timeline shows "Pending"
4. Update status via API to "shipped"
5. Refresh page, verify timeline updated

### Test 4: Status Updates
1. Create order via API
2. PATCH status to "processing"
3. PATCH status to "shipped" with estimatedDelivery
4. PATCH status to "delivered"
5. Verify actualDelivery auto-set

## Future Enhancements

1. **Real-time Updates**: WebSocket/polling for live status changes
2. **SMS Notifications**: Alert buyers on status changes
3. **Email Notifications**: Send tracking updates via email
4. **GPS Tracking**: Integrate delivery driver location
5. **Photo Proof**: Upload delivery confirmation photos
6. **Rating System**: Allow buyers to rate orders
7. **Return/Refund**: Handle order returns and refunds
8. **Bulk Orders**: Support multiple products in one order
9. **Scheduled Delivery**: Allow buyers to choose delivery time slots
10. **Delivery Partners**: Integrate with third-party delivery services

## Configuration

### Environment Variables
None required for basic functionality (uses mock Firebase).

### Feature Flags
- `ENABLE_ORDER_MERGE`: true (default)
- `AUTO_DELIVERY_TIMESTAMP`: true (default)

## Troubleshooting

### Order not incrementing
- Check `merge: true` is set in request body
- Verify existing order status is "pending" or "processing"
- Confirm product IDs match exactly

### Tracking page not loading
- Verify order ID is valid
- Check `/api/orders/{id}` endpoint returns data
- Ensure user is authenticated

### Status not updating
- Confirm PATCH request format is correct
- Check order exists in database
- Verify status value is valid enum

## Support
For issues or questions, contact the development team or refer to the main project documentation.
