import { useRoutes } from 'react-router-dom'

import Home from '@/views/Home/Home'
import HelloCanvas from '@/views/0-HelloCanvas/HelloCanvas'

export const useCreateRoutes = () => useRoutes([
  {
    path: '/',
    element: <Home />,
  },
  {
    path: '/0-hello-canvas',
    element: <HelloCanvas />,
  },
])
