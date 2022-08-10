import { Link } from "@remix-run/react";

import CrwnLogo from "~/components/CrwnLogo";
import CartIcon from "~/components/CartIcon";
import CartDropdown from "~/components/CartDropdown";

import { useOptionalUser } from "~/utils/utils";

export default function Navigation() {
	const currentUser = useOptionalUser();
	const isCartOpen = false;

	return (
		<div className="py-2.5 px-5 md:py-5 md:px-10">
			<div className="w-full h-14 mb-5 flex justify-between md:h-16 md:mb-6">
				<Link to="/" className="relative w-12 h-full p-0 md:w-16 md:p-6">
					<CrwnLogo />
				</Link>
				<div className="w-4/5 h-full flex justify-end items-center md:w-1/2">
					<Link to="/shop" className="py-2 px-4 uppercase cursor-pointer">
						Shop
					</Link>
					{currentUser ? (
						<form method="post">
							<button
								name="intent"
								value="sign-out"
								className="py-2 px-4 uppercase cursor-pointer"
							>
								Sign Out
							</button>
						</form>
					) : (
						<Link to="/auth" className="py-2 px-4 uppercase cursor-pointer">
							Sign In
						</Link>
					)}
					<CartIcon />
				</div>
				{isCartOpen ? <CartDropdown /> : null}
			</div>
		</div>
	);
}
