export const calculatePercentages = (
  objectResponses: Record<string, number>,
): Record<string, string> => {
  const keys = Object.keys(objectResponses)
  const values = Object.values(objectResponses)

  if (!values.length) {
    return {}
  }

  const max = Math.max(...values, 0)

  const result: Record<string, string> = {}

  keys.forEach((key) => {
    // If max is 0, avoid division by zero and set to 0%
    result[key] =
      max === 0 ? "0%" : `${((objectResponses[key] / max) * 100).toFixed()}%`
  })

  return result
}
