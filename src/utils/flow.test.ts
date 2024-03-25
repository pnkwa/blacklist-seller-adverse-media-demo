import { Flow, FlowInput, Proprietor, Verification } from 'types/caseKeeperCore'
import { NotifyType } from 'types/kycCore'
import {
  selectContactByType,
  getContact,
  getFlowIdentity,
  getFlowIdentityQuery,
  getZipFileName,
} from './flow'

describe('selectContactByType', () => {
  describe('when notifyType = sms', () => {
    const notifyType = NotifyType.SMS
    it('should return phoneNumber', () => {
      const phoneNumber = '0912223333'
      const email = 'rojeimnida@gmail.com'
      const result = selectContactByType(notifyType)({ phoneNumber, email })
      expect(result).toBe('0912223333')
    })
    it('should return undefined when have no phoneNumber', () => {
      const phoneNumber = undefined
      const email = undefined
      const result = selectContactByType(notifyType)({ phoneNumber, email })

      expect(result).toBe(undefined)
    })
  })
  describe('when notifyType = email', () => {
    const notifyType = NotifyType.EMAIL
    it('should return email', () => {
      const phoneNumber = '0912223333'
      const email = 'rojeimnida@gmail.com'
      const result = selectContactByType(notifyType)({ phoneNumber, email })

      expect(result).toBe(email)
    })
    it('should return undefined when have no phoneNumber', () => {
      const phoneNumber = '0912223333'
      const email = undefined
      const result = selectContactByType(notifyType)({ phoneNumber, email })

      expect(result).toBe(undefined)
    })
  })
  describe('when notifyType = none', () => {
    it('should return undefined', () => {
      const notifyType = NotifyType.NONE
      const phoneNumber = '0912223333'
      const email = 'rojeimnida@gmail.com'
      const result = selectContactByType(notifyType)({ phoneNumber, email })

      expect(result).toBe('0912223333')
    })
  })
})

describe('getContact', () => {
  it('should return data from proprietor', () => {
    const proprietor: Proprietor = {
      id: 'id',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      inviteType: NotifyType.EMAIL,
      phoneNumber: '0921111111',
      email: 'rojeimnida@gmail.com',
    }
    const verification = {
      notifyType: NotifyType.SMS,
      phoneNumber: '0888888888',
      email: 'chaeng@gmail.com',
    } as Verification
    expect(getContact({ proprietor, verification })).toBe('0888888888')
  })

  it('should return data from verification', () => {
    const proprietor: Proprietor = {
      id: 'id',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      inviteType: NotifyType.NONE,
      phoneNumber: '0921111111',
    }
    const verification = {
      notifyType: NotifyType.EMAIL,
      phoneNumber: '0888888888',
      email: 'chaeng@gmail.com',
    } as Verification
    expect(getContact({ proprietor, verification })).toBe('chaeng@gmail.com')
  })
})

describe('getFlowIdentity', () => {
  it('should return firstName, middleName & lastName from input', () => {
    const inputs = [
      {
        verification: {
          id: 'id-1',
        },
        backgroundCheck: {},
        proprietor: {
          firstName: 'บีเบส',
          middleName: 'จูเนียร์',
          lastName: 'เบส',
        },
        flowName: 'idv-bgc',
      },
      {
        verification: {
          id: 'id-2',
        },
        backgroundCheck: {},
        proprietor: {
          firstName: 'เจน',
          middleName: undefined,
          lastName: 'โด',
        },
        flowName: 'idv-bgc',
      },
    ] as FlowInput[]

    expect(getFlowIdentity(inputs)).toEqual([
      {
        firstName: 'บีเบส',
        middleName: 'จูเนียร์',
        lastName: 'เบส',
      },
      {
        firstName: 'เจน',
        lastName: 'โด',
      },
    ])
  })
})

describe('getFlowIdentityQuery', () => {
  it('should return firstName, middleName & lastName from input', () => {
    const inputs = [
      {
        verification: {
          id: 'id-1',
        },
        backgroundCheck: {},
        proprietor: {
          firstName: 'บีเบส',
          middleName: 'จูเนียร์',
          lastName: 'เบส',
        },
        flowName: 'idv-bgc',
      },
      {
        verification: {
          id: 'id-2',
        },
        backgroundCheck: {},
        proprietor: {
          firstName: 'เจน',
          middleName: undefined,
          lastName: 'โด',
        },
        flowName: 'idv-bgc',
      },
    ] as FlowInput[]

    expect(getFlowIdentityQuery(inputs)).toEqual([
      {
        'proprietor-firstName-$eq': 'บีเบส',
        'proprietor-middleName-$eq': 'จูเนียร์',
        'proprietor-lastName-$eq': 'เบส',
      },
      {
        'proprietor-firstName-$eq': 'เจน',
        'proprietor-lastName-$eq': 'โด',
      },
    ])
  })
})

describe('getZipFileName', () => {
  it('should return firstName from input if first name exists', () => {
    const input = {
      verification: {
        firstName: 'กล้วยทอด',
      },
    } as Flow

    expect(getZipFileName(input)).toEqual('กล้วยทอด')
  })

  it('should return id if first name does not exist', () => {
    const input = {
      id: '1234567890',
    } as Flow
    expect(getZipFileName(input)).toEqual('12345678')
  })
})
