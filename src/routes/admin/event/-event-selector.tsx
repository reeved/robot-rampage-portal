import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { Event } from "@/db";

type Props = {
	events: Event[];
	selectedEventId: string;
	onChange: (value: string) => void;
};

export function EventSelector({ events, selectedEventId, onChange }: Props) {
	if (!events || events.length <= 1) return null;

	return (
		<div className="space-y-2">
			<Label className="text-white text-lg font-semibold">Select Event</Label>
			<Select value={selectedEventId} onValueChange={onChange}>
				<SelectTrigger className="bg-zinc-800 text-white border-zinc-700">
					<SelectValue placeholder="Select an event" />
				</SelectTrigger>
				<SelectContent className="bg-zinc-800 text-white">
					{events.map((evt) => (
						<SelectItem key={evt.id} value={evt.id} className="font-bold">
							{evt.id.charAt(0).toUpperCase() + evt.id.slice(1)}
						</SelectItem>
					))}
				</SelectContent>
			</Select>
		</div>
	);
}
