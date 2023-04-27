export const packageName = 'scrollable-image'
export const namespace = '__twreporterEmbeddedData'
export const cdnLinkPrefix =
  'https://unpkg.com/@twreporter/orangutan@latest/dist/'

const isClientSide =
  typeof window !== 'undefined' && typeof window.document !== 'undefined'
const offsetTopValue =
  isClientSide && document.currentScript.getAttribute('data-offset-top')
export const OFFSET_TOP =
  offsetTopValue &&
  Number.isInteger(Number(offsetTopValue)) &&
  Number(offsetTopValue) > 0
    ? offsetTopValue
    : 0
