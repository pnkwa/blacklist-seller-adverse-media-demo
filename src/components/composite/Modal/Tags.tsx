import { FC, useCallback, useState } from 'react'

import { Trans, useTranslation } from 'react-i18next'
import { Flow } from 'types/caseKeeperCore'
import { useCaseKeeperContext } from 'context/CaseKeeperContext'
import { putTag } from 'services/tags'
import { InputTag } from '../InputTag'
import { Modal } from '../Modal'

interface TagModalProps {
  flow: Flow
  label: string
  closeModal: () => void
  setFlowState: (flow: Flow) => void
}

const TagModal: FC<TagModalProps> = ({
  flow,
  label,
  closeModal,
  setFlowState,
}) => {
  const { t } = useTranslation()
  const { userInfo, updateFlow } = useCaseKeeperContext()
  const [tags, setTags] = useState(() => flow?.tags ?? [])

  const onAddTag = useCallback(
    async (tag: string, newTags: string[]) => {
      setTags(newTags)
      await putTag({ name: tag, owner: userInfo?.id })
    },
    [setTags, userInfo?.id]
  )
  const onDelete = useCallback(
    (_tag: string, newTags: string[]) => {
      setTags(newTags)
    },
    [setTags]
  )

  const onConfirm = useCallback(async () => {
    if (!flow?.id) return

    const updatedFlow = await updateFlow(flow.id, {
      tags,
    })
    setFlowState(updatedFlow)
    setTags(updatedFlow?.tags ?? [])
    closeModal()
  }, [closeModal, flow.id, setFlowState, tags, updateFlow])

  const onCancel = useCallback(() => {
    setTags(flow.tags ?? [])
    closeModal()
  }, [setTags, flow.tags, closeModal])

  return (
    <Modal
      onConfirm={onConfirm}
      onCancel={onCancel}
      modalClass="overflow-visible w-[28rem]"
    >
      <div>
        <p className="text-base font-bold">{label}</p>
        <Trans>
          <p className="text-sm text-neutral pb-4 pt-1">{t('tag.subTitle')}</p>
        </Trans>
        <InputTag
          header={label}
          tags={tags}
          classNameInput="m-2"
          onAddTag={onAddTag}
          onDeleteTag={onDelete}
        />
      </div>
    </Modal>
  )
}

export default TagModal
