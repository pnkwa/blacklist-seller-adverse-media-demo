import { IconProp } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import classNames from 'classnames'
import { FC } from 'react'
import { Spinner } from 'components/base'
import { SVGAssetComponent } from 'types/generic'

const iconClass = 'h-4 w-4 text-inherit'

interface ActionButtonProps {
  disabled?: boolean
  faIcon?: IconProp
  hidden?: boolean
  className?: string
  btnClassName?: string
  contentClassName?: string
  iconClassName?: string
  loading?: boolean
  rightIconClass?: string
  rightSvgIcon?: SVGAssetComponent
  subText?: React.ReactNode
  svgIcon?: SVGAssetComponent
  text: React.ReactNode
  toolTip?: string
  error?: boolean
  onClick?: () => void
  onRightIconClick?: () => void
}

export const ActionButton: FC<ActionButtonProps> = ({
  disabled,
  faIcon,
  hidden,
  className,
  btnClassName,
  contentClassName,
  iconClassName,
  loading,
  rightIconClass,
  rightSvgIcon: RightSvgIcon,
  subText,
  svgIcon: SvgIcon,
  text,
  toolTip,
  // TODO: show error icon
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  error,
  onClick,
  onRightIconClick,
}) => (
  <div
    className={classNames(
      'tooltip flex items-center w-full relative',
      className,
      {
        hidden,
        disabled,
      }
    )}
    data-tip={toolTip}
  >
    <button
      type="button"
      disabled={disabled}
      className={classNames(
        'btn btn-ghost w-full p-3 text-left normal-case font-normal',
        btnClassName,
        { disabled }
      )}
      onClick={() => !disabled && onClick?.()}
    >
      <div className={classNames('flex items-center w-full', contentClassName)}>
        <div
          className="w-4 mr-2 text-inherit"
          hidden={!loading && !SvgIcon && !faIcon}
        >
          {loading && <Spinner />}
          {!loading && SvgIcon && (
            <SvgIcon className={classNames(iconClass, iconClassName)} />
          )}
          {!loading && faIcon && (
            <FontAwesomeIcon
              inverse
              className={classNames(iconClass, iconClassName)}
              icon={faIcon}
            />
          )}
        </div>
        <div>
          <div className="text-xs sm:text-sm">{text}</div>
          {subText && (
            <div className="text-base-content/40 text-xs">{subText}</div>
          )}
        </div>
      </div>
    </button>
    {RightSvgIcon && (
      <button
        type="button"
        className="absolute right-2 p-1"
        onClick={onRightIconClick}
        aria-label="right-button"
      >
        <RightSvgIcon
          className={classNames(
            rightIconClass,
            onRightIconClick && 'cursor-pointer'
          )}
        />
      </button>
    )}
  </div>
)
