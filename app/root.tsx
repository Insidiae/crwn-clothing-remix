import { json, redirect } from "@remix-run/node";
import {
	Links,
	LiveReload,
	Meta,
	Outlet,
	Scripts,
	ScrollRestoration,
} from "@remix-run/react";

import Navigation from "./components/Navigation";

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

	if (authUser) {
		const userSnapshot = (await createUserDocumentFromAuth(
			authUser
		)) as QueryDocumentSnapshot<UserData>;

		return json<{ user: UserData & { id: string } }>({
			user: {
				id: userSnapshot.id,
				...userSnapshot.data(),
			},
		});
	}

	return json({ user: null });
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
	return (
		<html lang="en">
			<head>
				<Meta />
				<Links />
			</head>
			<body>
				<div className="py-2.5 px-5 md:py-5 md:px-10">
					<Navigation />
					<Outlet />
				</div>

				<ScrollRestoration />
				<Scripts />
				<LiveReload />
			</body>
		</html>
	);
}
