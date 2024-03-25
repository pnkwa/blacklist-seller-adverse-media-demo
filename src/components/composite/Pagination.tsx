import classnames from 'classnames'
import { FC } from 'react'
import ArrowBackIcon from 'assets/svg/icon-chevron-left.svg?react'
import ArrowNextIcon from 'assets/svg/icon-chevron-right.svg?react'
import { PaginationMeta } from 'types/generic'

interface PaginationProps {
  meta: PaginationMeta
  page: number
  onChange: (page: number) => void
}

const buttonClassName =
  'flex items-center justify-center p-1 rounded-md text-xs font-normal min-w-[28px]'
const highLightClassName = 'opacity-100 hover:bg-primary hover:bg-opacity-10'
const selectedClassName =
  'bg-primary text-primary-content hover:bg-opacity-100 hover:bg-primary-focus'

const MorePageIndicator = () => (
  <button
    type="button"
    className={classnames('pointer-events-none', buttonClassName)}
    disabled
  >
    ...
  </button>
)

export const Pagination: FC<PaginationProps> = ({ meta, page, onChange }) => {
  if (!meta.limit) return null

  const totalPages = Math.ceil(meta.count / meta.limit)
  return (
    <nav className="flex justify-center space-x-1 text-base-content h-[28px]">
      <button
        type="button"
        onClick={() => onChange(page - 1)}
        className={classnames(
          buttonClassName,
          page > 1 ? highLightClassName : 'opacity-30'
        )}
        disabled={page <= 1}
        aria-label="previous"
      >
        <ArrowBackIcon />
      </button>

      {Array(7)
        .fill(null)
        .map((_, index) => {
          const offSet = index - 3
          if (offSet === -3 && page + offSet >= 2) {
            return (
              <div
                className="flex justify-center space-x-1"
                key={`page_${index}_button`}
              >
                <button
                  type="button"
                  className={classnames(
                    'mr-4',
                    buttonClassName,
                    highLightClassName
                  )}
                  onClick={() => onChange(1)}
                >
                  1
                </button>
                <MorePageIndicator key={index} />
              </div>
            )
          }
          if (offSet === 3 && page + offSet <= totalPages - 1) {
            return (
              <div
                className="flex justify-center space-x-1"
                key={`page_${index}_button`}
              >
                <MorePageIndicator key={index} />
                <button
                  type="button"
                  className={classnames(
                    'ml-4',
                    totalPages > 9 && 'px-1.5',
                    buttonClassName,
                    highLightClassName
                  )}
                  onClick={() => onChange(totalPages)}
                >
                  {totalPages}
                </button>
              </div>
            )
          }
          if (page + offSet >= 1 && page + offSet <= totalPages) {
            return (
              <button
                key={`page_${index}_button`}
                type="button"
                onClick={() => onChange(page + offSet)}
                className={classnames(
                  page + offSet > 9 && 'px-1.5',
                  buttonClassName,
                  highLightClassName,
                  offSet === 0 && selectedClassName
                )}
              >
                {page + offSet}
              </button>
            )
          }
          return null
        })}

      <button
        type="button"
        className={classnames(
          buttonClassName,
          page < totalPages ? highLightClassName : 'opacity-30'
        )}
        disabled={page >= totalPages}
        onClick={() => onChange(page + 1)}
        aria-label="next"
      >
        <ArrowNextIcon />
      </button>
    </nav>
  )
}
