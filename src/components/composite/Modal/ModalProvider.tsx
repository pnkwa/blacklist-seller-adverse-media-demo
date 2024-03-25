/* eslint-disable @typescript-eslint/no-non-null-assertion */
import {
  FC,
  ReactNode,
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react'
import { createPortal } from 'react-dom'

const modalElement = document.getElementById('modal')!

interface IModalContext {
  renderElement: (element: ReactNode) => void
  destroy: () => void
}

const ModalContext = createContext<IModalContext>({
  renderElement: () => {},
  destroy: () => {},
})

export const ModalProvider: FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [modal, setModal] = useState<ReactNode>(null)

  const destroy = useCallback(() => {
    setModal(null)
  }, [])

  const renderElement = useCallback((element: ReactNode) => {
    setModal(element)
  }, [])

  const value = useMemo(
    () => ({
      destroy,
      renderElement,
    }),
    [destroy, renderElement]
  )

  return (
    <ModalContext.Provider value={value}>
      {createPortal(modal, modalElement)}
      {children}
    </ModalContext.Provider>
  )
}

export const useModalContext = (): IModalContext => useContext(ModalContext)
