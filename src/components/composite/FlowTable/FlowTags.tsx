import { TooltipBox } from 'components/base/TooltipBox'
import { Flow } from 'types/caseKeeperCore'

interface FlowTagsProps {
  flow: Flow
}

const mapTags = (tags?: string[]) =>
  tags?.map((tag) => (
    <span key={tag} className="tag-label text-neutral bg-neutral/20">
      {tag}
    </span>
  ))

export const FlowTags = ({ flow }: FlowTagsProps) => {
  const { tags } = flow

  return (
    <TooltipBox
      tooltipContent={
        <div className="flex flex-wrap gap-1">{mapTags(tags)}</div>
      }
      tooltipClassName="w-full"
    >
      <div className="flex justify-center gap-1">
        {mapTags(tags?.slice(0, 2))}
        {!!tags && tags.length > 2 && (
          <span className="tag-label text-neutral bg-neutral/20">
            +{tags.length - 2}
          </span>
        )}
      </div>
    </TooltipBox>
  )
}
