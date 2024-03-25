import { useDispatch, useSelector } from 'react-redux'
import { DateRangePicker } from 'components/form/DateRangePicker'
import { getFilterCreatedAtRange, setFilterCreatedAtRange } from 'reducers'
import { DateRangeValue } from 'types/generic'
import { getInitialCreatedAtRange } from 'utils/filter'

export const CreatedAtFilter = () => {
  const dispatch = useDispatch()

  const createdAtRange = useSelector(getFilterCreatedAtRange)

  const onSubmitDate = (value: DateRangeValue) => {
    dispatch(setFilterCreatedAtRange(value))
  }

  return (
    <DateRangePicker
      className="sm:w-80"
      value={createdAtRange}
      onSubmitDate={onSubmitDate}
      defaultValue={getInitialCreatedAtRange()}
    />
  )
}
