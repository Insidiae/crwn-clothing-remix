import { useLoaderData } from "@remix-run/react";
import { json } from "@remix-run/node";

import DirectoryItem from "~/components/DirectoryItem";

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

export default function Index() {
	const categoriesMap = useLoaderData<typeof loader>();

	return (
		<div className="w-full flex flex-wrap justify-between">
			{Object.keys(categoriesMap).map((category) => (
				<DirectoryItem
					key={categoriesMap[category].title}
					category={categoriesMap[category]}
				/>
			))}
		</div>
	);
}
