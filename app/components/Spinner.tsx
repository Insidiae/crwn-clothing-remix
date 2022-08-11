export default function Spinner() {
	return (
		<div className="w-full h-[60vh] flex justify-center items-center">
			<div className="inline-block w-12 h-12 border-[3px] border-[rgba(195, 195, 195, 0.6)] border-t-zinc-600 border-op rounded-full animate-spin"></div>
		</div>
	);
}
