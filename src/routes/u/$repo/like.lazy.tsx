import { createLazyFileRoute } from '@tanstack/react-router'

export const Route = createLazyFileRoute('/u/$repo/like')({
  component: () => <div>Hello /u_/$repo/like!</div>,
})
