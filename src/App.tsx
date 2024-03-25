import {
  Navigate,
  Outlet,
  Route,
  RouterProvider,
  createBrowserRouter,
  createRoutesFromElements,
} from 'react-router-dom'
import AppWrapper from 'AppWrapper'
import { routes } from 'config/routes'
import { PrivateRoute } from 'components/composite/PrivateRoute'
import { MainLayout } from 'components/composite/MainLayout/MainLayout'
import { startAllListeners } from 'listenerMiddleware'

import OverviewPage from 'pages/OverviewPage'
import BackgroundCheckPage from 'pages/BackgroundCheckPage'
import NotFoundPage from 'pages/NotFoundPage'
import CaseDetail from 'pages/CaseDetail'
import HelpPage from 'pages/HelpPage'
import GuidePage from 'pages/GuidePage'
import SettingsPage from 'pages/SettingsPage'
import TransactionsPage from 'pages/TransactionsPage'

startAllListeners()

const appRoutes = createRoutesFromElements(
  <Route
    path={import.meta.env.BASE_URL}
    element={
      <AppWrapper>
        <Outlet />
      </AppWrapper>
    }
    errorElement={<NotFoundPage />}
  >
    <Route path="" element={<PrivateRoute />}>
      <Route path="" element={<MainLayout />}>
        <Route path={routes.overview} element={<OverviewPage />} />
        <Route
          path={routes.backgroundCheck}
          element={<BackgroundCheckPage />}
        />
        <Route path={routes.help} element={<HelpPage />} />
        <Route path={routes.guide} element={<GuidePage />} />
        <Route path={routes.settings} element={<SettingsPage />} />
        <Route path={routes.caseDetail} element={<CaseDetail />} />
        <Route path={routes.transactions} element={<TransactionsPage />} />
        <Route path="" element={<Navigate to={routes.overview} replace />} />
      </Route>
    </Route>
  </Route>
)

const router = createBrowserRouter(appRoutes)

export const App = () => <RouterProvider router={router} />
