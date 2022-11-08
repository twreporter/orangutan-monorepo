const isClientSide =
  typeof window !== 'undefined' && typeof window.document !== 'undefined'

const scrollableAncestorValue =
  isClientSide &&
  document.currentScript.getAttribute('data-scrollable-ancestor')
export const scrollableAncestor = scrollableAncestorValue || undefined

const offsetTopValue =
  isClientSide && document.currentScript.getAttribute('data-offset-top')
export const offsetTop =
  offsetTopValue &&
  Number.isInteger(Number(offsetTopValue)) &&
  Number(offsetTopValue) > 0
    ? offsetTopValue
    : 0
