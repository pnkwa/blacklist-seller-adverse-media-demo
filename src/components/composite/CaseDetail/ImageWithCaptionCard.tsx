import classNames from 'classnames'
import { useEffect, useState } from 'react'
import { SVGAssetComponent } from 'types/generic'

interface ImageWithCaptionCardProps {
  src: string | null | undefined
  svgIcon: SVGAssetComponent | string
  title: string
  description: string
  className?: string
}

const ImageWithCaptionCard: React.FC<ImageWithCaptionCardProps> = ({
  src: srcProps,
  svgIcon: SvgIcon,
  title,
  description,
  className,
}) => {
  const [src, setSrc] = useState(srcProps)

  useEffect(() => {
    setSrc(srcProps)
  }, [srcProps])

  return (
    <div
      className={classNames(
        'shadow-md rounded-lg flex flex-row h-[200px] w-full transition-all',
        'sm:flex-col sm:h-[300px] sm:w-[200px]',
        className
      )}
    >
      <div
        className={classNames(
          'w-full aspect-square bg-base-300 rounded-t-lg overflow-hidden flex justify-center',
          'items-center max-w-[200px]'
        )}
      >
        {src ? (
          <img
            className="w-full h-full object-cover"
            src={src}
            alt={title}
            onError={() => setSrc(undefined)}
          />
        ) : (
          <SvgIcon className="text-base-200 w-[120px] h-full m-8" />
        )}
      </div>
      <div className="p-2 w-full sm:w-[200px]">
        <div className="flex content-baseline">
          <SvgIcon width={20} height={20} className="min-w-[20px]" />
          <h3 className="ml-2 text-sm font-bold">{title}</h3>
        </div>
        <p className="text-base-content text-opacity-50 text-xs mt-2">
          {description}
        </p>
      </div>
    </div>
  )
}

export default ImageWithCaptionCard
