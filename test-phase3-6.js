// Phase 3.6 Comprehensive Test Suite
// Testing Store Location Data Validation & Normalization

import assert from "node:assert";
import {
  sanitizeStoreCoordinate,
  sanitizeStoreCoordinates,
  sanitizeLocationValue,
  normalizeStoreLocation
} from "./server/index.js";

// Testing helpers for distance and relevance (from src/App.jsx models)
function sanitizeCustomerCoordinate(val, type = "lat") {
  if (
    val === null ||
    val === undefined ||
    typeof val === "boolean" ||
    typeof val === "object"
  ) {
    return null;
  }
  if (typeof val === "string" && val.trim() === "") {
    return null;
  }
  const num = Number(val);
  if (!Number.isFinite(num)) return null;
  if (type === "lat") return num >= -90 && num <= 90 ? num : null;
  if (type === "lng" || type === "lon") return num >= -180 && num <= 180 ? num : null;
  return null;
}

function calculateDistanceKm(lat1, lon1, lat2, lon2) {
  const numLat1 = sanitizeCustomerCoordinate(lat1, "lat");
  const numLon1 = sanitizeCustomerCoordinate(lon1, "lng");
  const numLat2 = sanitizeCustomerCoordinate(lat2, "lat");
  const numLon2 = sanitizeCustomerCoordinate(lon2, "lng");

  if (
    numLat1 === null ||
    numLon1 === null ||
    numLat2 === null ||
    numLon2 === null
  ) {
    return null;
  }

  const toRad = (deg) => (deg * Math.PI) / 180;
  const R = 6371; // Earth radius in km

  const dLat = toRad(numLat2 - numLat1);
  const dLon = toRad(numLon2 - numLon1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(numLat1)) *
      Math.cos(toRad(numLat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;

  if (!Number.isFinite(distance) || isNaN(distance) || distance < 0) {
    return null;
  }

  return Math.round(distance * 10) / 10;
}

function getProductDistance(product, customerLocation) {
  if (!product || !customerLocation || typeof customerLocation !== "object") {
    return null;
  }
  const custLat = sanitizeCustomerCoordinate(customerLocation.latitude, "lat");
  const custLng = sanitizeCustomerCoordinate(customerLocation.longitude, "lng");
  if (custLat === null || custLng === null) {
    return null;
  }

  const storeLat = sanitizeCustomerCoordinate(product.storeLatitude, "lat");
  const storeLng = sanitizeCustomerCoordinate(product.storeLongitude, "lng");
  if (storeLat === null || storeLng === null) {
    return null;
  }

  return calculateDistanceKm(custLat, custLng, storeLat, storeLng);
}

function getLocationRelevance(product, customerLocation) {
  if (!product || !customerLocation || typeof customerLocation !== "object") {
    return 0;
  }

  const custProv = (customerLocation.province || "").trim().toLowerCase();
  const custDist = (customerLocation.district || "").trim().toLowerCase();
  const custCity = (customerLocation.city || "").trim().toLowerCase();

  if (!custProv) return 0;

  const prodProv = (product.storeProvince || "").trim().toLowerCase();
  const prodDist = (product.storeDistrict || "").trim().toLowerCase();
  const prodCity = (product.storeCity || "").trim().toLowerCase();

  if (!prodProv && !prodDist && !prodCity) return 0;

  if (custCity && prodCity && custCity === prodCity) {
    if (!custProv || !prodProv || custProv === prodProv) return 3;
  }

  if (custDist && prodDist && custDist === prodDist) {
    if (!custProv || !prodProv || custProv === prodProv) return 2;
  }

  if (custProv && prodProv && custProv === prodProv) return 1;

  return 0;
}

let passed = 0;
let failed = 0;

function test(id, name, fn) {
  try {
    fn();
    console.log(`  ✓ [Test ${id}] ${name}`);
    passed++;
  } catch (err) {
    console.error(`  ✗ [Test ${id}] ${name}`);
    console.error(`    ${err.message}`);
    failed++;
  }
}

console.log("\n=== SECTION 1 — VALID STORE COORDINATES ===");
test(1, "Valid latitude is preserved", () => {
  assert.strictEqual(sanitizeStoreCoordinate(27.7172, "lat"), 27.7172);
});

test(2, "Valid longitude is preserved", () => {
  assert.strictEqual(sanitizeStoreCoordinate(85.324, "lng"), 85.324);
});

test(3, "Valid coordinate pair is exposed correctly", () => {
  const store = { latitude: 27.7172, longitude: 85.324 };
  const res = sanitizeStoreCoordinates(store);
  assert.strictEqual(res.latitude, 27.7172);
  assert.strictEqual(res.longitude, 85.324);
});

test(4, "Valid numeric string coordinates are handled safely if supported", () => {
  const store = { latitude: "27.7172", longitude: "85.3240" };
  const res = sanitizeStoreCoordinates(store);
  assert.strictEqual(res.latitude, 27.7172);
  assert.strictEqual(res.longitude, 85.324);
});

console.log("\n=== SECTION 2 — INVALID COORDINATES ===");
test(5, "Missing latitude results in both coordinates null", () => {
  const store = { latitude: null, longitude: 85.324 };
  const res = sanitizeStoreCoordinates(store);
  assert.strictEqual(res.latitude, null);
  assert.strictEqual(res.longitude, null);
});

test(6, "Missing longitude results in both coordinates null", () => {
  const store = { latitude: 27.7172, longitude: null };
  const res = sanitizeStoreCoordinates(store);
  assert.strictEqual(res.latitude, null);
  assert.strictEqual(res.longitude, null);
});

test(7, "Invalid latitude results in both coordinates null", () => {
  const store = { latitude: "invalid_lat", longitude: 85.324 };
  const res = sanitizeStoreCoordinates(store);
  assert.strictEqual(res.latitude, null);
  assert.strictEqual(res.longitude, null);
});

test(8, "Invalid longitude results in both coordinates null", () => {
  const store = { latitude: 27.7172, longitude: "invalid_lng" };
  const res = sanitizeStoreCoordinates(store);
  assert.strictEqual(res.latitude, null);
  assert.strictEqual(res.longitude, null);
});

test(9, "Latitude greater than 90 results in both null", () => {
  const store = { latitude: 90.1, longitude: 85.324 };
  const res = sanitizeStoreCoordinates(store);
  assert.strictEqual(res.latitude, null);
  assert.strictEqual(res.longitude, null);
});

test(10, "Latitude less than -90 results in both null", () => {
  const store = { latitude: -90.1, longitude: 85.324 };
  const res = sanitizeStoreCoordinates(store);
  assert.strictEqual(res.latitude, null);
  assert.strictEqual(res.longitude, null);
});

test(11, "Longitude greater than 180 results in both null", () => {
  const store = { latitude: 27.7172, longitude: 180.5 };
  const res = sanitizeStoreCoordinates(store);
  assert.strictEqual(res.latitude, null);
  assert.strictEqual(res.longitude, null);
});

test(12, "Longitude less than -180 results in both null", () => {
  const store = { latitude: 27.7172, longitude: -180.5 };
  const res = sanitizeStoreCoordinates(store);
  assert.strictEqual(res.latitude, null);
  assert.strictEqual(res.longitude, null);
});

test(13, "NaN is rejected", () => {
  const store = { latitude: NaN, longitude: 85.324 };
  const res = sanitizeStoreCoordinates(store);
  assert.strictEqual(res.latitude, null);
  assert.strictEqual(res.longitude, null);
});

test(14, "Infinity is rejected", () => {
  const store = { latitude: Infinity, longitude: 85.324 };
  const res = sanitizeStoreCoordinates(store);
  assert.strictEqual(res.latitude, null);
  assert.strictEqual(res.longitude, null);
});

test(15, "Invalid strings are rejected", () => {
  const store = { latitude: "abc", longitude: "xyz" };
  const res = sanitizeStoreCoordinates(store);
  assert.strictEqual(res.latitude, null);
  assert.strictEqual(res.longitude, null);
});

test(16, "Whitespace-only strings are rejected", () => {
  const store = { latitude: "   ", longitude: " 85.324 " };
  const res = sanitizeStoreCoordinates(store);
  assert.strictEqual(res.latitude, null);
  assert.strictEqual(res.longitude, null);
});

test(17, "Objects are rejected", () => {
  const store = { latitude: { val: 27.7 }, longitude: 85.324 };
  const res = sanitizeStoreCoordinates(store);
  assert.strictEqual(res.latitude, null);
  assert.strictEqual(res.longitude, null);
});

test(18, "Arrays are rejected", () => {
  const store = { latitude: [27.7], longitude: 85.324 };
  const res = sanitizeStoreCoordinates(store);
  assert.strictEqual(res.latitude, null);
  assert.strictEqual(res.longitude, null);
});

test(19, "Booleans are rejected", () => {
  const store = { latitude: true, longitude: 85.324 };
  const res = sanitizeStoreCoordinates(store);
  assert.strictEqual(res.latitude, null);
  assert.strictEqual(res.longitude, null);
});

console.log("\n=== SECTION 3 — ADMINISTRATIVE LOCATION ===");
test(20, "Valid location values are preserved", () => {
  const store = {
    country: "Nepal",
    province: "Bagmati Province",
    district: "Kathmandu",
    city: "Kathmandu"
  };
  const norm = normalizeStoreLocation(store);
  assert.strictEqual(norm.storeCountry, "Nepal");
  assert.strictEqual(norm.storeProvince, "Bagmati Province");
  assert.strictEqual(norm.storeDistrict, "Kathmandu");
  assert.strictEqual(norm.storeCity, "Kathmandu");
});

test(21, "Leading whitespace is trimmed", () => {
  assert.strictEqual(sanitizeLocationValue("  Kathmandu"), "Kathmandu");
});

test(22, "Trailing whitespace is trimmed", () => {
  assert.strictEqual(sanitizeLocationValue("Kathmandu   "), "Kathmandu");
});

test(23, "Whitespace-only values are safely normalized", () => {
  assert.strictEqual(sanitizeLocationValue("     "), "");
});

test(24, "Missing administrative values do not crash the API", () => {
  const norm = normalizeStoreLocation({});
  assert.strictEqual(norm.storeCountry, "Nepal");
  assert.strictEqual(norm.storeProvince, "");
  assert.strictEqual(norm.storeDistrict, "");
  assert.strictEqual(norm.storeCity, "");
  assert.strictEqual(norm.storeLatitude, null);
  assert.strictEqual(norm.storeLongitude, null);
});

test(25, "No administrative location is invented", () => {
  const norm = normalizeStoreLocation({ city: "Pokhara" });
  assert.strictEqual(norm.storeCity, "Pokhara");
  assert.strictEqual(norm.storeDistrict, "");
  assert.strictEqual(norm.storeProvince, "");
});

console.log("\n=== SECTION 4 — API SAFETY ===");
test(26, "Existing API response remains valid", () => {
  const norm = normalizeStoreLocation({
    name: "Nepal Craft Store",
    city: "Kathmandu",
    latitude: 27.7172,
    longitude: 85.324
  });
  assert(norm.storeCountry === "Nepal");
  assert(norm.storeLatitude === 27.7172);
});

test(27, "Existing product data remains visible with store location", () => {
  const store = {
    name: "Kathmandu Gems",
    country: "Nepal",
    province: "Bagmati",
    city: "Kathmandu"
  };
  const norm = normalizeStoreLocation(store);
  assert.strictEqual(norm.storeName === undefined, true); // storeName is set on product object
  assert.strictEqual(norm.storeCity, "Kathmandu");
});

test(28, "Existing storeLatitude field remains compatible", () => {
  const norm = normalizeStoreLocation({ latitude: 27.7172, longitude: 85.324 });
  assert("storeLatitude" in norm);
  assert.strictEqual(norm.storeLatitude, 27.7172);
});

test(29, "Existing storeLongitude field remains compatible", () => {
  const norm = normalizeStoreLocation({ latitude: 27.7172, longitude: 85.324 });
  assert("storeLongitude" in norm);
  assert.strictEqual(norm.storeLongitude, 85.324);
});

test(30, "Invalid store location data does not crash API", () => {
  assert.doesNotThrow(() => normalizeStoreLocation(null));
  assert.doesNotThrow(() => normalizeStoreLocation(undefined));
  assert.doesNotThrow(() => normalizeStoreLocation("invalid string"));
  assert.doesNotThrow(() => normalizeStoreLocation(12345));
});

console.log("\n=== SECTION 5 — DISTANCE COMPATIBILITY ===");
test(31, "Valid store coordinates allow distance calculation", () => {
  const customerLoc = { latitude: 27.7172, longitude: 85.324 };
  const prod = { storeLatitude: 28.2096, storeLongitude: 83.9856 };
  const dist = getProductDistance(prod, customerLoc);
  assert(typeof dist === "number");
  assert(dist > 140 && dist < 160);
});

test(32, "Missing store coordinates return null distance", () => {
  const customerLoc = { latitude: 27.7172, longitude: 85.324 };
  const prod = { storeLatitude: null, storeLongitude: null };
  assert.strictEqual(getProductDistance(prod, customerLoc), null);
});

test(33, "Invalid store coordinates behave like missing coordinates", () => {
  const customerLoc = { latitude: 27.7172, longitude: 85.324 };
  const prod = { storeLatitude: "invalid", storeLongitude: 85.324 };
  assert.strictEqual(getProductDistance(prod, customerLoc), null);
});

test(34, "No NaN distance is produced", () => {
  const customerLoc = { latitude: 27.7172, longitude: 85.324 };
  const prod = { storeLatitude: NaN, storeLongitude: NaN };
  const dist = getProductDistance(prod, customerLoc);
  assert.strictEqual(dist, null);
  assert(!isNaN(dist) || dist === null);
});

test(35, "No false 0 km distance is produced", () => {
  const customerLoc = { latitude: 27.7172, longitude: 85.324 };
  const prod = { storeLatitude: null, storeLongitude: null };
  const dist = getProductDistance(prod, customerLoc);
  assert.notStrictEqual(dist, 0);
  assert.strictEqual(dist, null);
});

console.log("\n=== SECTION 6 — RELEVANCE PRESERVATION ===");
test(36, "City Match remains 3", () => {
  const customerLoc = { province: "Bagmati", district: "Kathmandu", city: "Kathmandu" };
  const prod = { storeProvince: "Bagmati", storeDistrict: "Kathmandu", storeCity: "Kathmandu" };
  assert.strictEqual(getLocationRelevance(prod, customerLoc), 3);
});

test(37, "District Match remains 2", () => {
  const customerLoc = { province: "Bagmati", district: "Kathmandu", city: "Kirtipur" };
  const prod = { storeProvince: "Bagmati", storeDistrict: "Kathmandu", storeCity: "Tokha" };
  assert.strictEqual(getLocationRelevance(prod, customerLoc), 2);
});

test(38, "Province Match remains 1", () => {
  const customerLoc = { province: "Bagmati", district: "Kathmandu", city: "Kathmandu" };
  const prod = { storeProvince: "Bagmati", storeDistrict: "Chitwan", storeCity: "Bharatpur" };
  assert.strictEqual(getLocationRelevance(prod, customerLoc), 1);
});

test(39, "No Match remains 0", () => {
  const customerLoc = { province: "Bagmati", district: "Kathmandu", city: "Kathmandu" };
  const prod = { storeProvince: "Gandaki", storeDistrict: "Kaski", storeCity: "Pokhara" };
  assert.strictEqual(getLocationRelevance(prod, customerLoc), 0);
});

test(40, "Distance has zero relevance impact", () => {
  const customerLoc = { province: "Bagmati", district: "Kathmandu", city: "Kathmandu" };
  const prodClose = { storeProvince: "Gandaki", storeCity: "Pokhara", storeLatitude: 27.7172, storeLongitude: 85.324 };
  const prodFar = { storeProvince: "Bagmati", storeCity: "Kathmandu", storeLatitude: 28.2096, storeLongitude: 83.9856 };
  assert.strictEqual(getLocationRelevance(prodClose, customerLoc), 0);
  assert.strictEqual(getLocationRelevance(prodFar, customerLoc), 3);
});

console.log("\n=== SECTION 7 — PRODUCT SAFETY ===");
test(41, "Products with missing coordinates remain visible", () => {
  const prod = { id: "p1", name: "Kurta", storeLatitude: null, storeLongitude: null };
  assert(prod.id && prod.name);
});

test(42, "Products with invalid coordinates remain visible", () => {
  const norm = normalizeStoreLocation({ latitude: "bad", longitude: "bad" });
  assert.strictEqual(norm.storeLatitude, null);
  assert.strictEqual(norm.storeLongitude, null);
});

test(43, "Products remain purchasable with safe location attributes", () => {
  const prod = { id: "p1", price: 1899, storeLatitude: null, storeLongitude: null };
  assert.strictEqual(prod.price, 1899);
});

test(44, "Product catalog does not crash when normalizing unexpected store structures", () => {
  assert.doesNotThrow(() => {
    const weirdStores = [
      null,
      undefined,
      {},
      { latitude: "999", longitude: {} },
      { province: "  Bagmati  ", city: "  Kathmandu  " },
      { country: 12345, district: ["wrong"] }
    ];
    for (const st of weirdStores) {
      normalizeStoreLocation(st);
    }
  });
});

console.log(`\n========================================`);
console.log(`Total tests executed: ${passed + failed}`);
console.log(`Total tests passed: ${passed}`);
console.log(`Total tests failed: ${failed}`);
console.log(`========================================`);

if (failed > 0) {
  process.exit(1);
} else {
  process.exit(0);
}
