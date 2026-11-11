export function validateTitle(value) {
  if (typeof value !== 'string') return null
  const title = value.trim()
  if (title.length < 1 || title.length > 120) return null
  return title
}

export function validateId(value) {
  if (typeof value !== 'string' || !/^[1-9]\d*$/.test(value)) return null
  const id = Number(value)
  return Number.isSafeInteger(id) ? id : null
}
