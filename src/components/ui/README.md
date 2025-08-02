# DeleteConfirmation Component

A reusable delete confirmation component that uses a button/icon button with a popover for confirmation.

## Features

- ✅ Icon button or text button variants
- ✅ Customizable confirmation dialog
- ✅ Loading states with spinner
- ✅ Error handling
- ✅ Disabled state support
- ✅ Customizable text and styling
- ✅ Accessible with proper ARIA attributes

## Usage

### Basic Icon Button (Default)

```tsx
import { DeleteConfirmation } from "@/components/ui/delete-confirmation"

function MyComponent() {
  const handleDelete = async () => {
    // Your delete logic here
    await deleteItem(id)
  }

  return (
    <DeleteConfirmation
      onDelete={handleDelete}
      title="Delete User"
      description="Are you sure you want to delete this user? This action cannot be undone."
    />
  )
}
```

### Text Button

```tsx
<DeleteConfirmation
  onDelete={handleDelete}
  variant="button"
  buttonText="Delete User"
  title="Delete User"
  description="Are you sure you want to delete this user? This action cannot be undone."
/>
```

### Custom Styling

```tsx
<DeleteConfirmation
  onDelete={handleDelete}
  variant="button"
  buttonText="Remove"
  buttonVariant="ghost"
  buttonSize="sm"
  title="Remove Item"
  description="Remove this item from the list?"
  confirmText="Remove"
  cancelText="Keep"
  className="custom-class"
/>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `onDelete` | `() => void \| Promise<void>` | **required** | Function to execute when delete is confirmed |
| `title` | `string` | `"Delete Item"` | Title of the confirmation dialog |
| `description` | `string` | `"Are you sure you want to delete this item? This action cannot be undone."` | Description text in the dialog |
| `confirmText` | `string` | `"Delete"` | Text for the confirm button |
| `cancelText` | `string` | `"Cancel"` | Text for the cancel button |
| `variant` | `"button" \| "icon"` | `"icon"` | Whether to show as icon button or text button |
| `buttonText` | `string` | `"Delete"` | Text for the trigger button (when variant is "button") |
| `buttonVariant` | `ButtonVariant` | `"destructive"` | Button variant (default, destructive, outline, etc.) |
| `buttonSize` | `ButtonSize` | `"icon"` | Button size (default, sm, lg, icon) |
| `className` | `string` | `undefined` | Additional CSS classes |
| `disabled` | `boolean` | `false` | Whether the button is disabled |
| `loading` | `boolean` | `false` | Whether the component is in loading state |

## Button Variants

The component supports all button variants from the shadcn/ui Button component:

- `default` - Primary button
- `destructive` - Red button for destructive actions
- `outline` - Outlined button
- `secondary` - Secondary button
- `ghost` - Ghost button
- `link` - Link-style button

## Button Sizes

- `default` - Default size
- `sm` - Small size
- `lg` - Large size
- `icon` - Icon-only size (square)

## Examples

See `src/components/delete-example.tsx` for comprehensive usage examples.

## Accessibility

The component is built with accessibility in mind:

- Proper ARIA attributes
- Keyboard navigation support
- Focus management
- Screen reader friendly
- Loading states with appropriate announcements 