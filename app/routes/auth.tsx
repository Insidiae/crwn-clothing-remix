import { json, redirect } from "@remix-run/node";
import { useActionData, useSubmit, useTransition } from "@remix-run/react";
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
	createAuthUserWithEmailAndPassword,
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

type AuthErrors = {
	emailSignIn?: FirebaseError;
	googleSignIn?: FirebaseError;
	signUp?: FirebaseError;
};
export async function action({ request }: ActionArgs) {
	const formData = await request.formData();
	const intent = formData.get("intent");

	if (intent === "email-sign-in") {
		const email = formData.get("email");
		const password = formData.get("password");

		invariant(typeof email === "string" && email.length, "Email is required");
		invariant(
			typeof password === "string" && password.length,
			"Password is required"
		);

		try {
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
		} catch (error) {
			if (error instanceof FirebaseError) {
				return json<AuthErrors>({ emailSignIn: error });
			}
		}
	}

	if (intent === "google-sign-in") {
		const idToken = formData.get("idToken");
		invariant(
			typeof idToken === "string" && idToken.length,
			"Please proceed with Google Sign In"
		);

		try {
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
		} catch (error) {
			if (error instanceof FirebaseError) {
				return json<AuthErrors>({ googleSignIn: error });
			}
		}
	}

	if (intent === "sign-up") {
		const email = formData.get("email");
		const password = formData.get("password");
		const displayName = formData.get("displayName");

		invariant(typeof email === "string" && email.length, "Email is required");
		invariant(
			typeof password === "string" && password.length,
			"Password is required"
		);
		invariant(
			typeof displayName === "string" && displayName.length,
			"Display Name is required"
		);

		try {
			const userCredential = await createAuthUserWithEmailAndPassword(
				email,
				password
			);

			if (userCredential) {
				const { user } = userCredential;

				const userSnapshot = (await createUserDocumentFromAuth(user, {
					displayName,
				})) as QueryDocumentSnapshot<UserData>;

				// return { id: userSnapshot.id, ...userSnapshot.data() };
				return redirect("/");
			}
		} catch (error) {
			if (error instanceof FirebaseError) {
				return json<AuthErrors>({ signUp: error });
			}
		}
	}

	return null;
}

export default function AuthenticationRoute() {
	const errors = useActionData<AuthErrors>();
	const submit = useSubmit();
	const transition = useTransition();

	//? We can also narrow down the submission state via the `intent` value,
	//? but for now let's just disable all buttons when any form submits
	const isSubmitting = transition.state === "submitting";

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

	function handleConfirmPassword(event: React.FormEvent<HTMLFormElement>) {
		event.preventDefault();
		const form = event.currentTarget;

		const password = form.password.value;
		const confirmPassword = form.confirmPassword.value;

		if (password === confirmPassword) {
			const formData = new FormData(form);
			formData.set("intent", "sign-up");
			submit(formData, { method: "post" });
		} else {
			alert("Passwords do not match!");
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
					{errors?.emailSignIn ? (
						<p className="my-6 text-red-500 text-lg">
							Incorrect Email/Password.
						</p>
					) : null}
					{errors?.googleSignIn ? (
						<p className="my-6 text-red-500 text-lg">
							There was an error in Google Sign in.
						</p>
					) : null}
				</form>
				<form
					method="post"
					className="flex justify-between"
					onSubmit={handleGoogleSignInPopup}
				>
					<Button
						form="email-sign-in"
						name="intent"
						value="email-sign-in"
						disabled={isSubmitting}
					>
						Sign in
					</Button>
					<Button
						theme="google"
						name="intent"
						value="google-sign-in"
						disabled={isSubmitting}
					>
						Sign in with Google
					</Button>
				</form>
			</div>
			{/* <SignUpForm /> */}

			<div className="w-96 flex flex-col">
				<h2 className="my-2 mx-0 text-xl font-bold">
					Don&apos;t have an account?
				</h2>
				<span>Sign up with your email and password</span>

				<form method="POST" id="sign-up" onSubmit={handleConfirmPassword}>
					<FormInput
						required
						type="text"
						name="displayName"
						id="signup-display-name"
						label="Display Name"
					/>
					<FormInput
						required
						type="email"
						name="email"
						id="signup-email"
						label="Email"
					/>
					<FormInput
						required
						type="password"
						name="password"
						id="signup-password"
						label="Password"
					/>
					<FormInput
						required
						type="password"
						name="confirmPassword"
						id="signup-confirm-password"
						label="Confirm Password"
					/>

					{errors?.signUp ? (
						<p className="my-6 text-red-500 text-lg">
							{errors.signUp.code === AuthErrorCodes.EMAIL_EXISTS
								? "Email already in use!"
								: "There was a problem signing up."}
						</p>
					) : null}

					<div className="flex justify-between">
						<Button
							type="submit"
							name="intent"
							value="sign-up"
							disabled={isSubmitting}
						>
							Sign up
						</Button>
					</div>
				</form>
			</div>
		</div>
	);
}
