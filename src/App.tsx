import {
  Outlet,
  Route,
  RouterProvider,
  createBrowserRouter,
  createRoutesFromElements,
} from 'react-router-dom'

const appRoutes = createRoutesFromElements(
  <Route
    path={import.meta.env.BASE_URL}
    element={<Outlet />}
    errorElement={<div>not found</div>}
  >
    <Route path="" element={<div className="text-red-300">bello eiei</div>} />
  </Route>
)

const router = createBrowserRouter(appRoutes)

export const App = () => <RouterProvider router={router} />
