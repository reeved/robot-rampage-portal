import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/api/timer/set-time')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/api/timer/set-time"!</div>
}
