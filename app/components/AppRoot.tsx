import * as React from "react";
import { Outlet } from "@remix-run/react";

import Navigation from "./Navigation";
import Spinner from "./Spinner";

import { AppProviders } from "~/context";

let isHydrating = true;

export default function AppRoot() {
	const [isHydrated, setIsHydrated] = React.useState(!isHydrating);

	React.useEffect(() => {
		isHydrating = false;
		setIsHydrated(true);
	}, []);

	if (isHydrated) {
		return (
			<div className="py-2.5 px-5 md:py-5 md:px-10">
				<AppProviders>
					<Navigation />
					<Outlet />
				</AppProviders>
			</div>
		);
	} else {
		return <Spinner />;
	}
}
