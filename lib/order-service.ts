import { db, doc, setDoc, getDoc } from "./firebase"
import type { Order } from "./types"

const ordersPath = (id: string) => `orders/${id}`

export async function createOrder(order: Order): Promise<Order> {
	await setDoc(doc(db, ordersPath(order.id)), order)
	return order
}

export async function getOrder(id: string): Promise<Order | null> {
	const snap = await getDoc(doc(db, ordersPath(id)))
	if (snap && (snap as any).exists) {
		return (snap as any).data() as Order
	}
	return null
}

