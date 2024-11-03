import { createFileRoute, Outlet } from '@tanstack/react-router'
import { AppLayout } from '../../../components/Layouts/AppLayout'

export const Route = createFileRoute('/u/$repo/')({
  component: () => {
    const { repo } = Route.useParams()
    return (
      <>
        {repo}
      </>
    )
  },
})
