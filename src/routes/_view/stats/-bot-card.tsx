const BotCard = () => {
	return (
		<div className="flex flex-col gap-2">
			<div className="flex items-center justify-between">
				<h2 className="text-lg font-semibold">Bot</h2>
				<span className="text-sm text-gray-500">v1.0.0</span>
			</div>
			<p className="text-gray-700">
				This is a bot that helps you with your tasks.
			</p>
		</div>
	);
};
