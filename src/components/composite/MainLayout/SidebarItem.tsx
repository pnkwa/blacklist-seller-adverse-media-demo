import classNames from 'classnames'
import { onEnterKey } from 'utils/element'

interface SidebarItemProps {
  className?: string
  outerClassName?: string
  minimizedDivClassName?: string
  minimizedNode: React.ReactNode
  expandedNode?: React.ReactNode
  active?: boolean
  onClick?: () => unknown
}

export const SidebarItem = ({
  className,
  outerClassName,
  minimizedDivClassName,
  minimizedNode,
  expandedNode,
  active,
  onClick,
}: SidebarItemProps) => (
  <div className={classNames('px-2 py-1 text-sm', outerClassName)}>
    <div
      role="button"
      tabIndex={onClick ? 0 : undefined}
      onClick={onClick}
      onKeyDown={onEnterKey(onClick)}
      className={classNames(
        'text-left flex items-center w-full overflow-hidden rounded-xl min-h-[3rem]',
        'transition-all',
        onClick ? 'cursor-pointer hover:bg-primary/50' : 'cursor-default',
        active && '!bg-primary',
        className
      )}
    >
      <div
        className={classNames(
          'pr-0 w-14 min-w-[3rem] flex justify-center',
          minimizedDivClassName
        )}
      >
        {minimizedNode}
      </div>
      <div
        className={classNames(
          'flex-grow min-w-[12rem] overflow-hidden',
          active ? 'font-bold' : 'font-normal'
        )}
      >
        {expandedNode}
      </div>
    </div>
  </div>
)
