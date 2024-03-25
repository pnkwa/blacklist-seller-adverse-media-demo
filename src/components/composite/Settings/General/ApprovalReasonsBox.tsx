import classNames from 'classnames'
import React from 'react'
import { Masterdata } from 'types/generic'

interface ApprovalReasonsBoxProps {
  reasons: Masterdata[] | undefined
}

const Item = ({ children }: { children?: React.ReactNode }) => (
  <div
    className={classNames(
      'w-full border rounded-box h-20 flex items-center px-4',
      'py-2'
    )}
  >
    <p>{children}</p>
  </div>
)

export const ApprovalReasonsBox: React.FC<ApprovalReasonsBoxProps> = ({
  reasons,
}) => {
  return (
    <div className="w-full space-y-4 mt-2">
      {reasons?.map((reason, index) => (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2" key={index}>
          <Item>{reason.translations?.th}</Item>
          <Item>{reason.translations?.en}</Item>
        </div>
      ))}
    </div>
  )
}
