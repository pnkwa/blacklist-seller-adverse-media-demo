import classNames from 'classnames'

interface ToggleProps extends React.ComponentPropsWithoutRef<'input'> {
  className?: string
}

export const Toggle: React.FC<ToggleProps> = ({
  className,
  checked,
  ...props
}) => {
  return (
    <input
      type="checkbox"
      className={classNames(
        'toggle border-transparent bg-white hover:bg-neutral-100',
        checked
          ? // eslint-disable-next-line max-len
            `[--tglbg:var(--fallback-su,oklch(var(--su)/var(--tw-text-opacity)))]` // success color
          : '[--tglbg:var(--fallback-n,oklch(var(--n)/var(--tw-text-opacity)))]', // neutral color
        className
      )}
      checked={checked}
      {...props}
    />
  )
}
