import CheckoutItem from "~/components/CheckoutItem";

import { useCart } from "~/context/cartContext";

export default function Checkout() {
	const { cartItems, cartTotal } = useCart();

	return (
		<div className="w-full min-h-[90vh] mt-12 mx-auto mb-0 flex flex-col items-center xs:w-4/5 lg:w-7/12">
			<div className="w-full py-2 px-0 border-b border-b-gray-600 flex justify-between">
				<div className="w-[23%] capitalize">
					<span>Product</span>
				</div>
				<div className="w-[23%] capitalize">
					<span>Description</span>
				</div>
				<div className="w-[23%] capitalize">
					<span>Quantity</span>
				</div>
				<div className="w-[23%] capitalize">
					<span>Price</span>
				</div>
				<div className="w-[8%] capitalize">
					<span>Remove</span>
				</div>
			</div>

			{cartItems.map((cartItem) => (
				<CheckoutItem key={cartItem.id} cartItem={cartItem} />
			))}

			<span className="mt-7 ml-auto text-4xl">Total: ${cartTotal}</span>

			{/* TODO */}
			{/* <PaymentForm /> */}
		</div>
	);
}
