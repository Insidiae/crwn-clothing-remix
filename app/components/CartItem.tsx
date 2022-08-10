import React from "react";

export default function CartItem({ cartItem }) {
	return (
		<div className="w-full h-20 mb-4 flex">
			<img
				src={cartItem.imageUrl}
				alt={cartItem.name}
				className="w-1/3 aspect-square object-cover"
			/>
			<div className="w-2/3 py-2 px-4 flex flex-col justify-center items-start">
				<span className="text-base">{cartItem.name}</span>
				<span className="text-sm">
					{cartItem.quantity} &times; ${cartItem.price}
				</span>
			</div>
		</div>
	);
}
