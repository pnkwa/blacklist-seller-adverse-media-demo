import { ValidationType } from 'types/generic'
import {
  validateCitizenId,
  getAllFieldValidations,
  getValidations,
  validateLink,
} from './form'

describe('form utils', () => {
  describe('validateCitizenId', () => {
    it('return false if length less than 13', () => {
      expect(validateCitizenId('abc')).toBe(false)
    })
    it('return false if citizen id is incorrect', () => {
      expect(validateCitizenId('1231232121231')).toBe(false)
    })
    it('return true if citizen id is correct', () => {
      expect(validateCitizenId('1101700207030')).toBe(true)
    })
  })

  describe('validateLink', () => {
    it('should return false for valid HTTPS links', () => {
      expect(validateLink('https://example.com')).toBeFalsy()
      expect(validateLink('https://example.co.th')).toBeFalsy()
      expect(validateLink('https://example')).toBeFalsy()
    })

    it('should return false for empty links', () => {
      expect(validateLink('')).toBeFalsy()
      expect(validateLink(null)).toBeFalsy()
      expect(validateLink(undefined)).toBeFalsy()
    })

    it('should return true for invalid links', () => {
      expect(validateLink('http://example.com')).toBeTruthy()
      expect(validateLink('http:///example.com')).toBeTruthy()
      expect(validateLink('https:/example')).toBeTruthy()
    })
  })

  describe('fieldValidations', () => {
    const validate = getAllFieldValidations()
    describe('citizenID', () => {
      it('return true if citizen ID is valid', () => {
        expect(validate.citizenID('1-10170-0207-03-0')).toBe(true)
      })
      it('return error message if citizen ID is not valid', () => {
        expect(validate.citizenID('9-99999-9999-99-9')).toBe(
          'validation.citizenID'
        )
      })
    })
    describe('required', () => {
      it('return true if string exists', () => {
        expect(validate.required('abc')).toBe(true)
      })
      it('return error message string if string is empty', () => {
        expect(validate.required('')).toBe('validation.required')
      })
    })
    describe('phoneNumber', () => {
      it('return true if phone number is valid', () => {
        expect(validate.phoneNumber('0999123123')).toBe(true)
        expect(validate.phoneNumber('0887772222')).toBe(true)
      })
      it('return error message if phone number is not valid', () => {
        expect(validate.phoneNumber('+66847286333')).toBe('validation.phone')
        expect(validate.phoneNumber('+14155552671')).toBe('validation.phone')
        expect(validate.phoneNumber('+6512345678')).toBe('validation.phone')
        expect(validate.phoneNumber('091232131232312')).toBe('validation.phone')
      })
    })
    describe('thaiAlphabet', () => {
      it('return true if string is Thai', () => {
        expect(validate.thaiAlphabet('นามสกุล')).toBe(true)
      })
      it('return error message if string is not Thai', () => {
        expect(validate.thaiAlphabet('abc')).toBe('validation.thaiName')
      })
    })
    describe('email', () => {
      it('return true if string is valid email', () => {
        expect(validate.email('a@a.com')).toBe(true)
      })
      it('return error message if string is not valid email', () => {
        expect(validate.email('abc')).toBe('validation.email')
      })
    })
    describe('minimumZero', () => {
      it('return true if string is number and more than zero', () => {
        expect(validate.minimumZero('12')).toBe(true)
      })
      it('return error message if condition not met', () => {
        expect(validate.minimumZero('abc')).toBe('validation.retryLimit')
      })
    })
    describe('dobNormal', () => {
      it('return true if birthday meet condition', () => {
        expect(validate.dobNormal('2002-03-29')).toBe(true)
      })
      it('return error message if condition not met', () => {
        expect(validate.dobNormal('2022-01-01')).toBe('validation.dobCaseType')
      })
    })
    describe('dobJuvenile', () => {
      it('return true if birthday meet condition', () => {
        expect(validate.dobJuvenile('2014-12-12')).toBe(true)
      })
      it('return error message if condition not met', () => {
        expect(validate.dobJuvenile('2022-01-01')).toBe(
          'validation.dobCaseType'
        )
      })
    })
    describe('dobJuvenileMinus7', () => {
      it('return true if birthday meet condition', () => {
        expect(validate.dobJuvenileMinus7('2020-12-12')).toBe(true)
      })
      it('return error message if condition not met', () => {
        expect(validate.dobJuvenileMinus7('2002-01-01')).toBe(
          'validation.dobCaseType'
        )
      })
    })
    describe('pdfPassword', () => {
      it('return true if password meets condition', () => {
        expect(validate.pdfPassword('1234aA')).toBe(true)
        expect(validate.pdfPassword('12345678aaAA')).toBe(true)
        expect(validate.pdfPassword('1aA@#%.!-_=+/')).toBe(true)
        expect(validate.pdfPassword('aaaaaa1อิอิAA')).toBe(true)
        expect(
          validate.pdfPassword(
            '11111111112222222222333333333344444444445555555555666666666677aA'
          )
        ).toBe(true)
      })
      it('return error message if condition not met', () => {
        expect(validate.pdfPassword('11111')).toBe(
          'validation.minPasswordLength'
        )
        expect(validate.pdfPassword('1aA')).toBe('validation.minPasswordLength')
        expect(validate.pdfPassword('123456 aA')).toBe(
          'validation.pdfPasswordBlacklistedChar'
        )
        expect(validate.pdfPassword('1aAAAAA$')).toBe(
          'validation.pdfPasswordBlacklistedChar'
        )
        expect(
          validate.pdfPassword(
            '111111111122222222223333333333444444444455555555556666666666777aA'
          )
        ).toBe('validation.maxPasswordLength')
      })
    })
    describe('getValidations', () => {
      it('return empty object if undefined', () => {
        expect(getValidations(undefined)).toStrictEqual({})
      })
      it('return validation object with ValidationType as function key', () => {
        expect(getValidations([ValidationType.REQUIRED])).toHaveProperty(
          ValidationType.REQUIRED
        )
      })
    })
  })
})
