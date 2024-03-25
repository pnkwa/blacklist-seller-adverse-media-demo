import { v4 as uuid } from 'uuid'
import { useTranslation } from 'react-i18next'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMinusCircle, faPlusCircle } from '@fortawesome/free-solid-svg-icons'
import classNames from 'classnames'
import { BlacklistedCompany } from 'types/bgcCore'
import { Dropdown } from 'components/base/Dropdown'
import { Masterdata } from 'types/generic'
import { generateTemporalArray } from 'utils/date'
import { masterdataToOption, temporalToMasterdata } from 'utils/masterdata'
import {
  CriteriaTopic,
  OverriddenFormControl,
  ProcessCriteriaFormProps,
  boxClass,
} from './common'

interface BlacklistedCompanyButtonProps {
  showAddButton: boolean
  disabled?: boolean
  index: number
  onChange: ProcessCriteriaFormProps['onChange']
  criteria: ProcessCriteriaFormProps['criteria']
  className?: string
  label?: string
}

const yearGapMasterdata = generateTemporalArray(10).map(temporalToMasterdata)

const jobSwitchTimesMasterdata: Masterdata[] = Array(20)
  .fill(null)
  .map((_, index) => ({
    key: (index + 1) as unknown as string,
    translations: {
      th: `${index + 1} ครั้ง`,
      en: `${index + 1} time${index ? 's' : ''}`,
    },
  }))

const getNewCompany = (): BlacklistedCompany => ({
  id: uuid(),
  name: '',
  within: 'P1Y',
})

const AddRemoveCompanyButton: React.FC<BlacklistedCompanyButtonProps> = ({
  showAddButton,
  onChange,
  index,
  criteria,
  className,
  label,
  disabled,
}) => (
  <button
    className={classNames(className)}
    type="button"
    disabled={disabled}
    aria-label={showAddButton ? 'add' : 'remove'}
    onClick={() => {
      const newList = [...(criteria?.blacklistedCompanies ?? [])]
      if (showAddButton) newList.push(getNewCompany())
      else newList.splice(index, 1)
      onChange?.({
        ...criteria,
        blacklistedCompanies: newList,
      })
    }}
  >
    <FontAwesomeIcon
      className="block"
      icon={showAddButton ? faPlusCircle : faMinusCircle}
    />
    {label}
  </button>
)

export const SocialSecurityHistoryCriteriaForm: React.FC<
  ProcessCriteriaFormProps
> = ({ criteria, onChange }) => {
  const { t } = useTranslation()

  const { overEmployed, maxYearGap, jobSwitch, blacklistedCompanies } =
    criteria ?? {}

  const yearGapOptions = yearGapMasterdata.map(masterdataToOption)
  const jobSwitchTimesOptions = jobSwitchTimesMasterdata.map(masterdataToOption)

  return (
    <div className="sm:space-y-2">
      <div className="mb-4 whitespace-pre-wrap">
        {t('settingsPage.criteria.socialSecurityHistory.formTitle')}
      </div>
      <CriteriaTopic
        id="overEmployed"
        checked={!!overEmployed}
        label={t('settingsPage.criteria.socialSecurityHistory.overEmployed')}
        onCheck={(checked) =>
          onChange?.({ ...criteria, overEmployed: checked })
        }
      />
      <CriteriaTopic
        id="maxYearGap"
        checked={!!maxYearGap}
        label={t('settingsPage.criteria.socialSecurityHistory.maxYearGap')}
        onCheck={(checked) =>
          onChange?.({ ...criteria, maxYearGap: checked ? 'P1M' : null })
        }
      >
        <OverriddenFormControl
          label={t('generic.moreThan')}
          className="sm:pr-9"
        >
          <Dropdown
            className="min-w-[180px]"
            options={yearGapOptions}
            value={yearGapOptions.find((o) => o.value === maxYearGap)}
            onChange={(option) =>
              onChange?.({ ...criteria, maxYearGap: option.value })
            }
          />
        </OverriddenFormControl>
      </CriteriaTopic>
      <CriteriaTopic
        id="jobSwitch"
        checked={!!jobSwitch}
        label={t('settingsPage.criteria.socialSecurityHistory.jobSwitch')}
        onCheck={(checked) =>
          onChange?.({
            ...criteria,
            jobSwitch: checked ? { lessThan: 1, within: 'P1Y' } : undefined,
          })
        }
      >
        <div
          className={classNames(
            'sm:w-auto space-y-2 sm:space-y-0 sm:flex sm:space-x-4 items-center',
            'sm:pr-9'
          )}
        >
          <Dropdown
            options={jobSwitchTimesOptions}
            value={jobSwitchTimesOptions.find(
              (o) => (o.value as unknown as number) === jobSwitch?.lessThan
            )}
            className="min-w-[180px]"
            onChange={(option) =>
              onChange?.({
                ...criteria,
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                jobSwitch: { ...jobSwitch!, lessThan: option.value },
              })
            }
          />
          <OverriddenFormControl label={t('generic.within')} className="!p-0">
            <Dropdown
              className="min-w-[180px]"
              options={yearGapOptions}
              value={yearGapOptions.find((o) => o.value === jobSwitch?.within)}
              onChange={(option) =>
                onChange?.({
                  ...criteria,
                  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                  jobSwitch: { ...jobSwitch!, within: option.value },
                })
              }
            />
          </OverriddenFormControl>
        </div>
      </CriteriaTopic>
      <CriteriaTopic
        id="blacklistedCompanies"
        checked={!!blacklistedCompanies}
        label={t(
          'settingsPage.criteria.socialSecurityHistory.blacklistedCompanies'
        )}
        className="items-start"
        onCheck={(checked) =>
          onChange?.({
            ...criteria,
            blacklistedCompanies: checked ? [getNewCompany()] : undefined,
          })
        }
        withBoxClass={false}
      >
        <div className="space-y-2">
          {blacklistedCompanies?.map((item, index, arr) => {
            return (
              <div
                className={classNames(
                  boxClass,
                  'space-y-2 sm:space-y-0 sm:pr-9',
                  'sm:flex sm:space-x-4 items-center relative group'
                )}
                key={item.id}
              >
                <OverriddenFormControl
                  label={t(
                    'settingsPage.criteria.socialSecurityHistory.companyNamePlaceholder'
                  )}
                  labelClassName="sm:hidden"
                  className="!p-0"
                >
                  <input
                    value={item.name}
                    name={`${item.id}`}
                    onChange={(e) => {
                      item.name = e.target.value
                      const newList = [...blacklistedCompanies]
                      newList[index] = item
                      onChange?.({
                        ...criteria,
                        blacklistedCompanies: newList,
                      })
                    }}
                    className="w-full sm:w-auto input text-xs sm:text-sm input-bordered h-[38px]"
                    placeholder={t(
                      'settingsPage.criteria.socialSecurityHistory.companyNamePlaceholder'
                    )}
                  />
                </OverriddenFormControl>
                <OverriddenFormControl
                  label={t('generic.within')}
                  className="!p-0"
                >
                  <Dropdown
                    options={yearGapOptions}
                    value={yearGapOptions.find((o) => o.value === item.within)}
                    className="flex-1 sm:flex-initial sm:min-w-[180px]"
                    onChange={(e) => {
                      item.within = e.value
                      const newList = [...blacklistedCompanies]
                      newList[index] = item
                      onChange?.({
                        ...criteria,
                        blacklistedCompanies: newList,
                      })
                    }}
                  />
                </OverriddenFormControl>
                <AddRemoveCompanyButton
                  criteria={criteria}
                  onChange={onChange}
                  index={index}
                  showAddButton={false}
                  className={classNames(
                    'sm:group-first:block sm:block absolute -right-2 sm:right-0 -top-4 sm:top-auto',
                    'z-10 w-5 h-5 bg-white rounded-full text-primary text-2xl sm:text-xl disabled:text-neutral-300'
                  )}
                  disabled={arr.length <= 1}
                />
              </div>
            )
          })}
          <div className="flex-1 block sm:pr-9">
            <AddRemoveCompanyButton
              criteria={criteria}
              onChange={onChange}
              index={0}
              showAddButton
              className="flex items-center ml-auto btn btn-primary btn-sm"
              label={t(
                'settingsPage.criteria.socialSecurityHistory.addCompany'
              )}
            />
          </div>
        </div>
      </CriteriaTopic>
    </div>
  )
}
