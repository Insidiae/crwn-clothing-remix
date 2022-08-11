import * as React from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";

import { CartProvider } from "./cartContext";

import type { Stripe } from "@stripe/stripe-js";

let _stripe: Stripe | null = null;
async function getStripe() {
	if (!_stripe) {
		_stripe = await loadStripe(window.ENV.STRIPE_PUBLISHABLE_KEY);
	}
	return _stripe;
}

export function AppProviders({ children }: { children: React.ReactNode }) {
	const [stripe, setStripe] = React.useState<Stripe | null>(null);

	React.useEffect(() => {
		getStripe().then((res) => setStripe(res));
	}, []);

	return stripe ? (
		<Elements stripe={stripe}>
			<CartProvider>{children}</CartProvider>
		</Elements>
	) : null;
}
