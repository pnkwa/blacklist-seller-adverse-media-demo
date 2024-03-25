import { KeyboardEventHandler } from 'react'

/**
 * call a specified function when the "Enter" key came from keyboard event
 *
 * example: `<div onClick={onClick} onKeyDown={onEnterKey(onClick)} />`
 */
export const onEnterKey =
  (onClick?: () => unknown): KeyboardEventHandler =>
  (e) => {
    if (e.key === 'Enter') onClick?.()
  }

export const getIndexedId = (name: string, index = 1) => {
  const found = document.getElementById(`${name}-${index}`)
  if (found) return getIndexedId(name, index + 1)
  return `${name}-${index}`
}
