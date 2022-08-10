import { Link } from "@remix-run/react";

export default function DirectoryItem({ category }) {
	return (
		<Link
			to={`/shop/${category.title}`}
			className="group min-w-[30%] h-52 flex-auto flex justify-center items-center border border-black mt-0 mx-2 mb-4 overflow-hidden hover:cursor-pointer first:mr-2 last:ml-2 md:h-60"
		>
			<img
				src={category.imageUrl}
				alt={`Preview for the ${category.title} category`}
				className="w-full h-full object-cover object-center group-hover:scale-110 group-hover:transition-transform group-hover:ease-[cubic-bezier(0.25, 0.45, 0.45, 0.95)] group-hover:duration-[6000ms]"
			/>
			<div className="absolute h-24 py-0 px-6 flex flex-col justify-center items-center border border-black bg-white opacity-70 group-hover:opacity-90">
				<h2 className="font-bold mx-2 mb-6 text-2xl text-neutral-700 uppercase">
					{category.title}
				</h2>
				<p className="font-extralight">Shop Now</p>
			</div>
		</Link>
	);
}
