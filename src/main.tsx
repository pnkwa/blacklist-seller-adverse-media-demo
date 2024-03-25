import ReactDOM from 'react-dom/client'
import { ReactKeycloakProvider } from '@react-keycloak/web'
import { keycloak } from 'config/keycloak'
import { App } from './App'

import 'react-date-range/dist/styles.css' // main css file
import 'react-date-range/dist/theme/default.css' // theme css file
import 'moment/dist/locale/th'
import './i18n'
import './main.css'
import './fonts.css'

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
const root = ReactDOM.createRoot(document.getElementById('root')!)

root.render(
  /**
   * [workaround] put ReactKeycloakProvider outside of StrictMode to prevent error
   * ref: https://github.com/react-keycloak/react-keycloak/issues/182
   */
  <ReactKeycloakProvider authClient={keycloak}>
    <App />
  </ReactKeycloakProvider>
)
