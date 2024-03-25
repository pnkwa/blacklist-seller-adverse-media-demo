import ReactDOM from 'react-dom/client'
import Message, { MessageProps, MessageType } from 'components/base/Message'

interface MessageRenderProps extends MessageProps {
  duration?: number
  destroyOnClose?: boolean
}

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
const root = ReactDOM.createRoot(document.getElementById('message')!)

let timeout: NodeJS.Timeout | undefined

const destroy = () => {
  if (timeout) clearTimeout(timeout)
  root.render(null)
}

export const renderMessage = (config: MessageRenderProps) => {
  const { duration, destroyOnClose = false, ...props } = config
  if (timeout) clearTimeout(timeout)

  root.render(
    <Message
      {...props}
      onClose={
        destroyOnClose || !!config.onClose
          ? () => {
              if (destroyOnClose) destroy()
              props.onClose?.()
            }
          : undefined
      }
    />
  )
  if (config.type !== MessageType.Loading) {
    timeout = setTimeout(() => {
      timeout = undefined
      destroy()
    }, duration ?? 5000)
  }
}

export const useMessage = () => {
  return {
    render: renderMessage,
    destroy,
  }
}
