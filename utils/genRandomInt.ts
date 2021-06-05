export default function getRandomInt(min = 0, max = 1) {
  if (max - min < 0 || !Number.isInteger(min) || !Number.isInteger(max))
    throw new Error("Invalid max or min value.")

  const range = max - min + 1

  return min + Math.floor(Math.random() * range)
}
