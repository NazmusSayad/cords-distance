export type Options = {
  latitude: number
  longitude: number
  altitude?: number /* Meters */
  accuracy?: number /* Meters */
  altitudeAccuracy?: number /* Meters */
}

const defaultOptions = {
  altitude: 0,
  accuracy: 0,
  altitudeAccuracy: 0,
}

export default function cordsDistance(cords1: Options, cords2: Options) {
  const location1 = { ...defaultOptions, ...cords1 }
  const location2 = { ...defaultOptions, ...cords2 }

  const R = 6371 // Radius of the Earth in kilometers

  const lat1Rad = (location1.latitude * Math.PI) / 180
  const lon1Rad = (location1.longitude * Math.PI) / 180
  const lat2Rad = (location2.latitude * Math.PI) / 180
  const lon2Rad = (location2.longitude * Math.PI) / 180

  const dLat = lat2Rad - lat1Rad
  const dLon = lon2Rad - lon1Rad

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1Rad) *
      Math.cos(lat2Rad) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2)

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))

  const horizontalDistance = R * c // Horizontal distance in kilometers

  const altitudeDiff = location2.altitude - location1.altitude // Altitude difference

  // Calculate the optimal distance (where accuracy is assumed to be 0)
  const distance = Math.sqrt(horizontalDistance ** 2 + altitudeDiff ** 2)

  // Calculate the minimum and maximum possible distances based on accuracy
  const minDistance =
    horizontalDistance - location1.accuracy / 1000 - location2.accuracy / 1000
  const maxDistance =
    horizontalDistance + location1.accuracy / 1000 + location2.accuracy / 1000

  // Calculate the minimum and maximum possible altitude differences based on altitudeAccuracy
  const minAltitudeDiff =
    altitudeDiff -
    location1.altitudeAccuracy / 1000 -
    location2.altitudeAccuracy / 1000
  const maxAltitudeDiff =
    altitudeDiff +
    location1.altitudeAccuracy / 1000 +
    location2.altitudeAccuracy / 1000

  // Calculate the total minimum and maximum possible distances
  const min = Math.sqrt(minDistance ** 2 + minAltitudeDiff ** 2)
  const max = Math.sqrt(maxDistance ** 2 + maxAltitudeDiff ** 2)

  return { distance, min, max }
}
