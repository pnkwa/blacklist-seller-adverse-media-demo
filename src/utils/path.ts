export const findClientName = () =>
  window.location.hostname.split('.')[0].replace(/-(dev|qa|uat)/, '')
