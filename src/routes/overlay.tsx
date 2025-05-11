import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/overlay")({
	component: RouteComponent,
});

function RouteComponent() {
	return (
		<div className="h-full w-full bg-white">
			<div className="h-[1080px] w-[1920px] bg-transparent relative box-border">
				<div className="absolute bottom-10 left-60 right-60 flex">
					<div className="h-24 flex flex-1 bg-black/70 rounded-l-3xl items-center justify-center font-rubik text-4xl relative">
						BAD BLOOD
						<div className="absolute bottom-24 bg-amber-400/70 px-8 py-2 rounded-t-xl">
							Win by KO
						</div>
					</div>
					<div className="h-24 w-[25ch] bg-primary/70" />
					<div className="h-24 flex flex-1 bg-black/70 rounded-r-3xl items-center justify-center font-rubik text-4xl relative">
						SNOLLYGOSTER
						<div className="absolute bottom-24 bg-amber-400/70 px-8 py-2 rounded-t-xl">
							Win by KO
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
