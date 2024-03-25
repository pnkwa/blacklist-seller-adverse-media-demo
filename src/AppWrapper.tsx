import { Suspense } from 'react'
import { Provider } from 'react-redux'
import { ModalProvider } from 'components/composite/Modal/ModalProvider'
import store from 'store'
import { TenantConfigProvider } from 'context/TenantConfigContext'
import { FullScreenLoading } from 'components/base'
import { CaseKeeperProvider } from 'context/CaseKeeperContext'

const AppWrapper = ({ children }: { children?: React.ReactNode }) => {
  return (
    <Provider store={store}>
      <Suspense fallback={<FullScreenLoading />}>
        <TenantConfigProvider>
          <CaseKeeperProvider>
            <ModalProvider>{children}</ModalProvider>
          </CaseKeeperProvider>
        </TenantConfigProvider>
      </Suspense>
    </Provider>
  )
}

export default AppWrapper
