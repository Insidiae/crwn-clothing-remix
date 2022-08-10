import { useLoaderData } from "@remix-run/react";
import { json } from "@remix-run/node";

import DirectoryItem from "~/components/DirectoryItem";

import type { CategoriesMap } from "~/utils/firebase";

export async function loader() {
	const categoriesMap: CategoriesMap = {
		hats: {
			title: "hats",
			imageUrl: "https://i.ibb.co/cvpntL1/hats.png",
			items: [],
		},
		jackets: {
			title: "jackets",
			imageUrl: "https://i.ibb.co/px2tCc3/jackets.png",
			items: [],
		},
		sneakers: {
			title: "sneakers",
			imageUrl: "https://i.ibb.co/0jqHpnp/sneakers.png",
			items: [],
		},
		womens: {
			title: "womens",
			imageUrl: "https://i.ibb.co/GCCdy8t/womens.png",
			items: [],
		},
		mens: {
			title: "mens",
			imageUrl: "https://i.ibb.co/R70vBrQ/men.png",
			items: [],
		},
	};

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
