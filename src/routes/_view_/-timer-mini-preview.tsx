import type { PropsWithChildren } from "react";

export const TimerMiniPreview = ({ children }: PropsWithChildren) => {
	return (
		<div className="flex items-center justify-center p-4 absolute top-10 left-15">
			<div
				className="
    relative
    w-44
    h-20
    bg-primary
    shadow-2xl
    [clip-path:polygon(16%_0%,_84%_0%,_100%_50%,_84%_100%,_16%_100%,_0%_50%)]
  "
			>
				{/* The inner element for the main body of the hexagon.
        It's slightly smaller to create the illusion of a red border. */}
				<div
					className="
      absolute
      inset-1.5
      bg-black
      [clip-path:polygon(15%_0%,_85%_0%,_100%_50%,_85%_100%,_15%_100%,_0%_50%)]
      flex
      items-center
      justify-center
      text-4xl
    "
				>
					{children}
				</div>
			</div>
		</div>
	);
};
