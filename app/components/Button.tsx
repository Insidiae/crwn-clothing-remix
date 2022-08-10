import * as React from "react";

export type ButtonProps = {
	className?: string;
	theme?: keyof typeof buttonThemeStyles;
};

function Button({
	children,
	className,
	theme = "default",
	...otherProps
}: React.ButtonHTMLAttributes<HTMLButtonElement> & ButtonProps) {
	const themeStyle = buttonThemeStyles[theme];

	return (
		<button
			className={`min-w-[10rem] w-auto h-12 py-0 px-9 border flex justify-center items-center text-base font-bold uppercase tracking-[0.5px] cursor-pointer transition disabled:cursor-not-allowed ${themeStyle} ${className}`}
			{...otherProps}
		>
			{otherProps.disabled ? <ButtonSpinner /> : children}
		</button>
	);
}

const ButtonSpinner = () => (
	<div className="inline-block w-7 h-7 border-[3px] border-[rgba(195, 195, 195, 0.6)] border-t-zinc-600 border-op rounded-full animate-spin"></div>
);

const buttonThemeStyles = {
	default:
		"bg-black text-white border-transparent hover:border-black hover:bg-white hover:text-black",
	google: "bg-blue-600 text-white hover:border-transparent hover:bg-blue-400",
	inverted:
		"bg-white text-black border-black hover:border-transparent hover:bg-black hover:text-white",
};

export default Button;
