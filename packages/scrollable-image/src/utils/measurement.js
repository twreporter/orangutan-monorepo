export function getElementHeight(element) {
  return element
    ? element.getBoundingClientRect().height || element.offsetHeight || 0
    : 0
}
