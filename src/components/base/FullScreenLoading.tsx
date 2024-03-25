import classNames from 'classnames'
import FullScreen from 'react-div-100vh'
import { Spinner } from './Spinner'

interface FullScreenLoadingProps {
  className?: string
  children?: React.ReactNode
}

export const FullScreenLoading: React.FC<FullScreenLoadingProps> = ({
  className,
  children,
}) => {
  return (
    <FullScreen
      className={classNames(
        'fixed inset-0 w-full flex flex-col justify-center items-center',
        className
      )}
    >
      <Spinner className="text-primary loading-lg" />
      {children}
    </FullScreen>
  )
}
