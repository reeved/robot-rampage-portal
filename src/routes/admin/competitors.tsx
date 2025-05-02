import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/admin/competitors')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/admin/competitors"!</div>
}
