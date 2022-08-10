import { Link } from "@remix-run/react";
import CartItem from "./CartItem";

export default function CartDropdown() {
	const cartItems = [];

	return (
		<div className="absolute top-24 right-10 w-60 h-[340px] p-5 border border-black bg-white flex flex-col z-[5]">
			<div className="h-60 flex flex-col overflow-scroll">
				{cartItems.length ? (
					cartItems.map((cartItem) => (
						<CartItem key={cartItem.id} cartItem={cartItem} />
					))
				) : (
					<span className="my-12 mx-auto text-lg">Your cart is empty</span>
				)}
			</div>
			<Link
				to="/checkout"
				className="min-w-[10rem] w-auto mt-auto h-12 py-0 px-9 border border-black flex justify-center items-center bg-white text-black text-base font-bold uppercase tracking-[0.5px] cursor-pointer transition hover:border-transparent hover:bg-black hover:text-white"
			>
				Go to Checkout
			</Link>
		</div>
	);
}
