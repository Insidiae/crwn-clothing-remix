import { useParams } from "@remix-run/react";

import ProductCard from "~/components/ProductCard";

import { useMatchesData } from "~/utils/utils";

import type { CategoriesMap } from "~/utils/firebase";

export default function Category() {
	const { category } = useParams();
	const categoriesMap = useMatchesData("routes/shop") as CategoriesMap;

	const products = categoriesMap[category ?? ""]?.items;

	return (
		<>
			<h2 className="mb-6 font-bold text-4xl text-center uppercase">
				{category}
			</h2>
			<div className="grid grid-cols-1 gap-x-2 gap-y-12 xs:grid-cols-2 sm:grid-cols-3 md:grid-cols-4">
				{products ? (
					products.map((product) => (
						<ProductCard key={product.id} product={product} />
					))
				) : (
					<p className="col-span-full font-bold text-2xl text-center">
						No products for "{category}"
					</p>
				)}
			</div>
		</>
	);
}
