import React from 'react'
import classNames from 'classnames'

interface SpinnerProps {
  className?: string
  size?: number | string
  style?: React.CSSProperties
}

export const Spinner: React.FC<SpinnerProps> = ({ size, className, style }) => {
  return (
    <span
      className={classNames('loading loading-spinner', className)}
      style={{
        width: size,
        height: size,
        ...style,
      }}
    />
  )
}
