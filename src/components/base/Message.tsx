import {
  faExclamationCircle,
  faTimesCircle,
  faTriangleExclamation,
  faXmark,
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { animated, useTransition } from '@react-spring/web'
import classNames from 'classnames'
import { FC } from 'react'
import SuccessIcon from 'assets/svg/icon-success.svg?react'
import { Spinner } from '.'

export enum MessageType {
  Error = 'Error',
  Loading = 'Loading',
  Success = 'Success',
  Warning = 'Warning',
  DownloadError = 'DownloadError',
}

export interface MessageProps {
  text: string
  textClassName?: string
  detail?: string
  detailClassName?: string
  className?: string
  type: MessageType
  onClose?: () => void
}

const getIconClassName = (type: MessageType): string => {
  switch (type) {
    case MessageType.Error:
      return 'text-error'
    case MessageType.Loading:
      return 'text-primary'
    case MessageType.Success:
      return 'text-success'
    case MessageType.DownloadError:
      return 'bg-error'
    default:
      return ''
  }
}

const getIcon = (type: MessageType) => {
  switch (type) {
    case MessageType.Error:
      return (
        <FontAwesomeIcon
          icon={faTimesCircle}
          className={classNames('mt-0.5', getIconClassName(type))}
        />
      )
    case MessageType.Success:
      return <SuccessIcon />
    case MessageType.DownloadError:
      return (
        <div
          className={classNames(
            'px-2 py-1 rounded-full bg',
            getIconClassName(type)
          )}
        >
          <FontAwesomeIcon
            icon={faTriangleExclamation}
            className="text-base-100"
          />
        </div>
      )
    default:
      return (
        <FontAwesomeIcon
          icon={faExclamationCircle}
          className={classNames('mt-0.5', getIconClassName(type))}
        />
      )
  }
}

const Message: FC<MessageProps> = ({
  type,
  text,
  textClassName,
  detail,
  detailClassName,
  className,
  onClose,
}) => {
  const transition = useTransition(true, {
    from: { opacity: 0, transform: 'translate3d(30px, 0,0)' },
    enter: { opacity: 1, transform: 'translate3d(0,0,0)' },
    leave: { opacity: 0, transform: 'translate3d(0, -30px,0)' },
  })

  return transition(
    (styles, item) =>
      item && (
        <animated.div
          className="flex w-full justify-end fixed top-0 z-50"
          style={styles}
        >
          <div
            className={classNames(
              'sm:w-[25rem] w-full h-[4rem] flex items-center justify-between p-2 bg-white',
              'sm:mx-4 mx-2 sm:my-20 my-12',
              'shadow-2xl border-gray-100 border-2 rounded-lg',
              className
            )}
          >
            <div className="flex items-center">
              {type === MessageType.Loading ? (
                <Spinner className={getIconClassName(type)} />
              ) : (
                getIcon(type)
              )}
              <div>
                <div className={classNames('pl-2 text-sm', textClassName)}>
                  {text}
                </div>
                {detail && (
                  <div
                    className={classNames(
                      'pl-2 whitespace-pre-wrap text-xs',
                      detailClassName
                    )}
                  >
                    {detail}
                  </div>
                )}
              </div>
            </div>
            {onClose && (
              <FontAwesomeIcon
                icon={faXmark}
                className="mr-2 cursor-pointer"
                onClick={onClose}
              />
            )}
          </div>
        </animated.div>
      )
  )
}

export default Message
