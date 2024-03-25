import { forwardRef, useState } from 'react'
import classNames from 'classnames'
import { usePopper } from 'react-popper'
import { createPortal } from 'react-dom'
import { Placement } from '@popperjs/core'

interface TooltipBoxProps {
  show?: boolean
  padding?: number
  children?: React.ReactNode
  tooltipContent?: React.ReactNode
  tooltipClassName?: string
  containerClassName?: string
  wrapperClassName?: string
  placement?: Placement
}

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
const popperPortalElement = document.getElementById('tooltip')!

export const TooltipBox = forwardRef<HTMLDivElement, TooltipBoxProps>(
  (
    {
      children,
      show: showProps,
      padding = 16,
      tooltipContent,
      tooltipClassName,
      wrapperClassName,
      containerClassName,
      placement,
    },
    ref
  ) => {
    const [showState, setShowState] = useState(false)

    const [popperElement, setPopperElement] = useState<HTMLElement | null>(null)
    const [referenceElement, setReferenceElement] = useState<Element | null>(
      null
    )

    const { styles, attributes } = usePopper(referenceElement, popperElement, {
      placement,
      modifiers: [
        { name: 'offset', options: { offset: [0, 4] } },
        { name: 'preventOverflow', options: { padding } },
      ],
    })

    const show = showProps ?? showState

    return (
      <>
        <div
          ref={setReferenceElement}
          onMouseEnter={() => setShowState(true)}
          onFocus={() => setShowState(true)}
          onBlur={() => setShowState(false)}
          onMouseLeave={() => setShowState(false)}
          className={wrapperClassName}
        >
          {children}
        </div>
        {show &&
          createPortal(
            <div
              ref={setPopperElement}
              style={styles.popper}
              className={classNames('z-40', containerClassName)}
              {...attributes.popper}
            >
              <div
                className={classNames(
                  'shadow-xl content-box text-sm max-w-xs',
                  tooltipClassName
                )}
                ref={ref}
              >
                {tooltipContent}
              </div>
            </div>,
            popperPortalElement
          )}
      </>
    )
  }
)
