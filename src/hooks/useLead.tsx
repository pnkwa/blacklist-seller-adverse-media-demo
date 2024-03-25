import { useCallback, useMemo } from 'react'
import { Lead } from 'types/tenantConfig/lead'
import { useCaseKeeperContext } from 'context/CaseKeeperContext'
import { useModalContext } from 'components/composite/Modal/ModalProvider'
import { LeadModal } from 'components/composite/Modal/LeadModal'
import { useTenantConfigContext } from 'context/TenantConfigContext'

export const useLead = () => {
  const { generateLead } = useCaseKeeperContext()
  const { leads } = useTenantConfigContext()
  const { renderElement, destroy } = useModalContext()

  const onShowLead = useCallback(
    async (lead: Lead) =>
      new Promise((resolve) => {
        renderElement(
          <LeadModal
            lead={lead}
            onConfirm={async () => {
              const { featureName } = lead
              if (!featureName) return
              await generateLead(featureName)
              destroy()
              resolve(true)
            }}
            onCancel={() => {
              destroy()
              resolve(false)
            }}
          />
        )
      }),
    [destroy, generateLead, renderElement]
  )

  const onFindAndShowLead = useCallback(
    async (alias: string) => {
      const lead = leads?.find(({ alias: leadAlias }) => leadAlias === alias)
      if (lead) onShowLead(lead)
    },
    [leads, onShowLead]
  )

  return useMemo(() => ({ onFindAndShowLead }), [onFindAndShowLead])
}
