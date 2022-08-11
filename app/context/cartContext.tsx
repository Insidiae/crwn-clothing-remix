import * as React from "react";

import type { CategoryItem } from "~/utils/firebase";

export type CartItem = CategoryItem & {
	quantity: number;
};

type CartContextValue = {
	isCartOpen: boolean;
	setIsCartOpen: React.Dispatch<React.SetStateAction<boolean>>;
	cartItems: CartItem[];
	addItemToCart: (productToAdd: CategoryItem) => void;
	reduceItemFromCart: (cartItemToReduce: CartItem) => void;
	removeItemFromCart: (cartItemToRemove: CartItem) => void;
	cartCount: number;
	cartTotal: number;
};

const CartContext = React.createContext<CartContextValue>({
	isCartOpen: false,
	setIsCartOpen: () => {},
	cartItems: [],
	addItemToCart: (productToAdd: CategoryItem) => {},
	reduceItemFromCart: (cartItemToReduce: CartItem) => {},
	removeItemFromCart: (cartItemToRemove: CartItem) => {},
	cartCount: 0,
	cartTotal: 0,
});
CartContext.displayName = "CartContext";

//? Just ported the old cartContext code from the original project for now
//? Ideally, we should be storing the cart items somewhere in Firestore as well
function CartProvider({ children }: { children: React.ReactNode }) {
	const [isCartOpen, setIsCartOpen] = React.useState(false);
	const [cartItems, setCartItems] = React.useState<CartItem[]>(() =>
		JSON.parse(window.localStorage.getItem("cartItems") ?? "[]")
	);

	React.useEffect(() => {
		window.localStorage.setItem("cartItems", JSON.stringify(cartItems));
	}, [cartItems]);

	//? https://kentcdodds.com/blog/dont-sync-state-derive-it
	const cartCount = cartItems.reduce(
		(count, cartItem) => count + cartItem.quantity,
		0
	);

	const cartTotal = cartItems.reduce(
		(currentTotal, cartItem) =>
			currentTotal + cartItem.quantity * cartItem.price,
		0
	);

	function addItemToCart(productToAdd: CategoryItem) {
		setCartItems(addCartItem(cartItems, productToAdd));
	}

	function reduceItemFromCart(cartItemToReduce: CartItem) {
		setCartItems(reduceCartItem(cartItems, cartItemToReduce));
	}

	function removeItemFromCart(cartItemToRemove: CartItem) {
		setCartItems(removeCartItem(cartItems, cartItemToRemove));
	}

	const value = {
		isCartOpen,
		setIsCartOpen,
		cartItems,
		addItemToCart,
		reduceItemFromCart,
		removeItemFromCart,
		cartCount,
		cartTotal,
	};

	return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

function addCartItem(cartItems: CartItem[], productToAdd: CategoryItem) {
	const existingCartItem = cartItems.find(
		(cartItem) => cartItem.id === productToAdd.id
	);

	if (existingCartItem) {
		return cartItems.map((cartItem) =>
			cartItem.id === productToAdd.id
				? { ...cartItem, quantity: cartItem.quantity + 1 }
				: cartItem
		);
	}

	return [...cartItems, { ...productToAdd, quantity: 1 }];
}

function reduceCartItem(cartItems: CartItem[], cartItemToReduce: CartItem) {
	const existingCartItem = cartItems.find(
		(cartItem) => cartItem.id === cartItemToReduce.id
	);

	if (existingCartItem?.quantity === 1) {
		return cartItems.filter((cartItem) => cartItem.id !== cartItemToReduce.id);
	}

	return cartItems.map((cartItem) =>
		cartItem.id === cartItemToReduce.id
			? { ...cartItem, quantity: cartItem.quantity - 1 }
			: cartItem
	);
}

function removeCartItem(cartItems: CartItem[], cartItemToRemove: CartItem) {
	return cartItems.filter((cartItem) => cartItem.id !== cartItemToRemove.id);
}

function useCart() {
	const context = React.useContext(CartContext);

	if (context === undefined) {
		throw new Error(`useCart must be used within a CartProvider`);
	}

	return context;
}

export { CartProvider, useCart };
