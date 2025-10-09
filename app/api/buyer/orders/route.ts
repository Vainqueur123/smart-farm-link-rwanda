import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-options';
import { Order } from '@/lib/types';

// Mock database - replace with actual database calls
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // In a real app, you would fetch orders from your database
    // const orders = await db.orders.findMany({
    //   where: { buyerId: session.user.id },
    //   include: { items: true }
    // });

    // Mock data for demo
    const mockOrders: Order[] = [
      {
        id: "1",
        buyerId: session.user.id,
        sellerId: "farmer-1",
        items: [
          {
            productId: "1",
            productName: "Fresh Tomatoes",
            quantity: 10,
            unit: "kg",
            pricePerUnit: 800,
            totalPrice: 8000,
            imageUrl: "/images/tomatoes.png"
          }
        ],
        totalAmount: 8000,
        currency: "RWF",
        status: "delivered",
        paymentStatus: "paid",
        paymentMethod: "mtn_momo",
        deliveryAddress: {
          district: "Kicukiro",
          address: "Kigali, Rwanda",
          contactPhone: session.user.phone || ""
        },
        deliveryMethod: "delivery",
        estimatedDelivery: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        actualDelivery: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
        createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
        updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000)
      }
    ];

    return NextResponse.json({ orders: mockOrders });
  } catch (error) {
    console.error('Error fetching orders:', error);
    return NextResponse.json(
      { error: 'Failed to fetch orders' },
      { status: 500 }
    );
  }
}
