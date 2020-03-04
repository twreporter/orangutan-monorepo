// Generate random string for unique id
export default function uniqueIdGenerator(charNum = 5) {
  return Math.random()
    .toString(36)
    .substr(2, charNum)
}
