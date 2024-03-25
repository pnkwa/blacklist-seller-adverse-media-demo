import classNames from 'classnames'
import { FC, PropsWithChildren, ReactNode } from 'react'

interface InfoCardProps extends PropsWithChildren {
  className?: string
  title?: string | ReactNode
}

/**
 * A simple white card component. Any title and children can be added inside.
 * This component is meant to be used in the Case Detail page and any other suitable places.
 */
const InfoCard: FC<InfoCardProps> = ({ className, children, title }) => (
  <div
    className={classNames(
      'bg-base-100 rounded-lg p-4 flex flex-col',
      className
    )}
  >
    <p className="font-bold text-sm sm:text-base mb-2 text-base-content">
      {title}
    </p>
    <div className="text-base-content flex-1 h-full">{children}</div>
  </div>
)

export default InfoCard
