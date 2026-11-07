import { orpc } from '#/client'
import { useQuery } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/')({ component: Home })

function Home() {
  const { isLoading, isError, isSuccess, error, data } = useQuery({
    queryKey: ['getPlanets'],
    queryFn: () => orpc.planet.list(),
  })
  if (isLoading) {
    return (
      <div className="w-screen h-screen flex justify-center items-center">
        <p>Loading...</p>
      </div>
    )
  } else if (isError) {
    return (
      <div className="w-screen h-screen flex justify-center items-center">
        <p>Something went wrong: {error.message}</p>
      </div>
    )
  } else if (isSuccess) {
    return (
      <div className="p-8">
        <h1 className="text-4xl font-bold">Welcome to TanStack Start</h1>
        <p className="mt-4 text-lg">
          Edit <code>src/routes/index.tsx</code> to get started.
        </p>
        <ul>
          {data.map((planet) => (
            <li key={planet.id} className="mt-4 text-lg">
              {planet.name}
            </li>
          ))}
        </ul>
      </div>
    )
  }
}
