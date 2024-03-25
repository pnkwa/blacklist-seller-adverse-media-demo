export interface TabItemConfig {
  key: string
  label: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  content?: React.ReactNode | React.FC<any>
  count?: number
}
