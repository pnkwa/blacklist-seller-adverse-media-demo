import classNames from 'classnames'
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'
import { FC, useState } from 'react'
import { t } from 'i18next'
import exampleDarkTheme from 'assets/exampleDarkTheme.png'
import exampleLightTheme from 'assets/exampleLightTheme.png'
import IconMoon from 'assets/svg/icon-moon.svg?react'
import IconSun from 'assets/svg/icon-sun.svg?react'

ChartJS.register(ArcElement, Tooltip, Legend)

interface ResultSummaryBoxProps {
  className?: string
}

export const PreviewBox: FC<ResultSummaryBoxProps> = ({ className }) => {
  const [isDarkTheme, setIsDarkTheme] = useState(false)

  const toggleTheme = () => {
    setIsDarkTheme((prevTheme) => !prevTheme)
  }
  return (
    <div
      className={classNames(
        'content-box px-0 pb-0 lg:max-w-[400px] max-h-full overflow-hidden flex flex-col',
        className
      )}
    >
      <div className="flex items-center justify-between m-8">
        <p>{t('settingsPage.preview.title')}</p>
        <div className="flex cursor-pointer gap-2">
          <IconSun />
          <div>{t('settingsPage.preview.theme.light')}</div>
          <input
            type="checkbox"
            value="synthwave"
            className="toggle theme-controller border-2"
            checked={isDarkTheme}
            onChange={toggleTheme}
          />
          <IconMoon />
          <div>{t('settingsPage.preview.theme.dark')}</div>
        </div>
      </div>
      <div className="flex justify-center items-center">
        <img
          src={isDarkTheme ? exampleDarkTheme : exampleLightTheme}
          alt=""
          className="max-w-[230px] h-auto mb-2"
        />
      </div>
    </div>
  )
}
