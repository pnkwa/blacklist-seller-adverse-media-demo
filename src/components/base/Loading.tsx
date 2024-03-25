import classNames from 'classnames'
import { Spinner } from './Spinner'

interface LoadingProps {
  className?: string
}

export const Loading: React.FC<LoadingProps> = ({ className }) => {
  return (
    <div className={classNames('flex justify-center items-center', className)}>
      <Spinner className="text-primary loading-lg" />
    </div>
  )
}
