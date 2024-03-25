import classNames from 'classnames'
import { useCallback } from 'react'
import { Toggle } from 'components/base'

interface ToggleBoxProps {
  title: string
  subtitle?: string
  onToggleChange: (value: boolean) => void
  checked?: boolean
}

export const ToggleBox: React.FC<ToggleBoxProps> = ({
  title,
  subtitle,
  onToggleChange,
  checked,
}) => {
  const handleToggleChange = useCallback(
    (e) => {
      onToggleChange(e.target.checked)
    },
    [onToggleChange]
  )

  return (
    <div
      className={classNames(
        'flex justify-between border rounded-box h-20 items-center p-4',
        'my-2'
      )}
    >
      <div>
        <p className="text-base">{title}</p>
        {subtitle && <p className="text-neutral-400">{subtitle}</p>}
      </div>
      <Toggle
        id="useCriteriaSettingsByPosition"
        name="useCriteriaSettingsByPosition"
        checked={checked}
        onChange={handleToggleChange}
      />
    </div>
  )
}
