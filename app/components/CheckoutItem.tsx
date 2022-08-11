import { useCart } from "~/context/cartContext";

import type { CartItem } from "~/context/cartContext";

export default function CheckoutItem({ cartItem }: { cartItem: CartItem }) {
	const { reduceItemFromCart, addItemToCart, removeItemFromCart } = useCart();

	function handleDecrementItem() {
		reduceItemFromCart(cartItem);
	}

	function handleAddItem() {
		addItemToCart(cartItem);
	}

	function handleRemoveItem() {
		removeItemFromCart(cartItem);
	}

	return (
		<div className="w-full min-h-[100px] py-4 border-b border-b-gray-600 flex items-center text-xl">
			<div className="w-[23%] pr-4">
				<img
					src={cartItem.imageUrl}
					alt={cartItem.name}
					className="w-full h-full aspect-square object-cover"
				/>
			</div>
			<span className="w-[23%]"> {cartItem.name} </span>
			<span className="w-[23%] flex">
				<div className="cursor-pointer" onClick={handleDecrementItem}>
					&#10094;
				</div>
				<span className="my-0 mx-2">{cartItem.quantity}</span>
				<div className="cursor-pointer" onClick={handleAddItem}>
					&#10095;
				</div>
			</span>
			<span className="w-[23%]"> {cartItem.price}</span>
			<div
				className="pl-3 font-bold cursor-pointer hover:text-red-600"
				onClick={handleRemoveItem}
			>
				&#10005;
			</div>
		</div>
	);
}
