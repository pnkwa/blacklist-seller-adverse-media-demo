import classNames from 'classnames'

interface PageContentLayoutProps {
  title?: React.ReactNode
  titleClassName?: string
  children?: React.ReactNode
  contentWrapperClassName?: string
}

export const PageContentLayout = ({
  title,
  titleClassName,
  children,
  contentWrapperClassName,
}: PageContentLayoutProps) => {
  return (
    <div className="bg-base-200 h-full flex flex-col overflow-hidden">
      {title && (
        <div
          className={classNames(
            'sm:bg-base-100 sm:h-16 sm:min-h-[4rem] items-center pt-4 sm:pt-0 px-4 sm:shadow-box font-bold flex',
            titleClassName
          )}
        >
          {title}
        </div>
      )}
      <div
        className={classNames(
          'flex-1 overflow-y-auto p-4 space-y-4 lg:flex flex-col',
          contentWrapperClassName
        )}
      >
        {children}
      </div>
    </div>
  )
}
