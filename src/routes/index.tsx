import { useRoutes } from 'react-router-dom'
import Home from '@/views/Home/Home'

export const useCreateRoutes = () => useRoutes([
  {
    path: '/',
    element: <Home />,
  },
])
