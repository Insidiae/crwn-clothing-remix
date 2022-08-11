import { json, redirect } from "@remix-run/node";
import {
	Links,
	LiveReload,
	Meta,
	Scripts,
	ScrollRestoration,
	useLoaderData,
} from "@remix-run/react";

import AppRoot from "./components/AppRoot";

import { getEnv } from "./env.server";

import {
	getCurrentUser,
	createUserDocumentFromAuth,
	signOutUser,
} from "./utils/firebase";

import type { MetaFunction, ActionArgs } from "@remix-run/node";
import type { QueryDocumentSnapshot } from "firebase/firestore";
import type { UserData } from "./utils/firebase";

import styles from "./styles/tailwind.css";

export function links() {
	return [
		{ rel: "preconnect", href: "https://fonts.googleapis.com" },
		{
			rel: "preconnect",
			href: "https://fonts.gstatic.com",
			crossOrigin: "true",
		},
		{
			rel: "stylesheet",
			href: "https://fonts.googleapis.com/css2?family=Open+Sans+Condensed:wght@300&display=swap",
		},
		{ rel: "stylesheet", href: styles },
	];
}

export const meta: MetaFunction = () => ({
	charset: "utf-8",
	title: "New Remix App",
	viewport: "width=device-width,initial-scale=1",
});

export async function loader() {
	const authUser = await getCurrentUser();

	let user: (UserData & { id: string }) | null = null;

	if (authUser) {
		const userSnapshot = (await createUserDocumentFromAuth(
			authUser
		)) as QueryDocumentSnapshot<UserData>;

		user = {
			id: userSnapshot.id,
			...userSnapshot.data(),
		};
	}

	return json({
		user,
		ENV: getEnv(),
	});
}

export async function action({ request }: ActionArgs) {
	const formData = await request.formData();
	const intent = formData.get("intent");

	if (intent === "sign-out") {
		await signOutUser();
	}

	return redirect("/");
}

export default function App() {
	const { ENV } = useLoaderData<typeof loader>();

	return (
		<html lang="en">
			<head>
				<Meta />
				<Links />
			</head>
			<body>
				<AppRoot />
				<ScrollRestoration />
				<Scripts />
				<script
					dangerouslySetInnerHTML={{
						__html: `window.ENV = ${JSON.stringify(ENV)}`,
					}}
				/>
				<LiveReload />
			</body>
		</html>
	);
}
