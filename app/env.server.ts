import invariant from "tiny-invariant";

export function getEnv() {
	invariant(
		process.env.STRIPE_PUBLISHABLE_KEY,
		"Please set an STRIPE_PUBLISHABLE_KEY!"
	);

	return {
		STRIPE_PUBLISHABLE_KEY: process.env.STRIPE_PUBLISHABLE_KEY,
	};
}

type ENV = ReturnType<typeof getEnv>;

declare global {
	var ENV: ENV;
	interface Window {
		ENV: ENV;
	}
}
