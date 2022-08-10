import { json, redirect } from "@remix-run/node";
import { useSubmit } from "@remix-run/react";
import { FirebaseError } from "firebase/app";
import { GoogleAuthProvider, AuthErrorCodes } from "firebase/auth";
import invariant from "tiny-invariant";

import Button from "~/components/Button";
import FormInput from "~/components/FormInput";

import {
	getCurrentUser,
	signInAuthUserWithEmailAndPassword,
	signInWithGooglePopup,
	signInWithGoogleCredential,
	createUserDocumentFromAuth,
} from "~/utils/firebase";

import type { ActionArgs } from "@remix-run/node";
import type { QueryDocumentSnapshot } from "firebase/firestore";
import type { UserData } from "~/utils/firebase";
import React from "react";

export async function loader() {
	const authUser = await getCurrentUser();

	if (authUser) {
		return redirect("/");
	}

	return json({});
}

export async function action({ request }: ActionArgs) {
	const formData = await request.formData();
	const intent = formData.get("intent");

	if (intent === "email-sign-in") {
		const email = formData.get("email");
		const password = formData.get("password");

		invariant(typeof email === "string", "Email is required");
		invariant(typeof password === "string", "Password is required");

		const userCredential = await signInAuthUserWithEmailAndPassword(
			email,
			password
		);

		if (userCredential) {
			const { user } = userCredential;

			const userSnapshot = (await createUserDocumentFromAuth(
				user
			)) as QueryDocumentSnapshot<UserData>;

			//? Seems like the firebase sign-in methods already handles
			//? setting the currentUser session automatically?
			// return { id: userSnapshot.id, ...userSnapshot.data() };
			return redirect("/");
		}
	}

	if (intent === "google-sign-in") {
		const idToken = formData.get("idToken");
		invariant(
			typeof idToken === "string" && idToken.length,
			"Please proceed with Google Sign In"
		);

		const credential = GoogleAuthProvider.credential(idToken);

		const userCredential = await signInWithGoogleCredential(credential);

		if (userCredential) {
			const { user } = userCredential;

			const userSnapshot = (await createUserDocumentFromAuth(
				user
			)) as QueryDocumentSnapshot<UserData>;

			// return { id: userSnapshot.id, ...userSnapshot.data() };
			return redirect("/");
		}
	}

	return null;
}

export default function AuthenticationRoute() {
	const submit = useSubmit();

	async function handleGoogleSignInPopup(
		event: React.FormEvent<HTMLFormElement>
	) {
		event.preventDefault();
		try {
			const form = event.currentTarget;

			const res = await signInWithGooglePopup();

			const credential = GoogleAuthProvider.credentialFromResult(res);
			const idToken = credential?.idToken;

			const formData = new FormData(form);
			formData.set("intent", "google-sign-in");
			formData.set("idToken", idToken ?? "");

			submit(formData, { method: "post" });
		} catch (error) {
			if (
				error instanceof FirebaseError &&
				error.code === AuthErrorCodes.POPUP_CLOSED_BY_USER
			) {
				// do nothing, user just closed the popup
			} else {
				console.error(error);
			}
		}
	}

	return (
		<div className="w-[900px] my-8 mx-auto flex justify-between">
			{/* <SignInForm /> */}
			<div className="w-96 flex flex-col">
				<h2 className="my-2 mx-0 text-xl font-bold">
					Already have an account?
				</h2>
				<span>Sign in with your email and password</span>

				<form method="POST" id="email-sign-in">
					<FormInput
						required
						type="email"
						name="email"
						id="signin-email"
						label="Email"
					/>
					<FormInput
						required
						type="password"
						name="password"
						id="signin-password"
						label="Password"
					/>
				</form>
				<form
					method="post"
					className="flex justify-between"
					onSubmit={handleGoogleSignInPopup}
				>
					<Button form="email-sign-in" name="intent" value="email-sign-in">
						Sign in
					</Button>
					<Button theme="google" name="intent" value="google-sign-in">
						Sign in with Google
					</Button>
				</form>
			</div>
			{/* <SignUpForm /> */}
		</div>
	);
}
