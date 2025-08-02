import { Button } from "@/components/ui/button";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Trash2 } from "lucide-react";
import * as React from "react";

interface DeleteConfirmationProps {
	onDelete: () => void;
	title?: string;
	description?: string;
	confirmText?: string;
	cancelText?: string;
	variant?: "button" | "icon";
	buttonText?: string;
	buttonVariant?:
		| "default"
		| "destructive"
		| "outline"
		| "secondary"
		| "ghost"
		| "link";
	buttonSize?: "default" | "sm" | "lg" | "icon";
	className?: string;
	disabled?: boolean;
	loading?: boolean;
}

export function DeleteConfirmation({
	onDelete,
	title = "Delete Item",
	description = "Are you sure you want to delete this item? This action cannot be undone.",
	confirmText = "Delete",
	cancelText = "Cancel",
	variant = "icon",
	buttonText = "Delete",
	buttonVariant = "default",
	buttonSize = "icon",
	className,
	disabled = false,
	loading = false,
}: DeleteConfirmationProps) {
	const [isOpen, setIsOpen] = React.useState(false);
	const [isDeleting, setIsDeleting] = React.useState(false);

	const handleDelete = async () => {
		setIsDeleting(true);
		try {
			await onDelete();
			setIsOpen(false);
		} catch (error) {
			console.error("Delete failed:", error);
		} finally {
			setIsDeleting(false);
		}
	};

	const handleCancel = () => {
		setIsOpen(false);
	};

	const triggerButton = (
		<Button
			variant={buttonVariant}
			size={buttonSize}
			disabled={disabled || loading || isDeleting}
			className={cn(variant === "icon" && "h-9 w-9 p-0", className)}
		>
			{variant === "icon" ? (
				<Trash2 className="h-4 w-4" />
			) : (
				<>
					<Trash2 className="h-4 w-4" />
					{buttonText}
				</>
			)}
		</Button>
	);

	return (
		<Popover open={isOpen} onOpenChange={setIsOpen}>
			<PopoverTrigger asChild>{triggerButton}</PopoverTrigger>
			<PopoverContent className="w-80" align="end">
				<div className="space-y-4">
					<div className="space-y-2">
						<h4 className="font-medium leading-none">{title}</h4>
						<p className="text-sm text-muted-foreground">{description}</p>
					</div>
					<div className="flex gap-2">
						<Button
							variant="outline"
							size="sm"
							onClick={handleCancel}
							disabled={isDeleting}
							className="flex-1"
						>
							{cancelText}
						</Button>
						<Button
							variant="destructive"
							size="sm"
							onClick={handleDelete}
							disabled={isDeleting}
							className="flex-1"
						>
							{isDeleting ? (
								<>
									<div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
									Deleting...
								</>
							) : (
								confirmText
							)}
						</Button>
					</div>
				</div>
			</PopoverContent>
		</Popover>
	);
}
