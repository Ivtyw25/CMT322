export type GeoPoint = { lat: number; lng: number };

const ENDPOINT = 'https://nominatim.openstreetmap.org/reverse';

type NominatimAddress = Partial<
  Record<
    | 'house_number'
    | 'road'
    | 'neighbourhood'
    | 'suburb'
    | 'quarter'
    | 'city_district'
    | 'city'
    | 'town'
    | 'village'
    | 'municipality'
    | 'postcode',
    string
  >
>;

type NominatimResponse = { display_name?: string; address?: NominatimAddress };

const firstOf = (address: NominatimAddress, keys: readonly (keyof NominatimAddress)[]) =>
  keys.map((key) => address[key]).find((value): value is string => Boolean(value));

/** "12 Jalan Penang, Georgetown, 10000 George Town" from the address parts, or the full name. */
function toStreetAddress(body: NominatimResponse): string | null {
  const address = body.address;
  if (!address) return body.display_name?.trim() || null;
  const street = [address.house_number, address.road].filter(Boolean).join(' ');
  const place = firstOf(address, ['neighbourhood', 'suburb', 'quarter', 'city_district']);
  const city = firstOf(address, ['city', 'town', 'village', 'municipality']);
  const locality = [address.postcode, city].filter(Boolean).join(' ');
  const parts = [street, place, locality].filter((part) => part !== '');
  if (street === '')
    return body.display_name?.trim() || (parts.length > 0 ? parts.join(', ') : null);
  return parts.join(', ');
}

/**
 * Looks up the street address of a map point with OpenStreetMap Nominatim. Gives null when the
 * point has no address, and throws when the request fails or is aborted. This is the one place
 * that knows the service, so another geocoder can replace it.
 */
export async function reverseGeocode(point: GeoPoint, signal: AbortSignal): Promise<string | null> {
  const query = new URLSearchParams({
    format: 'jsonv2',
    lat: String(point.lat),
    lon: String(point.lng),
    'accept-language': 'en',
    addressdetails: '1',
    zoom: '18',
  });
  const response = await fetch(`${ENDPOINT}?${query}`, { signal });
  if (!response.ok) throw new Error(`Reverse geocoding failed with status ${response.status}`);
  const body: unknown = await response.json();
  if (typeof body !== 'object' || body === null) return null;
  return toStreetAddress(body as NominatimResponse);
}
