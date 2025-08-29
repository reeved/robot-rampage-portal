import { createFileRoute, Outlet } from "@tanstack/react-router";
import Header from "@/components/Header";
import { AppSidebar } from "@/components/Sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

export const Route = createFileRoute("/admin")({
	component: RouteComponent,
});

function RouteComponent() {
	return (
		<SidebarProvider>
			<AppSidebar />
			<SidebarInset>
				<div className="h-full flex flex-col">
					<Header />
					<Outlet />
				</div>
			</SidebarInset>
		</SidebarProvider>
	);
}
