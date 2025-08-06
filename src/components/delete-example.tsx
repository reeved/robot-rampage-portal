import { DeleteConfirmation } from "@/components/ui/delete-confirmation";

export function DeleteExample() {
	const handleDelete = async () => {
		// Simulate API call
		await new Promise((resolve) => setTimeout(resolve, 1000));
		console.log("Item deleted!");
	};

	const handleDeleteWithError = async () => {
		// Simulate API call that fails
		await new Promise((resolve) => setTimeout(resolve, 1000));
		throw new Error("Delete failed");
	};

	return (
		<div className="p-6 space-y-6">
			<div className="space-y-4">
				<h2 className="text-2xl font-bold">Delete Confirmation Examples</h2>

				<div className="space-y-4">
					<div className="flex items-center gap-4">
						<span className="text-sm font-medium">Icon Button (Default):</span>
						<DeleteConfirmation
							onDelete={handleDelete}
							title="Delete User"
							description="Are you sure you want to delete this user? This action cannot be undone."
						/>
					</div>

					<div className="flex items-center gap-4">
						<span className="text-sm font-medium">Button with Text:</span>
						<DeleteConfirmation
							onDelete={handleDelete}
							variant="button"
							buttonText="Delete User"
							title="Delete User"
							description="Are you sure you want to delete this user? This action cannot be undone."
						/>
					</div>

					<div className="flex items-center gap-4">
						<span className="text-sm font-medium">Ghost Button:</span>
						<DeleteConfirmation
							onDelete={handleDelete}
							variant="button"
							buttonText="Remove"
							buttonVariant="ghost"
							title="Remove Item"
							description="Remove this item from the list?"
						/>
					</div>

					<div className="flex items-center gap-4">
						<span className="text-sm font-medium">Outline Button:</span>
						<DeleteConfirmation
							onDelete={handleDelete}
							variant="button"
							buttonText="Delete"
							buttonVariant="outline"
							title="Delete File"
							description="This file will be permanently deleted."
						/>
					</div>

					<div className="flex items-center gap-4">
						<span className="text-sm font-medium">Disabled:</span>
						<DeleteConfirmation
							onDelete={handleDelete}
							disabled={true}
							title="Delete Item"
							description="This button is disabled."
						/>
					</div>

					<div className="flex items-center gap-4">
						<span className="text-sm font-medium">Custom Text:</span>
						<DeleteConfirmation
							onDelete={handleDelete}
							title="Remove from Favorites"
							description="Remove this item from your favorites list?"
							confirmText="Remove"
							cancelText="Keep"
						/>
					</div>

					<div className="flex items-center gap-4">
						<span className="text-sm font-medium">With Error Handling:</span>
						<DeleteConfirmation
							onDelete={handleDeleteWithError}
							title="Delete with Error"
							description="This will simulate a failed delete operation."
						/>
					</div>
				</div>
			</div>
		</div>
	);
}
