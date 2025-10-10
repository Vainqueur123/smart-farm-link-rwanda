"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { useAuth } from "@/lib/auth-context"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ShoppingCart, MapPin, Truck, CheckCircle, Package } from "lucide-react"

interface CartItem {
	id: string
	name: string
	quantity: number
	pricePerUnit: number
	unit: string
	imageUrl?: string
}

export default function CheckoutPage() {
	const router = useRouter()
	const { user, buyerProfile } = useAuth()
	const [isProcessing, setIsProcessing] = useState(false)
	const [orderPlaced, setOrderPlaced] = useState(false)
	
	const [cartItems] = useState<CartItem[]>([
		{
			id: "1",
			name: "Fresh Tomatoes",
			quantity: 5,
			pricePerUnit: 800,
			unit: "kg",
			imageUrl: "/images/tomatoes.png"
		},
		{
			id: "2",
			name: "Irish Potatoes",
			quantity: 10,
			pricePerUnit: 600,
			unit: "kg",
			imageUrl: "/images/irish_potato.jpg"
		}
	])

	const [deliveryInfo, setDeliveryInfo] = useState({
		district: buyerProfile?.location?.district || "",
		address: buyerProfile?.location?.address || "",
		phone: buyerProfile?.phone || user?.phone || ""
	})

	const [paymentMethod, setPaymentMethod] = useState("mtn_momo")
	const [deliveryMethod, setDeliveryMethod] = useState("delivery")

	const subtotal = cartItems.reduce((sum, item) => sum + (item.quantity * item.pricePerUnit), 0)
	const deliveryFee = deliveryMethod === "delivery" ? 2000 : 0
	const total = subtotal + deliveryFee

	const handlePlaceOrder = async () => {
		setIsProcessing(true)
		try {
			const item = cartItems[0]
			if (!item || !user) throw new Error("Missing item or user")
			const body = {
				buyerId: user.id,
				farmerId: "seller-1",
				productId: item.id,
				quantity: 1,
				address: `${deliveryInfo.district} - ${deliveryInfo.address} (${deliveryInfo.phone})`,
				notes: null,
				totalAmount: item.pricePerUnit * 1,
				currency: "RWF",
				merge: true,
			}
			const res = await fetch('/api/orders', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(body)
			})
			if (!res.ok) throw new Error('Failed to place order')
			setOrderPlaced(true)
		} catch (e) {
			console.error(e)
			alert('Could not place order. Please try again.')
		} finally {
			setIsProcessing(false)
			setTimeout(() => router.push("/buyer-dashboard"), 2000)
		}
	}

	if (orderPlaced) {
		return (
			<div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-emerald-100 p-4">
				<Card className="w-full max-w-md text-center">
					<CardHeader>
						<div className="mx-auto mb-4 w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
							<CheckCircle className="h-10 w-10 text-green-600" />
						</div>
						<CardTitle className="text-2xl">Order Placed Successfully!</CardTitle>
						<CardDescription>
							Your order has been confirmed and will be processed soon.
						</CardDescription>
					</CardHeader>
					<CardContent>
						<div className="space-y-3 text-left bg-gray-50 p-4 rounded-lg mb-4">
							<div className="flex justify-between">
								<span className="text-gray-600">Order Total:</span>
								<span className="font-bold">RWF {total.toLocaleString()}</span>
							</div>
							<div className="flex justify-between">
								<span className="text-gray-600">Payment Method:</span>
								<span className="font-medium">{paymentMethod.replace('_', ' ').toUpperCase()}</span>
							</div>
							<div className="flex justify-between">
								<span className="text-gray-600">Delivery:</span>
								<span className="font-medium capitalize">{deliveryMethod}</span>
							</div>
						</div>
						<p className="text-sm text-gray-600 mb-4">
							Redirecting to your dashboard...
						</p>
						<Button onClick={() => router.push("/buyer-dashboard")} className="w-full">
							Go to Dashboard
						</Button>
					</CardContent>
				</Card>
			</div>
		)
	}

	return (
		<div className="min-h-screen bg-gray-50 py-8 px-4">
			<div className="max-w-6xl mx-auto">
				<div className="mb-6">
					<h1 className="text-3xl font-bold">Checkout</h1>
					<p className="text-gray-600">Complete your order</p>
				</div>

				<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
					<div className="lg:col-span-2 space-y-6">
						<Card>
							<CardHeader>
								<CardTitle className="flex items-center">
									<MapPin className="h-5 w-5 mr-2" />
									Delivery Information
								</CardTitle>
							</CardHeader>
							<CardContent className="space-y-4">
								<div>
									<Label htmlFor="district">District</Label>
									<Input
										id="district"
										value={deliveryInfo.district}
										onChange={(e) => setDeliveryInfo({...deliveryInfo, district: e.target.value})}
										placeholder="Enter your district"
									/>
								</div>
								<div>
									<Label htmlFor="address">Full Address</Label>
									<Input
										id="address"
										value={deliveryInfo.address}
										onChange={(e) => setDeliveryInfo({...deliveryInfo, address: e.target.value})}
										placeholder="Street, house number, landmarks"
									/>
								</div>
								<div>
									<Label htmlFor="phone">Contact Phone</Label>
									<Input
										id="phone"
										value={deliveryInfo.phone}
										onChange={(e) => setDeliveryInfo({...deliveryInfo, phone: e.target.value})}
										placeholder="07XXXXXXXX"
									/>
								</div>
							</CardContent>
						</Card>

						<Card>
							<CardHeader>
								<CardTitle className="flex items-center">
									<Truck className="h-5 w-5 mr-2" />
									Delivery & Payment
								</CardTitle>
							</CardHeader>
							<CardContent className="space-y-4">
								<div>
									<Label htmlFor="deliveryMethod">Delivery Method</Label>
									<Select value={deliveryMethod} onValueChange={setDeliveryMethod}>
										<SelectTrigger id="deliveryMethod">
											<SelectValue placeholder="Select delivery method" />
										</SelectTrigger>
										<SelectContent>
											<SelectItem value="delivery">Delivery</SelectItem>
											<SelectItem value="pickup">Pickup</SelectItem>
										</SelectContent>
									</Select>
								</div>
								<div>
									<Label htmlFor="paymentMethod">Payment Method</Label>
									<Select value={paymentMethod} onValueChange={setPaymentMethod}>
										<SelectTrigger id="paymentMethod">
											<SelectValue placeholder="Select payment method" />
										</SelectTrigger>
										<SelectContent>
											<SelectItem value="mtn_momo">MTN MoMo</SelectItem>
											<SelectItem value="airtel_money">Airtel Money</SelectItem>
											<SelectItem value="cash">Cash</SelectItem>
										</SelectContent>
									</Select>
								</div>
							</CardContent>
						</Card>
					</div>

					<div className="lg:col-span-1">
						<Card className="sticky top-4">
							<CardHeader>
								<CardTitle className="flex items-center">
									<ShoppingCart className="h-5 w-5 mr-2" />
									Order Summary
								</CardTitle>
							</CardHeader>
							<CardContent className="space-y-4">
								<div className="space-y-3">
									{cartItems.map((item) => (
										<div key={item.id} className="flex items-center space-x-3">
											<div className="w-12 h-12 bg-gray-100 rounded flex items-center justify-center">
												<Package className="h-6 w-6 text-gray-400" />
											</div>
											<div className="flex-1">
												<p className="font-medium text-sm">{item.name}</p>
												<p className="text-xs text-gray-500">
													{item.quantity} {item.unit} × RWF {item.pricePerUnit.toLocaleString()}
												</p>
											</div>
											<span className="font-medium">
												RWF {(item.quantity * item.pricePerUnit).toLocaleString()}
											</span>
										</div>
									))}
								</div>

								<Separator />

								<div className="space-y-2">
									<div className="flex justify-between text-sm">
										<span className="text-gray-600">Subtotal</span>
										<span className="font-medium">RWF {subtotal.toLocaleString()}</span>
									</div>
									<div className="flex justify-between text-sm">
										<span className="text-gray-600">Delivery Fee</span>
										<span className="font-medium">
											{deliveryFee === 0 ? "Free" : `RWF ${deliveryFee.toLocaleString()}`}
										</span>
									</div>
									<Separator />
									<div className="flex justify-between">
										<span className="font-bold">Total</span>
										<span className="font-bold text-lg">RWF {total.toLocaleString()}</span>
									</div>
								</div>

								<Button 
									className="w-full bg-green-600 hover:bg-green-700" 
									size="lg"
									onClick={handlePlaceOrder}
									disabled={isProcessing || !deliveryInfo.district || !deliveryInfo.address || !deliveryInfo.phone}
								>
									{isProcessing ? (
										<>
											<div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
											Processing...
										</>
									) : (
										<>
											<CheckCircle className="h-5 w-5 mr-2" />
											Place Order
										</>
									)}
								</Button>

								<p className="text-xs text-center text-gray-500">
									By placing this order, you agree to our terms and conditions
								</p>
							</CardContent>
						</Card>
					</div>
				</div>
			</div>
		</div>
	)
}
