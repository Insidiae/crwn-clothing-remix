import { Outlet } from "@remix-run/react";
import { json } from "@remix-run/node";

import { getCategoriesAndDocuments } from "~/utils/firebase";

import type { CategoriesMap } from "~/utils/firebase";

export async function loader() {
	const categories = await getCategoriesAndDocuments();

	const categoriesMap = categories.reduce((categories, category) => {
		const { title, imageUrl, items } = category;

		categories[title.toLowerCase()] = {
			title: title.toLowerCase(),
			imageUrl,
			items,
		};

		return categories;
	}, {} as CategoriesMap);

	return json(categoriesMap);
}

export default function ShopRoute() {
	return <Outlet />;
}
