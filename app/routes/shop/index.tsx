import CategoryPreview from "~/components/CategoryPreview";

import { useMatchesData } from "~/utils/utils";

import type { CategoriesMap } from "~/utils/firebase";

export default function ShopIndexRoute() {
	const categoriesMap = useMatchesData("routes/shop") as CategoriesMap;

	return (
		<>
			{Object.keys(categoriesMap).map((categoryKey) => (
				<CategoryPreview
					key={categoryKey}
					categoryKey={categoryKey}
					products={categoriesMap[categoryKey].items}
				/>
			))}
		</>
	);
}
