import * as React from "react";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";

import CheckoutItem from "~/components/CheckoutItem";
import Button from "~/components/Button";

import { useCart } from "~/context/cartContext";

import { useOptionalUser } from "~/utils/utils";
import type { StripeCardElement } from "@stripe/stripe-js";

const isValidCardElement = (
	card: StripeCardElement | null
): card is StripeCardElement => card !== null;

export default function Checkout() {
	const stripe = useStripe();
	const elements = useElements();

	const currentUser = useOptionalUser();

	const { cartItems, cartTotal } = useCart();

	const [isProcessingPayment, setIsProcessingPayment] = React.useState(false);

	async function handlePayment(event: React.FormEvent<HTMLFormElement>) {
		event.preventDefault();

		if (stripe && elements) {
			setIsProcessingPayment(true);

			//TODO: Convert this to a `useFetcher()` call, and use a Remix action instead of the Netlify function
			const response = await fetch(
				"/.netlify/functions/create-payment-intent",
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({
						//? Convert dollars to cents
						amount: cartTotal * 100,
					}),
				}
			).then((res) => res.json());

			const clientSecret = response.paymentIntent.client_secret;

			const cardDetails = elements.getElement(CardElement);

			if (isValidCardElement(cardDetails)) {
				const paymentResult = await stripe.confirmCardPayment(clientSecret, {
					payment_method: {
						card: cardDetails,
						billing_details: {
							name: currentUser?.displayName || "Guest User",
						},
					},
				});

				setIsProcessingPayment(false);

				if (paymentResult.error) {
					alert(paymentResult.error);
				} else if (paymentResult.paymentIntent.status === "succeeded") {
					alert("Payment Succeeded!");
				}
			}
		}
	}

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

			{/* <PaymentForm /> */}
			<div className="h-72 flex flex-col justify-center items-center">
				<form
					method="POST"
					className="w-72 h-24 sm:min-w-[500px]"
					onSubmit={handlePayment}
				>
					<h2 className="my-2 mx-0 text-xl font-bold">Credit Card Payment: </h2>
					<CardElement />
					<Button
						theme="inverted"
						className="ml-auto mt-7"
						disabled={isProcessingPayment}
					>
						Pay Now
					</Button>
				</form>
			</div>
		</div>
	);
}
