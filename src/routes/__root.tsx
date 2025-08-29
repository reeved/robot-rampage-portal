/// <reference types="vite/client" />
import { createRootRouteWithContext, HeadContent, Outlet, Scripts } from "@tanstack/react-router";

// import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";

// import TanstackQueryLayout from "../integrations/tanstack-query/layout";

import type { QueryClient } from "@tanstack/react-query";

import { Toaster } from "@/components/ui/sonner";
import appCss from "../styles.css?url";

interface MyRouterContext {
	queryClient: QueryClient;
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
	head: () => ({
		meta: [
			{
				charSet: "utf-8",
			},
			{
				name: "viewport",
				content: "width=device-width, initial-scale=1",
			},
			{
				title: "Robot Rampage Portal",
			},
		],
		links: [
			{
				rel: "stylesheet",
				href: appCss,
			},
			{
				rel: "icon",
				type: "image/png",
				sizes: "32x32",
				href: "/favicon.png",
			},
		],
	}),

	component: () => (
		<RootDocument>
			<Outlet />
			{/* <TanStackRouterDevtools /> */}
			<Toaster />

			{/* <TanstackQueryLayout /> */}
		</RootDocument>
	),
});

function RootDocument({ children }: { children: React.ReactNode }) {
	return (
		<html lang="en">
			<head>
				<HeadContent />
			</head>
			<body className="flex flex-col h-screen overflow-y-auto">
				{children}
				<Scripts />
			</body>
		</html>
	);
}
