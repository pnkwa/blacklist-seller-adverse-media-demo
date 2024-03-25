import React from 'react'
import { animated, useTransition } from '@react-spring/web'
import classNames from 'classnames'

interface OverlayEffectProps {
  isShow: boolean
  children?: React.ReactNode
}

export const OverlayEffect: React.FC<OverlayEffectProps> = ({
  isShow,
  children,
}) => {
  const wrapperTransition = useTransition(isShow, {
    from: { opacity: 0, transform: 'translate3d(0, 5%,0)' },
    enter: { opacity: 1, transform: 'translate3d(0, 0,0)' },
    leave: { opacity: 0, transform: 'translate3d(0, 5%,0)' },
  })
  const overlayTransition = useTransition(isShow, {
    from: { opacity: 0 },
    enter: { opacity: 1 },
    leave: { opacity: 0 },
  })

  return (
    <>
      {overlayTransition(
        (styles, item) =>
          item && (
            <animated.div
              style={styles}
              className="fixed z-30 inset-0 bg-black/50"
            />
          )
      )}
      {wrapperTransition(
        (styles, item) =>
          item && (
            <animated.div
              style={styles}
              className={classNames(
                'fixed z-30 inset-0 flex justify-center items-center pb-2',
                'pt-16 sm:py-10'
              )}
            >
              {children}
            </animated.div>
          )
      )}
    </>
  )
}
