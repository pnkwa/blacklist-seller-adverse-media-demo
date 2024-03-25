import {
  Outlet,
  Route,
  RouterProvider,
  createBrowserRouter,
  createRoutesFromElements,
} from 'react-router-dom'

const appRoutes = createRoutesFromElements(
  <Route element={<Outlet />} errorElement={<div>not found</div>}>
    <Route path="" element={<div className="text-blue-300">bello eiei</div>} />
  </Route>
)

const router = createBrowserRouter(appRoutes)

export const App = () => <RouterProvider router={router} />
