import { useCart } from "~/context/cartContext";

import ShoppingBagIcon from "./ShoppingBagIcon";

export default function CartIcon() {
	const { cartCount, setIsCartOpen } = useCart();

	function toggleCart() {
		setIsCartOpen((prevState) => !prevState);
	}

	return (
		<div
			className="relative w-11 h-11 flex justify-center items-center cursor-pointer"
			onClick={toggleCart}
		>
			<ShoppingBagIcon className="w-6 h-6" />
			<span className="absolute bottom-3 text-xs font-bold">{cartCount}</span>
		</div>
	);
}
