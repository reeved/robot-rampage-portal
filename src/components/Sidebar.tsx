import { Link, type LinkProps } from "@tanstack/react-router";
import { GalleryVerticalEnd, Minus, Plus } from "lucide-react";
import type * as React from "react";

import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import {
	Sidebar,
	SidebarContent,
	SidebarGroup,
	SidebarHeader,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	SidebarMenuSub,
	SidebarMenuSubButton,
	SidebarMenuSubItem,
	SidebarRail,
} from "@/components/ui/sidebar";

type NavLeaf = {
	title: string;
	to: LinkProps["to"];
	isActive?: boolean;
};

type NavGroup = {
	title: string;
	to: LinkProps["to"] | null;
	items?: NavLeaf[];
};

// This is sample data.
const data: { navMain: NavGroup[] } = {
	navMain: [
		{
			title: "Admin",
			to: "/admin",
			items: [
				{
					title: "Event",
					to: "/admin/event",
				},
				{
					title: "Participants",
					to: "/admin/participants",
				},
				{
					title: "Sessions",
					to: "/admin/schedule",
				},
				{
					title: "Rankings",
					to: "/admin/rankings",
				},
				{
					title: "Full Screen Timer",
					to: "/admin/timer",
				},
			],
		},
		{
			title: "Display pages",
			to: null,
			items: [
				{
					title: "Bracket",
					to: "/bracket",
				},
				{
					title: "Schedule",
					to: "/schedule",
				},
				{
					title: "Overlay",
					to: "/overlay",
				},
				{
					title: "Mini Timer Overlay",
					to: "/admin/mini-timer",
				},
				{
					title: "Stats",
					to: "/stats",
				},
				{
					title: "Teams Match",
					to: "/teams-match",
				},
				{
					title: "Results",
					to: "/results",
				},
			],
		},
	],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
	return (
		<Sidebar {...props}>
			<SidebarHeader>
				<SidebarMenu>
					<SidebarMenuItem>
						<SidebarMenuButton size="lg" asChild>
							<a href="#">
								<div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
									<GalleryVerticalEnd className="size-4" />
								</div>
								<div className="flex flex-col gap-0.5 leading-none">
									<span className="font-medium">Documentation</span>
									<span className="">v1.0.0</span>
								</div>
							</a>
						</SidebarMenuButton>
					</SidebarMenuItem>
				</SidebarMenu>
			</SidebarHeader>
			<SidebarContent>
				<SidebarGroup>
					<SidebarMenu>
						{data.navMain.map((item, index) => (
							<Collapsible key={item.title} defaultOpen={index === 1} className="group/collapsible">
								<SidebarMenuItem>
									<CollapsibleTrigger asChild>
										<SidebarMenuButton>
											{item.title} <Plus className="ml-auto group-data-[state=open]/collapsible:hidden" />
											<Minus className="ml-auto group-data-[state=closed]/collapsible:hidden" />
										</SidebarMenuButton>
									</CollapsibleTrigger>
									{item.items?.length ? (
										<CollapsibleContent>
											<SidebarMenuSub>
												{item.items.map((item) => (
													<SidebarMenuSubItem key={item.title}>
														<SidebarMenuSubButton asChild isActive={item.isActive}>
															<Link to={item.to}>{item.title}</Link>
														</SidebarMenuSubButton>
													</SidebarMenuSubItem>
												))}
											</SidebarMenuSub>
										</CollapsibleContent>
									) : null}
								</SidebarMenuItem>
							</Collapsible>
						))}
					</SidebarMenu>
				</SidebarGroup>
			</SidebarContent>
			<SidebarRail />
		</Sidebar>
	);
}
