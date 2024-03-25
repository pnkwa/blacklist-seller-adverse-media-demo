import { findClientName } from './path'

describe('findClientName', () => {
  it('should return localhost', () => {
    window.location.assign('http://localhost:3000/apps/bgc-dashboard')
    expect(findClientName()).toBe('localhost')
  })

  it('should return mac-portal', () => {
    window.location.assign(
      'https://mac-portal.appmanteam.com/apps/bgc-dashboard'
    )
    expect(findClientName()).toBe('mac-portal')
  })

  it('should return mac-portal', () => {
    window.location.assign(
      'https://mac-portal-dev.appmanteam.com/apps/bgc-dashboard'
    )
    expect(findClientName()).toBe('mac-portal')
  })

  it('should return mac-portal', () => {
    window.location.assign(
      'https://mac-portal-qa.appmanteam.com/apps/bgc-dashboard'
    )
    expect(findClientName()).toBe('mac-portal')
  })

  it('should return mac-portal', () => {
    window.location.assign(
      'https://mac-portal-uat.appmanteam.com/apps/bgc-dashboard'
    )
    expect(findClientName()).toBe('mac-portal')
  })

  it('should return mac-portal-infra', () => {
    window.location.assign(
      'https://mac-portal-infra.appmanteam.com/apps/bgc-dashboard'
    )
    expect(findClientName()).toBe('mac-portal-infra')
  })

  it('should return ktaxa', () => {
    window.location.assign('https://ktaxa.appmanteam.com/apps/case-keeper')
    expect(findClientName()).toBe('ktaxa')
  })

  it('should return ktaxa', () => {
    window.location.assign(
      'https://ktaxa-dev.appmanteam.com/apps/bgc-dashboard'
    )
    expect(findClientName()).toBe('ktaxa')
  })
})
