import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/admin/event/general')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/admin/event/general"!</div>
}
