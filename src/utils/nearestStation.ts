import type { Station } from '../types/railway';

export interface NearbyStationMatch {
  station: Station;
  distanceKm: number;
}

function toRad(deg: number): number {
  return (deg * Math.PI) / 180;
}

export function haversineDistanceKm(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number {
  const R = 6371;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) * Math.sin(dLng / 2);
  return 2 * R * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export function findNearestPassengerStations(
  lat: number,
  lng: number,
  stations: Station[],
  limit = 3
): NearbyStationMatch[] {
  return stations
    .filter((s) => !s.zone.includes('DFC'))
    .map((station) => ({
      station,
      distanceKm: Number(haversineDistanceKm(lat, lng, station.lat, station.lng).toFixed(1)),
    }))
    .sort((a, b) => a.distanceKm - b.distanceKm)
    .slice(0, limit);
}

export function requestDeviceCoordinates(): Promise<{ lat: number; lng: number }> {
  return new Promise((resolve, reject) => {
    if (typeof navigator === 'undefined' || !navigator.geolocation) {
      reject(new Error('Your browser does not support device geolocation. Please select a boarding station manually.'));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
      },
      (err) => {
        if (err.code === err.PERMISSION_DENIED) {
          reject(
            new Error(
              'Location permission was denied. Allow location access in your browser bar or pick your boarding station manually.'
            )
          );
        } else if (err.code === err.POSITION_UNAVAILABLE) {
          reject(
            new Error(
              'Device location could not be determined right now. Check GPS/network settings or choose your boarding place manually.'
            )
          );
        } else if (err.code === err.TIMEOUT) {
          reject(new Error('Location request timed out. Please try again or pick a boarding place manually.'));
        } else {
          reject(new Error('Unable to access device location. Please select your boarding station manually.'));
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 12000,
        maximumAge: 60000,
      }
    );
  });
}
