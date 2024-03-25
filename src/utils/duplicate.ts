import { DuplicateFlow } from 'types/caseKeeperCore/duplicateFlow'
import { Flow, FlowInput, Proprietor } from 'types/caseKeeperCore'

export const matchDuplicateFlows = (inputs: FlowInput[], flows: Flow[]) =>
  inputs.reduce(
    ({ uniqFlows, duplicateFlows }, initialFlow) => {
      const {
        firstName: initialFirstName,
        middleName: initialMiddleName,
        lastName: initialLastName,
        notifyType,
      } = initialFlow.proprietor as Proprietor

      const flowDuplicates = flows.filter(({ proprietor }) => {
        const isMiddleNameMatch =
          (proprietor?.middleName ?? '') === (initialMiddleName ?? '')

        const isMatch =
          proprietor?.firstName === initialFirstName &&
          proprietor?.lastName === initialLastName &&
          isMiddleNameMatch

        return isMatch
      })

      const duplicateResult = {
        duplicates: flowDuplicates,
        initialFlow,
      }

      if (!flowDuplicates.length && notifyType) uniqFlows.push(initialFlow)
      else duplicateFlows.push(duplicateResult)

      return { duplicateFlows, uniqFlows }
    },
    {
      duplicateFlows: [],
      uniqFlows: [],
    } as {
      duplicateFlows: DuplicateFlow[]
      uniqFlows: FlowInput[]
    }
  )
