export enum NotifyType {
  EMAIL = 'email',
  NONE = 'none',
  SMS = 'sms',
}

export interface NotificationQuery {
  notifyType?: string
  phoneNumber?: string
  email?: string
}
