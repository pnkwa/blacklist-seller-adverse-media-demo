import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faXmark } from '@fortawesome/free-solid-svg-icons'
import classNames from 'classnames'
import { fetchSuggestedTags } from 'services/tags'
import { Tag as TagType } from 'types/tagger/tag'
import { useOnClickOutside } from 'hooks/clickOutside'
import { SPACE_BAR } from 'utils/regex'
import { logger } from 'utils/logger'
import { isAbortError } from 'utils/error'
import { isValidTag } from 'utils/tagger/tag'

interface TagProps {
  text: string
  onDelete?: (tag: string) => void
  className?: string
}

export const Tag: React.FC<TagProps> = ({ text, onDelete, className }) => (
  <div
    className={classNames(
      'bg-base-300 flex rounded p-1 items-center justify-between',
      'cursor-pointer max-w-full',
      className
    )}
  >
    <p className="text-sm text-left break-all">{text}</p>
    {onDelete && (
      <FontAwesomeIcon
        icon={faXmark}
        className="text-md mx-2 pointer-events-auto min-w-0"
        onClick={() => onDelete(text)}
      />
    )}
  </div>
)

interface InputTagProps {
  tags?: string[]
  header: string
  isReset?: boolean
  placeholder?: string
  classNameInput?: string
  onReset?: () => void
  onAddTag: (tag: string, newTags: string[]) => void
  onDeleteTag: (tag: string, newTags: string[]) => void
  containerClassName?: string
  useBackspaceDeleted?: boolean
}

export const InputTag: React.FC<InputTagProps> = ({
  tags,
  header,
  isReset,
  onReset,
  onAddTag,
  onDeleteTag,
  placeholder,
  classNameInput,
  containerClassName,
  useBackspaceDeleted = false,
}) => {
  const { t } = useTranslation()
  const [focus, setFocus] = useState<boolean>(false)
  const [inputTag, setInputTag] = useState('')
  const [displayTags, setDisplayTags] = useState<string[]>([])
  const [suggestedTags, setSuggestedTags] = useState<TagType[] | undefined>()
  const abortControllerRef = useRef<AbortController | null>()
  const tagBoxRef = useRef<HTMLDivElement>(null)

  const filteredTags = useMemo(
    () =>
      suggestedTags?.filter((tag) => {
        if (displayTags.includes(tag.name)) return false
        if (!inputTag) return true
        return tag.name.toLowerCase().includes(inputTag.toLowerCase())
      }),
    [displayTags, inputTag, suggestedTags]
  )

  const fetchTags = useCallback(async () => {
    try {
      abortControllerRef.current?.abort()
      abortControllerRef.current = new AbortController()
      const tags = await fetchSuggestedTags(abortControllerRef.current.signal)
      setSuggestedTags(tags)
    } catch (err) {
      if (isAbortError(err)) return
      logger.error(err)
    }
  }, [])

  useEffect(() => {
    if (!suggestedTags) fetchTags()
  }, [fetchTags, suggestedTags])

  useEffect(() => {
    if (isReset) {
      setDisplayTags([])
      onAddTag?.('', [])
      onReset?.()
    }
  }, [isReset, onAddTag, onReset])

  const handleOnInputTag = useCallback((e) => {
    if (!isValidTag(e.target.value)) return
    e.target.value = e.target.value.replace(SPACE_BAR, '-').toLowerCase()
    setInputTag(e.target.value)
  }, [])

  const onSave = useCallback(
    (e) => {
      e.preventDefault()
      if (displayTags.includes(inputTag)) return
      onAddTag(inputTag, [...displayTags, inputTag])
      setDisplayTags((t) => [...t, inputTag])
      setInputTag('')
    },
    [displayTags, inputTag, onAddTag]
  )

  const onKeyDown = (e) => {
    const { key } = e
    if (key === 'Enter' && inputTag.length) onSave(e)
    if (useBackspaceDeleted && key === 'Backspace' && !inputTag.length) {
      if (!displayTags.length) return
      const lastTags = displayTags[displayTags.length - 1]
      const newTags = displayTags.filter((tag) => tag !== lastTags)
      setDisplayTags(newTags)
      onDeleteTag(lastTags, newTags)
    }
  }

  const onAddSuggestTag = (tag: string) => {
    onAddTag(tag, [...displayTags, tag])
    setDisplayTags((t) => [...t, tag])
    setInputTag('')
    setFocus(false)
  }

  const onDeleteDisplayTag = (tag: string) => {
    const newTags = displayTags.filter((displayTag) => tag !== displayTag)
    setDisplayTags(newTags)
    onDeleteTag(tag, newTags)
  }

  useOnClickOutside(tagBoxRef, () => {
    setFocus(false)
  })

  useEffect(() => {
    if (tags) setDisplayTags(tags)
  }, [tags])

  return (
    <div
      className={classNames('w-full relative', containerClassName)}
      ref={tagBoxRef}
    >
      <div
        className={classNames(
          'w-full rounded-lg p-2',
          !focus && 'border border-base-300',
          focus && 'outline outline-2 outline-primary'
        )}
        role="button"
        aria-hidden
        onClick={() => setFocus(true)}
      >
        <div className="flex flex-wrap gap-2 overflow-y-auto max-h-60">
          {displayTags.map((tag) => (
            <Tag
              key={tag}
              text={tag}
              onDelete={() => onDeleteDisplayTag(tag)}
            />
          ))}
        </div>
        <div
          className={classNames(
            'w-full flex items-center',
            displayTags?.length && 'mt-2'
          )}
        >
          <input
            value={inputTag}
            placeholder={
              focus
                ? t('tag.placeholder.filter')
                : placeholder ?? t('tag.placeholder.input')
            }
            className={classNames(
              'w-full text-xs border-none outline-none px-2 pr-8',
              classNameInput
            )}
            onChange={handleOnInputTag}
            onKeyDown={onKeyDown}
          />
          <button
            disabled={!inputTag}
            type="button"
            className="btn-primary btn btn-xs mr-2"
            onClick={onSave}
          >
            {t('tag.button')}
          </button>
        </div>
      </div>
      {focus && (
        <div
          className={classNames(
            'z-30 my-2 bg-base-100 py-2',
            'rounded absolute drop-shadow-md'
          )}
        >
          <div className="text-md font-bold px-2 pb-2">{header}</div>
          {filteredTags?.length ? (
            filteredTags.slice(0, 5).map(({ name }) => (
              <button
                key={name}
                className={classNames(
                  'w-full px-2 py-1 border-l-2 border-base-100 group',
                  'hover:bg-base-200 hover:border-l-primary hover-within'
                )}
                type="button"
                aria-label="tag"
                onClick={() => onAddSuggestTag(name)}
              >
                <Tag
                  text={name}
                  className="w-fit group-hover:bg-neutral group-hover:text-base-100"
                />
              </button>
            ))
          ) : (
            <span
              className={classNames(
                'flex w-full h-8 p-2 justify-center items-center',
                'text-xs text-base-content'
              )}
            >
              {t('tag.empty')}
            </span>
          )}
        </div>
      )}
    </div>
  )
}
