import {
  Outlet,
  Route,
  RouterProvider,
  createBrowserRouter,
  createRoutesFromElements,
} from 'react-router-dom'

import DemoPage from 'Pages/DemoPage'
import SettingPage from 'Pages/SettingPage'

const appRoutes = createRoutesFromElements(
  <Route element={<Outlet />} errorElement={<div>not found</div>}>
    <Route path="" element={<DemoPage />} />
    <Route path="/settings" element={<SettingPage />} />
  </Route>
)

const router = createBrowserRouter(appRoutes)

export const App = () => <RouterProvider router={router} />
