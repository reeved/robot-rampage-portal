import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/admin/schedule/$id')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/admin/schedule/$id"!</div>
}
