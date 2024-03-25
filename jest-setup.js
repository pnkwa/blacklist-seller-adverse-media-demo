// Mock `window.location` with Jest spies and extend expect
import 'jest-location-mock'

jest.mock('config/env', () => ({
  env: {
    BASE_URL: '/app/bgc-dashboard',
  },
}))
