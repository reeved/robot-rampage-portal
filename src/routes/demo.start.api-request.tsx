import { useEffect, useState } from "react";

import { createFileRoute } from "@tanstack/react-router";

function getNames() {
	return fetch("/api/demo-names").then((res) => res.json());
}

export const Route = createFileRoute("/demo/start/api-request")({
	component: Home,
});

const funcTest = () => {
	const a = 1 as string;
	console.log(a.length());
};

function Home() {
	const [names, setNames] = useState<Array<string>>([]);
	useEffect(() => {
		getNames().then(setNames);
		funcTest();
	}, []);

	return (
		<div className="p-4">
			<div>{names.join(", ")}</div>
		</div>
	);
}
