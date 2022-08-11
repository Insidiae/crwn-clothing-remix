import dotenv from "dotenv";
import Stripe from "stripe";

import type { Handler } from "@netlify/functions";

dotenv.config();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
	apiVersion: "2022-08-01",
});

const handler: Handler = async (event) => {
	try {
		const { amount } = JSON.parse(event.body as string);

		const paymentIntent = await stripe.paymentIntents.create({
			amount,
			currency: "USD",
			payment_method_types: ["card"],
		});

		return {
			statusCode: 200,
			body: JSON.stringify({ paymentIntent }),
		};
	} catch (error) {
		console.error({ error });

		return {
			statusCode: 400,
			body: JSON.stringify({ error }),
		};
	}
};

export { handler };
