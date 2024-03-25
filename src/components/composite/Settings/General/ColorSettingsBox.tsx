import classNames from 'classnames'
import { useRef, useState } from 'react'
import { ColorResult, SketchPicker } from 'react-color'
import { useOnClickOutside } from 'hooks/clickOutside'
import { TooltipBox } from 'components/base/TooltipBox'
import { Theme } from 'types/tenantConfig'

interface ColorSettingsBoxProps {
  title: string
  subtitle?: string
  onColorChange?: Record<string, string>
  setFormData: (e) => void
  defaultTheme?: Theme
}

export const ColorSettingsBox: React.FC<ColorSettingsBoxProps> = ({
  title,
  subtitle,
  setFormData,
  defaultTheme,
}) => {
  const menuRef = useRef<HTMLDivElement>(null)
  const [showMenu, setShowMenu] = useState<boolean>(false)
  const [color, setColor] = useState<string>(defaultTheme?.primary ?? '#FFFFFF')

  useOnClickOutside(menuRef, () => setShowMenu(false))

  const handleChange = (newColor: ColorResult) => {
    setColor(newColor.hex)
  }

  const onChangeCompleted = (newColor: ColorResult) => {
    setFormData({ ...defaultTheme, primary: newColor.hex })
  }

  return (
    <div
      className={classNames(
        'flex justify-between border rounded-box h-20 items-center p-4',
        'my-2'
      )}
    >
      <div>
        <p className="text-base">{title}</p>
        <p className="text-neutral-400">{subtitle}</p>
      </div>
      <div className="relative">
        <TooltipBox
          show={showMenu}
          ref={menuRef}
          tooltipContent={
            <SketchPicker
              disableAlpha
              color={color}
              onChange={handleChange}
              onChangeComplete={onChangeCompleted}
            />
          }
          tooltipClassName="p-0"
        >
          <button
            type="button"
            aria-label="color picker"
            className="w-8 h-8 rounded-full border-2"
            style={{ backgroundColor: color }}
            onClick={() => setShowMenu(true)}
          />
        </TooltipBox>
      </div>
    </div>
  )
}
