import * as React from "react";

import { CartProvider } from "./cartContext";

export function AppProviders({ children }: { children: React.ReactNode }) {
	return <CartProvider>{children}</CartProvider>;
}
