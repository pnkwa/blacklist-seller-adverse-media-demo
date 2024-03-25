import { useTranslation } from 'react-i18next'
import { FC } from 'react'
import CalenderIcon from 'assets/svg/icon-calendar.svg?react'
import { dateFormat } from 'utils/date'

interface AttemptTitleProps {
  errorTranslationPrefix: string
  count: number
  date: Date | string
}
const AttemptTitle: FC<AttemptTitleProps> = ({
  errorTranslationPrefix,
  count,
  date,
}) => {
  const { t } = useTranslation()
  return (
    <div className="flex flex-col justify-between sm:flex-row sm:pt-7">
      <p>{t(`${errorTranslationPrefix}`, { count })}</p>
      <p className="inline-flex pr-6">
        <CalenderIcon className="mr-2" />
        {dateFormat(date, 'DD/MM/YYYY - HH:mm')}
      </p>
    </div>
  )
}

export default AttemptTitle
