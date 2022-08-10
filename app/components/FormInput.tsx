import * as React from "react";

type FormInputProps = {
	id?: string;
	label?: string;
	name?: string;
};

function FormInput({
	id,
	label,
	name,
	...otherProps
}: React.InputHTMLAttributes<HTMLInputElement> & FormInputProps) {
	const passwordStyles = otherProps.type === "password" ? "tracking-wide" : "";

	return (
		<div className="relative my-11 mx-0">
			<input
				id={id}
				name={name}
				placeholder={label}
				className={`peer block w-full my-6 mx-0 py-2 pr-1 pl-0 rounded-none border-b border-gray-500 bg-none bg-white text-gray-500 text-lg placeholder:text-transparent ${passwordStyles} focus:outline-none`}
				{...otherProps}
			/>
			{label ? (
				<label
					htmlFor={id}
					className={`absolute left-1 transition-all delay-300 ease-in-out pointer-events-none -top-3 text-xs text-black  peer-placeholder-shown:top-2 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-500 peer-focus:-top-3 peer-focus:text-xs peer-focus:text-black`}
				>
					{label}
				</label>
			) : null}
		</div>
	);
}

export default FormInput;
