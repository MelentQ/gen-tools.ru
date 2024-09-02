export default function getNumEnding(value, words) {
  if (value === '∞') return words[2]

  value = Math.abs(value) % 100
  const num = value % 10
  if ((value > 10 && value < 20) || num === 0) return words[2]
  if (num > 1 && num < 5) return words[1]
  if (num === 1) return words[0]
  return words[2]
}
