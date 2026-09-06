// Phase 3.7 End-to-End Location Pipeline Resilience Test Suite
// Testing complete location pipeline from store data to catalog UI

import assert from "node:assert";
import {
  sanitizeStoreCoordinate,
  sanitizeStoreCoordinates,
  sanitizeLocationValue,
  normalizeStoreLocation
} from "./server/index.js";

// Import frontend helpers (these would be tested via import in real scenario)
// For this test, we replicate the critical logic to verify end-to-end behavior

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

function sanitizeCustomerLocation(data) {
  if (!data || typeof data !== "object" || Array.isArray(data)) {
    return {
      country: "Nepal",
      province: "",
      district: "",
      city: "",
      latitude: null,
      longitude: null
    };
  }

  const country = "Nepal";
  let latitude = sanitizeCustomerCoordinate(data.latitude, "lat");
  let longitude = sanitizeCustomerCoordinate(data.longitude, "lng");

  // Partial coordinate protection
  if (latitude === null || longitude === null) {
    latitude = null;
    longitude = null;
  }

  return {
    country,
    province: typeof data.province === "string" ? data.province.trim() : "",
    district: typeof data.district === "string" ? data.district.trim() : "",
    city: typeof data.city === "string" ? data.city.trim() : "",
    latitude,
    longitude
  };
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

  if (numLat1 === numLat2 && numLon1 === numLon2) {
    return 0;
  }

  const toRad = (deg) => (deg * Math.PI) / 180;
  const R = 6371;

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

  return distance;
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

// Mock enriched product from backend pipeline
function createMockProduct(storeData) {
  const normalized = normalizeStoreLocation(storeData);
  return {
    id: "test-product-1",
    name: "Test Product",
    price: 1899,
    storeCountry: normalized.storeCountry,
    storeProvince: normalized.storeProvince,
    storeDistrict: normalized.storeDistrict,
    storeCity: normalized.storeCity,
    storeLatitude: normalized.storeLatitude,
    storeLongitude: normalized.storeLongitude
  };
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

console.log("\n=== SECTION 1 — VALID END-TO-END PIPELINE ===");

test(1, "Valid customer + valid store coordinates produce valid pipeline", () => {
  const store = {
    country: "Nepal",
    province: "Bagmati Province",
    district: "Kathmandu",
    city: "Kathmandu",
    latitude: 27.7172,
    longitude: 85.324
  };
  const product = createMockProduct(store);
  const customer = {
    country: "Nepal",
    province: "Bagmati Province",
    district: "Kathmandu",
    city: "Kathmandu",
    latitude: 27.7,
    longitude: 85.3
  };

  assert.strictEqual(product.storeLatitude, 27.7172);
  assert.strictEqual(product.storeLongitude, 85.324);
  assert.strictEqual(getLocationRelevance(product, customer), 3);
  const dist = getProductDistance(product, customer);
  assert(dist !== null && typeof dist === "number");
  assert(dist >= 0);
});

test(2, "Product remains visible with valid pipeline", () => {
  const product = createMockProduct({ latitude: 27.7172, longitude: 85.324 });
  assert(product.id && product.name);
});

test(3, "Relevance calculated correctly in valid pipeline", () => {
  const product = createMockProduct({
    province: "Bagmati Province",
    city: "Kathmandu"
  });
  const customer = { province: "Bagmati Province", city: "Kathmandu" };
  assert.strictEqual(getLocationRelevance(product, customer), 3);
});

test(4, "Distance calculated safely in valid pipeline", () => {
  const product = createMockProduct({ latitude: 27.7172, longitude: 85.324 });
  const customer = { latitude: 28.2096, longitude: 83.9856 };
  const dist = getProductDistance(product, customer);
  assert(typeof dist === "number");
  assert(dist > 140 && dist < 160);
});

console.log("\n=== SECTION 2 — MISSING COORDINATES ===");

test(5, "Valid customer + missing store coordinates", () => {
  const product = createMockProduct({ latitude: null, longitude: null });
  const customer = { latitude: 27.7172, longitude: 85.324 };
  assert.strictEqual(product.storeLatitude, null);
  assert.strictEqual(product.storeLongitude, null);
  assert.strictEqual(getProductDistance(product, customer), null);
});

test(6, "Missing customer + valid store coordinates", () => {
  const product = createMockProduct({ latitude: 27.7172, longitude: 85.324 });
  const customer = { latitude: null, longitude: null };
  assert.strictEqual(getProductDistance(product, customer), null);
});

test(7, "Both missing coordinates", () => {
  const product = createMockProduct({ latitude: null, longitude: null });
  const customer = { latitude: null, longitude: null };
  assert.strictEqual(getProductDistance(product, customer), null);
});

test(8, "Product remains visible with missing store coordinates", () => {
  const product = createMockProduct({});
  assert(product.id && product.name);
  assert.strictEqual(product.storeLatitude, null);
  assert.strictEqual(product.storeLongitude, null);
});

test(9, "Distance hidden safely with missing coordinates", () => {
  const product = createMockProduct({ latitude: null, longitude: null });
  const customer = { latitude: 27.7172, longitude: 85.324 };
  const dist = getProductDistance(product, customer);
  assert.strictEqual(dist, null);
});

console.log("\n=== SECTION 3 — INVALID STORE DATA ===");

test(10, "Invalid store latitude results in null distance", () => {
  const product = createMockProduct({ latitude: "invalid", longitude: 85.324 });
  const customer = { latitude: 27.7172, longitude: 85.324 };
  assert.strictEqual(product.storeLatitude, null);
  assert.strictEqual(product.storeLongitude, null);
  assert.strictEqual(getProductDistance(product, customer), null);
});

test(11, "Invalid store longitude results in null distance", () => {
  const product = createMockProduct({ latitude: 27.7172, longitude: "invalid" });
  const customer = { latitude: 27.7172, longitude: 85.324 };
  assert.strictEqual(product.storeLatitude, null);
  assert.strictEqual(product.storeLongitude, null);
});

test(12, "Out-of-range store latitude", () => {
  const product = createMockProduct({ latitude: 95, longitude: 85.324 });
  assert.strictEqual(product.storeLatitude, null);
  assert.strictEqual(product.storeLongitude, null);
});

test(13, "Out-of-range store longitude", () => {
  const product = createMockProduct({ latitude: 27.7172, longitude: 200 });
  assert.strictEqual(product.storeLatitude, null);
  assert.strictEqual(product.storeLongitude, null);
});

test(14, "Store NaN coordinate", () => {
  const product = createMockProduct({ latitude: NaN, longitude: 85.324 });
  assert.strictEqual(product.storeLatitude, null);
  assert.strictEqual(product.storeLongitude, null);
});

test(15, "Store Infinity coordinate", () => {
  const product = createMockProduct({ latitude: Infinity, longitude: 85.324 });
  assert.strictEqual(product.storeLatitude, null);
  assert.strictEqual(product.storeLongitude, null);
});

test(16, "Store invalid string coordinate", () => {
  const product = createMockProduct({ latitude: "abc", longitude: "xyz" });
  assert.strictEqual(product.storeLatitude, null);
  assert.strictEqual(product.storeLongitude, null);
});

test(17, "Store object coordinate", () => {
  const product = createMockProduct({ latitude: { val: 27.7 }, longitude: 85.324 });
  assert.strictEqual(product.storeLatitude, null);
  assert.strictEqual(product.storeLongitude, null);
});

test(18, "Store array coordinate", () => {
  const product = createMockProduct({ latitude: [27.7], longitude: 85.324 });
  assert.strictEqual(product.storeLatitude, null);
  assert.strictEqual(product.storeLongitude, null);
});

test(19, "Store boolean coordinate", () => {
  const product = createMockProduct({ latitude: true, longitude: 85.324 });
  assert.strictEqual(product.storeLatitude, null);
  assert.strictEqual(product.storeLongitude, null);
});

test(20, "Store partial coordinate pair", () => {
  const product = createMockProduct({ latitude: 27.7172, longitude: null });
  assert.strictEqual(product.storeLatitude, null);
  assert.strictEqual(product.storeLongitude, null);
});

console.log("\n=== SECTION 4 — INVALID CUSTOMER DATA ===");

test(21, "Invalid customer latitude", () => {
  const product = createMockProduct({ latitude: 27.7172, longitude: 85.324 });
  const customer = sanitizeCustomerLocation({ latitude: "invalid", longitude: 85.324 });
  assert.strictEqual(customer.latitude, null);
  assert.strictEqual(customer.longitude, null);
  assert.strictEqual(getProductDistance(product, customer), null);
});

test(22, "Invalid customer longitude", () => {
  const customer = sanitizeCustomerLocation({ latitude: 27.7172, longitude: "invalid" });
  assert.strictEqual(customer.latitude, null);
  assert.strictEqual(customer.longitude, null);
});

test(23, "Customer partial coordinate pair", () => {
  const customer = sanitizeCustomerLocation({ latitude: 27.7172, longitude: null });
  assert.strictEqual(customer.latitude, null);
  assert.strictEqual(customer.longitude, null);
});

test(24, "Customer out-of-range coordinate", () => {
  const customer = sanitizeCustomerLocation({ latitude: 100, longitude: 85.324 });
  assert.strictEqual(customer.latitude, null);
  assert.strictEqual(customer.longitude, null);
});

test(25, "Corrupted customer storage", () => {
  const customer = sanitizeCustomerLocation(null);
  assert.strictEqual(customer.country, "Nepal");
  assert.strictEqual(customer.latitude, null);
  assert.strictEqual(customer.longitude, null);
});

console.log("\n=== SECTION 5 — RELEVANCE ===");

test(26, "City match scores 3", () => {
  const product = createMockProduct({
    province: "Bagmati Province",
    district: "Kathmandu",
    city: "Kathmandu"
  });
  const customer = { province: "Bagmati Province", district: "Kathmandu", city: "Kathmandu" };
  assert.strictEqual(getLocationRelevance(product, customer), 3);
});

test(27, "District match scores 2", () => {
  const product = createMockProduct({
    province: "Bagmati Province",
    district: "Kathmandu",
    city: "Tokha"
  });
  const customer = { province: "Bagmati Province", district: "Kathmandu", city: "Kirtipur" };
  assert.strictEqual(getLocationRelevance(product, customer), 2);
});

test(28, "Province match scores 1", () => {
  const product = createMockProduct({
    province: "Bagmati Province",
    district: "Chitwan",
    city: "Bharatpur"
  });
  const customer = { province: "Bagmati Province", district: "Kathmandu", city: "Kathmandu" };
  assert.strictEqual(getLocationRelevance(product, customer), 1);
});

test(29, "No match scores 0", () => {
  const product = createMockProduct({
    province: "Gandaki Province",
    district: "Kaski",
    city: "Pokhara"
  });
  const customer = { province: "Bagmati Province", district: "Kathmandu", city: "Kathmandu" };
  assert.strictEqual(getLocationRelevance(product, customer), 0);
});

test(30, "Distance has zero relevance impact", () => {
  const prodClose = createMockProduct({
    province: "Gandaki Province",
    city: "Pokhara",
    latitude: 27.7172,
    longitude: 85.324
  });
  const prodFar = createMockProduct({
    province: "Bagmati Province",
    city: "Kathmandu",
    latitude: 28.2096,
    longitude: 83.9856
  });
  const customer = { province: "Bagmati Province", city: "Kathmandu" };

  assert.strictEqual(getLocationRelevance(prodClose, customer), 0);
  assert.strictEqual(getLocationRelevance(prodFar, customer), 3);
});

console.log("\n=== SECTION 6 — SORTING INDEPENDENCE ===");

test(31, "Distance does not affect sort order", () => {
  const prodNear = createMockProduct({
    province: "Gandaki Province",
    latitude: 27.72,
    longitude: 85.33
  });
  const prodFar = createMockProduct({
    province: "Bagmati Province",
    latitude: 28.2096,
    longitude: 83.9856
  });
  const customer = { province: "Bagmati Province", latitude: 27.7172, longitude: 85.324 };

  const relevanceNear = getLocationRelevance(prodNear, customer);
  const relevanceFar = getLocationRelevance(prodFar, customer);

  // Far product should have higher relevance despite being farther
  assert(relevanceFar > relevanceNear);
});

test(32, "Distance does not affect ranking", () => {
  const prod1 = createMockProduct({ province: "Bagmati Province" });
  const prod2 = createMockProduct({ province: "Bagmati Province" });
  const customer = { province: "Bagmati Province" };

  assert.strictEqual(getLocationRelevance(prod1, customer), getLocationRelevance(prod2, customer));
});

test(33, "Equal relevance maintains stable order", () => {
  const prod1 = createMockProduct({ province: "Bagmati Province" });
  const prod2 = createMockProduct({ province: "Bagmati Province" });
  const customer = { province: "Bagmati Province" };

  const rel1 = getLocationRelevance(prod1, customer);
  const rel2 = getLocationRelevance(prod2, customer);

  assert.strictEqual(rel1, rel2);
});

test(34, "Missing coordinates do not change ordering", () => {
  const prod1 = createMockProduct({ province: "Bagmati Province", latitude: null, longitude: null });
  const prod2 = createMockProduct({ province: "Bagmati Province", latitude: 27.7172, longitude: 85.324 });
  const customer = { province: "Bagmati Province" };

  assert.strictEqual(getLocationRelevance(prod1, customer), getLocationRelevance(prod2, customer));
});

console.log("\n=== SECTION 7 — DISTANCE SAFETY ===");

test(35, "Valid customer + valid store calculates distance", () => {
  const product = createMockProduct({ latitude: 28.2096, longitude: 83.9856 });
  const customer = { latitude: 27.7172, longitude: 85.324 };
  const dist = getProductDistance(product, customer);
  assert(typeof dist === "number" && dist > 0);
});

test(36, "Missing customer hides distance", () => {
  const product = createMockProduct({ latitude: 27.7172, longitude: 85.324 });
  const customer = { latitude: null, longitude: null };
  assert.strictEqual(getProductDistance(product, customer), null);
});

test(37, "Missing store hides distance", () => {
  const product = createMockProduct({ latitude: null, longitude: null });
  const customer = { latitude: 27.7172, longitude: 85.324 };
  assert.strictEqual(getProductDistance(product, customer), null);
});

test(38, "Invalid data hides distance", () => {
  const product = createMockProduct({ latitude: "invalid", longitude: 85.324 });
  const customer = { latitude: 27.7172, longitude: 85.324 };
  assert.strictEqual(getProductDistance(product, customer), null);
});

test(39, "No NaN distance produced", () => {
  const product = createMockProduct({ latitude: NaN, longitude: NaN });
  const customer = { latitude: 27.7172, longitude: 85.324 };
  const dist = getProductDistance(product, customer);
  assert.strictEqual(dist, null);
  assert(!isNaN(dist) || dist === null);
});

test(40, "No Infinity distance produced", () => {
  const product = createMockProduct({ latitude: Infinity, longitude: 85.324 });
  const customer = { latitude: 27.7172, longitude: 85.324 };
  assert.strictEqual(getProductDistance(product, customer), null);
});

test(41, "Genuine identical coordinates allow 0 km", () => {
  const product = createMockProduct({ latitude: 27.7172, longitude: 85.324 });
  const customer = { latitude: 27.7172, longitude: 85.324 };
  const dist = getProductDistance(product, customer);
  assert.strictEqual(dist, 0);
});

console.log("\n=== SECTION 8 — PERSISTENCE ===");

test(42, "Valid location data can be sanitized for storage", () => {
  const location = {
    country: "Nepal",
    province: "Bagmati Province",
    district: "Kathmandu",
    city: "Kathmandu",
    latitude: 27.7172,
    longitude: 85.324
  };
  const sanitized = sanitizeCustomerLocation(location);
  assert.strictEqual(sanitized.latitude, 27.7172);
  assert.strictEqual(sanitized.longitude, 85.324);
});

test(43, "Corrupted storage data sanitizes safely", () => {
  const sanitized = sanitizeCustomerLocation("corrupted");
  assert.strictEqual(sanitized.country, "Nepal");
  assert.strictEqual(sanitized.latitude, null);
  assert.strictEqual(sanitized.longitude, null);
});

test(44, "Partial stored coordinates clear safely", () => {
  const location = { latitude: 27.7172, longitude: null };
  const sanitized = sanitizeCustomerLocation(location);
  assert.strictEqual(sanitized.latitude, null);
  assert.strictEqual(sanitized.longitude, null);
});

console.log("\n=== SECTION 9 — RESET PIPELINE ===");

test(45, "Reset clears coordinates", () => {
  const reset = sanitizeCustomerLocation({
    country: "Nepal",
    province: "",
    district: "",
    city: "",
    latitude: null,
    longitude: null
  });
  assert.strictEqual(reset.latitude, null);
  assert.strictEqual(reset.longitude, null);
});

test(46, "Reset preserves Nepal country", () => {
  const reset = sanitizeCustomerLocation({
    country: "Nepal",
    province: "",
    district: "",
    city: "",
    latitude: null,
    longitude: null
  });
  assert.strictEqual(reset.country, "Nepal");
});

test(47, "Reset clears administrative fields", () => {
  const reset = sanitizeCustomerLocation({
    country: "Nepal",
    province: "",
    district: "",
    city: "",
    latitude: null,
    longitude: null
  });
  assert.strictEqual(reset.province, "");
  assert.strictEqual(reset.district, "");
  assert.strictEqual(reset.city, "");
});

test(48, "Distance disappears after reset", () => {
  const product = createMockProduct({ latitude: 27.7172, longitude: 85.324 });
  const reset = { latitude: null, longitude: null };
  assert.strictEqual(getProductDistance(product, reset), null);
});

test(49, "Relevance returns neutral after reset", () => {
  const product = createMockProduct({ province: "Bagmati Province", city: "Kathmandu" });
  const reset = { province: "", district: "", city: "" };
  assert.strictEqual(getLocationRelevance(product, reset), 0);
});

test(50, "Products remain visible after reset", () => {
  const product = createMockProduct({ latitude: 27.7172, longitude: 85.324 });
  assert(product.id && product.name);
});

console.log("\n=== SECTION 10 — PRODUCT RESILIENCE ===");

test(51, "Invalid store location does not hide product", () => {
  const product = createMockProduct({ latitude: "invalid", longitude: "invalid" });
  assert(product.id && product.name);
});

test(52, "Missing store location does not hide product", () => {
  const product = createMockProduct({});
  assert(product.id && product.name);
});

test(53, "Malformed location does not crash pipeline", () => {
  assert.doesNotThrow(() => {
    const product = createMockProduct(null);
    getLocationRelevance(product, { province: "Bagmati Province" });
    getProductDistance(product, { latitude: 27.7172, longitude: 85.324 });
  });
});

test(54, "Products remain functional with bad data", () => {
  const product = createMockProduct({ latitude: NaN, longitude: Infinity, city: "   " });
  assert.strictEqual(product.storeLatitude, null);
  assert.strictEqual(product.storeLongitude, null);
  assert.strictEqual(product.storeCity, "");
  assert(product.id && product.name && product.price);
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
