import ShoppingBagIcon from "./ShoppingBagIcon";

export default function CartIcon() {
	const cartCount = 0;

	function toggleCart() {
		// TODO
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
