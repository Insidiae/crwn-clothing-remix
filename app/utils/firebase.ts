// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {
	getAuth,
	signInWithRedirect,
	signInWithPopup,
	signInWithCredential,
	GoogleAuthProvider,
	createUserWithEmailAndPassword,
	signInWithEmailAndPassword,
	signOut,
	onAuthStateChanged,
} from "firebase/auth";
import {
	getFirestore,
	doc,
	getDoc,
	setDoc,
	collection,
	writeBatch,
	query,
	getDocs,
} from "firebase/firestore";

import type { User, NextOrObserver, AuthCredential } from "firebase/auth";
import type { DocumentData, QueryDocumentSnapshot } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
	apiKey: "AIzaSyD9DbPHJhCOH9GyMYNsM_CzhDUS2f-zbGw",
	authDomain: "crwn-db-aae4d.firebaseapp.com",
	projectId: "crwn-db-aae4d",
	storageBucket: "crwn-db-aae4d.appspot.com",
	messagingSenderId: "463251593089",
	appId: "1:463251593089:web:1eaeff8a52f38bfe23ba80",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
	prompt: "select_account",
});

export const auth = getAuth();
export const signInWithGooglePopup = () =>
	signInWithPopup(auth, googleProvider);
export const signInWithGoogleRedirect = () =>
	signInWithRedirect(auth, googleProvider);
export const signInWithGoogleCredential = (credential: AuthCredential) =>
	signInWithCredential(auth, credential);

export const db = getFirestore();

export async function addCollectionAndDocuments<
	CollectionType extends DocumentData
>(collectionKey: string, objectsToAdd: CollectionType[]) {
	const collectionRef = collection(db, collectionKey);
	const batch = writeBatch(db);

	objectsToAdd.forEach((object) => {
		const docRef = doc(collectionRef, object.title.toLowerCase());

		batch.set(docRef, object);
	});

	await batch.commit();
}

export type CategoryItem = {
	id: number;
	imageUrl: string;
	name: string;
	price: number;
};

export type Category = {
	title: string;
	imageUrl: string;
	items: CategoryItem[];
};

export type CategoriesMap = {
	[key: string]: Category;
};

export async function getCategoriesAndDocuments(): Promise<Category[]> {
	const collectionRef = collection(db, "categories");
	const categoriesQuery = query(collectionRef);

	const querySnapshot = await getDocs(categoriesQuery);

	return querySnapshot.docs.map(
		(docSnapshot) => docSnapshot.data() as Category
	);
}

export type AdditionalInformation = {
	displayName?: string;
};

export type UserData = {
	createdAt: Date;
	displayName: string;
	email: string;
};

export type { User };

export async function createUserDocumentFromAuth(
	authUser: User,
	additionalInformation: AdditionalInformation = {}
): Promise<QueryDocumentSnapshot<UserData> | void> {
	if (authUser) {
		const userDocRef = doc(db, "users", authUser.uid);

		const userSnapshot = await getDoc(userDocRef);

		if (!userSnapshot.exists()) {
			const { displayName, email } = authUser;
			const createdAt = new Date();

			try {
				await setDoc(userDocRef, {
					displayName,
					email,
					createdAt,
					...additionalInformation,
				});
			} catch (err) {
				console.error("Error creating user:", err);
			}
		}

		return userSnapshot as QueryDocumentSnapshot<UserData>;
	}
}

export async function createAuthUserWithEmailAndPassword(
	email: string,
	password: string
) {
	if (email && password) {
		return createUserWithEmailAndPassword(auth, email, password);
	}
}

export async function signInAuthUserWithEmailAndPassword(
	email: string,
	password: string
) {
	if (email && password) {
		return signInWithEmailAndPassword(auth, email, password);
	}
}

export async function signOutUser() {
	await signOut(auth);
}

export const onAuthStateChangedListener = (callback: NextOrObserver<User>) =>
	onAuthStateChanged(auth, callback);

export function getCurrentUser(): Promise<User | null> {
	return new Promise((resolve, reject) => {
		const unsubscribe = onAuthStateChanged(
			auth,
			(authUser) => {
				unsubscribe();
				resolve(authUser);
			},
			reject
		);
	});
}
