/** Грубые прямоугольники относительно центра Москвы (учебная модель). */
export const REGION_BOUNDS = {
  nw: { south: 55.76, north: 55.86, west: 37.35, east: 37.52 },
  ne: { south: 55.76, north: 55.86, west: 37.52, east: 37.72 },
  sw: { south: 55.68, north: 55.76, west: 37.42, east: 37.62 },
  se: { south: 55.68, north: 55.76, west: 37.62, east: 37.72 }
}

export function inBounds(lat, lng, preset) {
  if (!preset || preset === 'all') return true
  const b = REGION_BOUNDS[preset]
  if (!b) return true
  return lat >= b.south && lat <= b.north && lng >= b.west && lng <= b.east
}
