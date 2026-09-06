import { useCallback, useEffect, useMemo, useState } from "react";

const API = import.meta.env.VITE_API_URL || "/api";
const categories = [
  ["Ethnic Wear", "👗", "c1"],
  ["Western", "👕", "c2"],
  ["Kids", "👶", "c3"],
  ["Footwear", "👟", "c4"],
  ["Jewellery", "💎", "c5"],
  ["Bags", "👜", "c6"],
  ["Beauty", "🧴", "c7"],
];
const reels = [
  [
    "🥻",
    "Traditional Dhaka Sari - Festival Edition",
    3500,
    "reel-bg-1",
    "4.2k",
    "28k",
    true,
  ],
  [
    "👔",
    "Men's Daura Suruwal - Modern Fit",
    2200,
    "reel-bg-3",
    "3.7k",
    "21k",
    false,
  ],
  [
    "💍",
    "Himalayan Silver Jewellery Set",
    4800,
    "reel-bg-5",
    "6.1k",
    "45k",
    true,
  ],
  ["🧥", "Pashmina Wool Winter Coat", 6500, "reel-bg-4", "5.4k", "38k", false],
  [
    "👟",
    "Handmade Lokta Leather Sneakers",
    2999,
    "reel-bg-2",
    "2.9k",
    "17k",
    true,
  ],
  [
    "🧣",
    "Yak Wool Himalayan Scarf - 5 Colors",
    1200,
    "reel-bg-6",
    "1.8k",
    "13k",
    false,
  ],
];
const arrivals = [
  ["🥻", "Tibetan Arts", "Red Dhaka Sari", 3200, "a-bg-1"],
  ["🧦", "SherpaKnit", "Wool Blend Socks", 399, "a-bg-2"],
  ["💄", "HerbalNep", "Ayurvedic Lip Tint", 699, "a-bg-3"],
  ["🕶️", "PeakVision", "UV400 Sunglasses", 1250, "a-bg-4"],
  ["💎", "KathmanduGems", "Pearl Earrings", 1899, "a-bg-5"],
  ["🧤", "HimalWool", "Cashmere Gloves", 750, "a-bg-6"],
  ["👒", "DhakaStyle", "Woven Sun Hat", 550, "a-bg-7"],
  ["🎒", "EverestGear", "Heritage Backpack", 2800, "a-bg-8"],
];

const money = (value) => `Rs. ${Number(value).toLocaleString("en-NP")}`;

const NEPAL_PROVINCES = [
  "Koshi",
  "Madhesh",
  "Bagmati",
  "Gandaki",
  "Lumbini",
  "Karnali",
  "Sudurpashchim",
];

const NEPAL_LOCATION_DATA = {
  Koshi: {
    districts: {
      Bhojpur: ["Bhojpur", "Shadananda"],
      Dhankuta: ["Dhankuta", "Pakhribas"],
      Ilam: ["Ilam", "Suryodaya", "Deumai", "Mai"],
      Jhapa: ["Birtamod", "Damak", "Bhadrapur", "Mechinagar", "Kankai", "Arjundhara", "Shivasatakshi", "Gauradaha"],
      Khotang: ["Diktel", "Halesi Tuwachung"],
      Morang: ["Biratnagar", "Belbari", "Pathari Sanischare", "Sundarharaicha", "Urlabari", "Ratuwamai", "Sunbarsi"],
      Okhaldhunga: ["Siddhicharan"],
      Panchthar: ["Phidim"],
      Sankhuwasabha: ["Khandbari", "Chainpur", "Madi", "Dharmadevi"],
      Solukhumbu: ["Salleri"],
      Sunsari: ["Dharan", "Itahari", "Inaruwa", "Duhabi", "Ramdhuni", "Barahachhetra"],
      Taplejung: ["Phungling"],
      Terhathum: ["Myanglung", "Laligurans"],
      Udayapur: ["Gaighat", "Katari", "Chaudandigadhi", "Belaka"],
    },
  },
  Madhesh: {
    districts: {
      Bara: ["Kalaiya", "Jeetpur Simara", "Kolhabi", "Nijgadh", "Mahagadhimai", "Simraungadh"],
      Dhanusha: ["Janakpur", "Mithila", "Dhanusadham", "Chhirreshwarnath", "Ganeshman Charnath", "Sabaila", "Sahidnagar"],
      Mahottari: ["Jaleshwar", "Bardibas", "Gaushala", "Bhangaha", "Loharpatti", "Manara Shisawa"],
      Parsa: ["Birgunj", "Pokhariya", "Bahudaramai", "Parsagadhi"],
      Rautahat: ["Gaur", "Chandrapur", "Garuda", "Brindaban", "Katahariya", "Dewahi Gonahi"],
      Saptari: ["Rajbiraj", "Kanchanrup", "Dakneshwari", "Bodebarsain", "Khadak", "Surunga", "Hanumannagar Kankalini"],
      Sarlahi: ["Malangwa", "Lalbandi", "Harion", "Barahathwa", "Ishworpur", "Godaita", "Kabilasi"],
      Siraha: ["Lahan", "Siraha", "Golbazar", "Mirchaiya", "Kalyanpur", "Dhangadhimai", "Sukhipur"],
    },
  },
  Bagmati: {
    districts: {
      Bhaktapur: ["Bhaktapur", "Madhyapur Thimi", "Suryabinayak", "Changunarayan"],
      Chitwan: ["Bharatpur", "Ratnanagar", "Khairahani", "Rapti", "Kalika", "Madi"],
      Dhading: ["Nilkantha", "Dhunibeshi"],
      Dolakha: ["Bhimeshwar", "Jiri"],
      Kathmandu: ["Kathmandu", "Kirtipur", "Budhanilkantha", "Tokha", "Tarakeshwar", "Chandragiri", "Nagarjun", "Gokarneshwar", "Dakshinkali", "Shankharapur"],
      Kavrepalanchok: ["Banepa", "Dhulikhel", "Panauti", "Mandandeupur", "Namobuddha", "Panchkhal"],
      Lalitpur: ["Lalitpur", "Mahalaxmi", "Godawari"],
      Makwanpur: ["Hetauda", "Thaha"],
      Nuwakot: ["Bidur", "Belkotgadhi"],
      Ramechhap: ["Manthali", "Ramechhap"],
      Rasuwa: ["Dhunche"],
      Sindhuli: ["Kamalamai", "Dudhauli"],
      Sindhupalchok: ["Chautara", "Melamchi", "Barhabise"],
    },
  },
  Gandaki: {
    districts: {
      Baglung: ["Baglung", "Galkot", "Jaimini", "Dhorpatan"],
      Gorkha: ["Gorkha", "Palungtar"],
      Kaski: ["Pokhara", "Lekhnath"],
      Lamjung: ["Besishahar", "Sundarbazar", "Rainas", "Madhya Nepal"],
      Manang: ["Chame"],
      Mustang: ["Jomsom"],
      Myagdi: ["Beni"],
      Nawalpur: ["Kawasoti", "Gaidakot", "Devchuli", "Madhyabindu"],
      Parbat: ["Kusma", "Phalebas"],
      Syangja: ["Putalibazar", "Waling", "Galyang", "Chapakot", "Bhirkot"],
      Tanahun: ["Damauli", "Shuklagandaki", "Bhimad", "Bhanu"],
    },
  },
  Lumbini: {
    districts: {
      Arghakhanchi: ["Sandhikharka", "Sitganga", "Bhumikasthan"],
      Banke: ["Nepalgunj", "Kohalpur"],
      Bardiya: ["Gulariya", "Rajapur", "Bansgadhi", "Barbardiya", "Thakurbaba", "Madhuwan"],
      Dang: ["Ghorahi", "Tulsipur", "Lamahi"],
      "Eastern Rukum": ["Rukumkot"],
      Gulmi: ["Tamghas", "Musikot"],
      Kapilvastu: ["Kapilvastu", "Taulihawa", "Banganga", "Shivaraj", "Buddhabhumi", "Krishnanagar", "Maharajgunj"],
      "Nawalparasi West": ["Ramgram", "Sunwal", "Bardaghat"],
      Palpa: ["Tansen", "Rampur"],
      Pyuthan: ["Pyuthan", "Swargadwari"],
      Rolpa: ["Liwang"],
      Rupandehi: ["Butwal", "Siddharthanagar", "Tilottama", "Sainamaina", "Devdaha", "Lumbini Sanskritik"],
    },
  },
  Karnali: {
    districts: {
      Dailekh: ["Narayan", "Dullu", "Chamunda Bindrasaini", "Aathbis"],
      Dolpa: ["Dunai", "Tripurasundari", "Thuli Bheri"],
      Humla: ["Simikot"],
      Jajarkot: ["Khalanga", "Chhedagad", "Nalgad"],
      Jumla: ["Chandannath"],
      Kalikot: ["Manma", "Raskot", "Tilagufa"],
      Mugu: ["Gamgadhi"],
      Salyan: ["Sharada", "Bagchaur", "Bangad Kupinde"],
      Surkhet: ["Birendranagar", "Gurbhakot", "Bheriganga", "Panchapuri", "Lekbeshi"],
      "Western Rukum": ["Musikot", "Chaurjahari", "Aathbiskot"],
    },
  },
  Sudurpashchim: {
    districts: {
      Achham: ["Mangalsen", "Sanphebagar", "Kamalbazar", "Panchadeval Binayak"],
      Baitadi: ["Dasharathchand", "Patan", "Melauli", "Purchaudi"],
      Bajhang: ["Jayaprithvi", "Bungal"],
      Bajura: ["Martadi", "Budhiganga", "Budhinanda", "Triveni"],
      Dadeldhura: ["Amargadhi", "Parshuram"],
      Darchula: ["Khalanga", "Shailyashikhar"],
      Doti: ["Dipayal Silgadhi", "Shikhar"],
      Kailali: ["Dhangadhi", "Tikapur", "Godawari", "Lamki Chuha", "Ghodaghodi", "Bhajani", "Gauriganga"],
      Kanchanpur: ["Bhimdatta", "Bedkot", "Shuklaphanta", "Krishnapur", "Punarbas", "Belauri", "Mahakali"],
    },
  },
};

export const DEFAULT_CUSTOMER_LOCATION = {
  country: "Nepal",
  province: "",
  district: "",
  city: "",
  latitude: null,
  longitude: null,
};

export const CUSTOMER_LOCATION_STORAGE_KEY = "vastaar_customer_location";

export function isValidLatitude(lat) {
  return typeof lat === "number" && Number.isFinite(lat) && lat >= -90 && lat <= 90;
}

export function isValidLongitude(lng) {
  return typeof lng === "number" && Number.isFinite(lng) && lng >= -180 && lng <= 180;
}

export function sanitizeCoordinate(val, type = "lat") {
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

export function sanitizeCustomerLocation(data) {
  if (!data || typeof data !== "object" || Array.isArray(data)) {
    return { ...DEFAULT_CUSTOMER_LOCATION };
  }

  const country = "Nepal";
  let latitude = sanitizeCoordinate(data.latitude, "lat");
  let longitude = sanitizeCoordinate(data.longitude, "lng");

  // Partial coordinate protection: if one coordinate is missing or invalid, both must be null
  if (latitude === null || longitude === null) {
    latitude = null;
    longitude = null;
  }

  let province = "";
  if (typeof data.province === "string" && data.province.trim()) {
    const pTrim = data.province.trim();
    const matchedP = NEPAL_PROVINCES.find(
      (p) => p.toLowerCase() === pTrim.toLowerCase(),
    );
    if (matchedP) {
      province = matchedP;
    }
  }

  if (!province) {
    return {
      country,
      province: "",
      district: "",
      city: "",
      latitude,
      longitude,
    };
  }

  const provinceData = NEPAL_LOCATION_DATA[province];
  const validDistricts = Object.keys(provinceData.districts);

  let district = "";
  if (typeof data.district === "string" && data.district.trim()) {
    const dTrim = data.district.trim();
    const matchedD = validDistricts.find(
      (d) => d.toLowerCase() === dTrim.toLowerCase(),
    );
    if (matchedD) {
      district = matchedD;
    }
  }

  let city = "";
  if (district) {
    const validCities = provinceData.districts[district] || [];
    if (typeof data.city === "string" && data.city.trim()) {
      const cTrim = data.city.trim();
      const matchedC = validCities.find(
        (c) => c.toLowerCase() === cTrim.toLowerCase(),
      );
      if (matchedC) {
        city = matchedC;
      }
    }
  } else if (typeof data.city === "string" && data.city.trim()) {
    const cTrim = data.city.trim();
    const allProvCities = Object.values(provinceData.districts).flat();
    const matchedC = allProvCities.find(
      (c) => c.toLowerCase() === cTrim.toLowerCase(),
    );
    if (matchedC) {
      city = matchedC;
    }
  }

  return {
    country,
    province,
    district,
    city,
    latitude,
    longitude,
  };
}

export function getStoredCustomerLocation() {
  try {
    const raw = localStorage.getItem(CUSTOMER_LOCATION_STORAGE_KEY);
    if (!raw) return { ...DEFAULT_CUSTOMER_LOCATION };
    const parsed = JSON.parse(raw);
    return sanitizeCustomerLocation(parsed);
  } catch (err) {
    return { ...DEFAULT_CUSTOMER_LOCATION };
  }
}

export function saveStoredCustomerLocation(location) {
  const sanitized = sanitizeCustomerLocation(location);
  try {
    localStorage.setItem(
      CUSTOMER_LOCATION_STORAGE_KEY,
      JSON.stringify(sanitized),
    );
  } catch (err) {
    // Gracefully handle restricted storage
  }
  return sanitized;
}

export function clearStoredCustomerLocation() {
  try {
    localStorage.setItem(
      CUSTOMER_LOCATION_STORAGE_KEY,
      JSON.stringify(DEFAULT_CUSTOMER_LOCATION),
    );
  } catch (err) {
    // Gracefully handle restricted storage
  }
  return { ...DEFAULT_CUSTOMER_LOCATION };
}

export function getStoreLocationInfo(product) {
  if (!product || typeof product !== "object") {
    return { province: "", district: "", city: "" };
  }

  let province =
    typeof product.storeProvince === "string" ? product.storeProvince.trim() : "";
  let district =
    typeof product.storeDistrict === "string" ? product.storeDistrict.trim() : "";
  let city =
    typeof product.storeCity === "string" ? product.storeCity.trim() : "";

  // If district is provided but province is missing, infer province from NEPAL_LOCATION_DATA
  if (!province && district) {
    for (const [pName, pData] of Object.entries(NEPAL_LOCATION_DATA)) {
      const dMatch = Object.keys(pData.districts).find(
        (d) => d.toLowerCase() === district.toLowerCase(),
      );
      if (dMatch) {
        province = pName;
        district = dMatch;
        break;
      }
    }
  }

  // If city is provided but province or district is missing, infer from NEPAL_LOCATION_DATA
  if (city && (!province || !district)) {
    for (const [pName, pData] of Object.entries(NEPAL_LOCATION_DATA)) {
      if (province && pName.toLowerCase() !== province.toLowerCase()) continue;
      for (const [dName, cities] of Object.entries(pData.districts)) {
        if (district && dName.toLowerCase() !== district.toLowerCase()) continue;
        const cMatch = cities.find(
          (c) => c.toLowerCase() === city.toLowerCase(),
        );
        if (cMatch) {
          if (!province) province = pName;
          if (!district) district = dName;
          city = cMatch;
          break;
        }
      }
      if (province && district) break;
    }
  }

  return { province, district, city };
}

export function getLocationRelevance(product, customerLocation) {
  if (!product || !customerLocation || typeof customerLocation !== "object") {
    return 0;
  }

  const custProv =
    typeof customerLocation.province === "string"
      ? customerLocation.province.trim().toLowerCase()
      : "";
  const custDist =
    typeof customerLocation.district === "string"
      ? customerLocation.district.trim().toLowerCase()
      : "";
  const custCity =
    typeof customerLocation.city === "string"
      ? customerLocation.city.trim().toLowerCase()
      : "";

  // If customer has not selected any province, all products have neutral relevance (0)
  if (!custProv) {
    return 0;
  }

  const storeLoc = getStoreLocationInfo(product);
  const prodProv = storeLoc.province.trim().toLowerCase();
  const prodDist = storeLoc.district.trim().toLowerCase();
  const prodCity = storeLoc.city.trim().toLowerCase();

  // If the product has no store location at all, it has neutral relevance (0)
  if (!prodProv && !prodDist && !prodCity) {
    return 0;
  }

  // 1. City Match (Score 3) — if customer specified city and it matches store city in same province/district
  if (custCity && prodCity && custCity === prodCity) {
    if (!custProv || !prodProv || custProv === prodProv) {
      return 3;
    }
  }

  // 2. District Match (Score 2) — if customer specified district and it matches store district in same province
  if (custDist && prodDist && custDist === prodDist) {
    if (!custProv || !prodProv || custProv === prodProv) {
      return 2;
    }
  }

  // 3. Province Match (Score 1) — if province matches
  if (custProv && prodProv && custProv === prodProv) {
    return 1;
  }

  return 0;
}

const EARTH_RADIUS_KM = 6371;

function toRadians(degrees) {
  return (degrees * Math.PI) / 180;
}

export function calculateDistanceKm(lat1, lon1, lat2, lon2) {
  const sLat1 = sanitizeCoordinate(lat1, "lat");
  const sLon1 = sanitizeCoordinate(lon1, "lng");
  const sLat2 = sanitizeCoordinate(lat2, "lat");
  const sLon2 = sanitizeCoordinate(lon2, "lng");

  if (sLat1 === null || sLon1 === null || sLat2 === null || sLon2 === null) {
    return null;
  }

  if (sLat1 === sLat2 && sLon1 === sLon2) {
    return 0;
  }

  const dLat = toRadians(sLat2 - sLat1);
  const dLon = toRadians(sLon2 - sLon1);
  const rLat1 = toRadians(sLat1);
  const rLat2 = toRadians(sLat2);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(rLat1) * Math.cos(rLat2) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = EARTH_RADIUS_KM * c;
  return Number.isFinite(distance) ? distance : null;
}

export function formatDistance(distanceKm) {
  if (
    distanceKm === null ||
    distanceKm === undefined ||
    typeof distanceKm !== "number" ||
    !Number.isFinite(distanceKm) ||
    distanceKm < 0
  ) {
    return null;
  }
  if (distanceKm < 10) {
    return `${distanceKm.toFixed(1)} km`;
  }
  return `${Math.round(distanceKm)} km`;
}

export function getStoreCoordinates(product) {
  if (!product || typeof product !== "object") {
    return { latitude: null, longitude: null };
  }
  const rawLat =
    product.storeLatitude !== undefined ? product.storeLatitude : product.latitude;
  const rawLng =
    product.storeLongitude !== undefined ? product.storeLongitude : product.longitude;
  return {
    latitude: sanitizeCoordinate(rawLat, "lat"),
    longitude: sanitizeCoordinate(rawLng, "lng"),
  };
}

export function getProductDistance(product, customerLocation) {
  if (!product || !customerLocation || typeof customerLocation !== "object") {
    return null;
  }
  const custLat = sanitizeCoordinate(customerLocation.latitude, "lat");
  const custLng = sanitizeCoordinate(customerLocation.longitude, "lng");
  if (custLat === null || custLng === null) {
    return null;
  }

  const storeCoords = getStoreCoordinates(product);
  if (storeCoords.latitude === null || storeCoords.longitude === null) {
    return null;
  }

  return calculateDistanceKm(
    custLat,
    custLng,
    storeCoords.latitude,
    storeCoords.longitude,
  );
}

function App() {
  const [products, setProducts] = useState([]);
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("");
  const [slide, setSlide] = useState(0);
  const [cart, setCart] = useState(() =>
    JSON.parse(localStorage.getItem("vastaar-cart") || "[]"),
  );
  const [wishlist, setWishlist] = useState(() =>
    JSON.parse(localStorage.getItem("vastaar-wishlist") || "[]"),
  );
  const [customerLocationModal, setCustomerLocationModal] = useState(false);
  const [customerLocation, setCustomerLocation] = useState(() =>
    getStoredCustomerLocation(),
  );
  const [drawer, setDrawer] = useState(false);
  const [checkout, setCheckout] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(null);
  const [sellerRegistration, setSellerRegistration] = useState(false);
  const [sellerDashboard, setSellerDashboard] = useState(false);
  const [toast, setToast] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [saleEnds, setSaleEnds] = useState(
    () => Date.now() + 8 * 3600000 + 34 * 60000 + 52 * 1000,
  );

  const showToast = (message) => {
    setToast(message);
    window.clearTimeout(window.toastTimer);
    window.toastTimer = window.setTimeout(() => setToast(""), 2600);
  };
  const updateCustomerLocation = (nextLocation) => {
    const saved = saveStoredCustomerLocation(nextLocation);
    setCustomerLocation(saved);
    const locationLabel = saved.city
      ? `${saved.city}, ${saved.province}`
      : saved.province
      ? `${saved.province}, Nepal`
      : "Nepal";
    showToast(`Location updated to ${locationLabel}`);
  };
  const clearCustomerLocation = () => {
    const reset = clearStoredCustomerLocation();
    setCustomerLocation(reset);
    showToast("Location reset to Nepal");
  };
  const loadProducts = async (search = query, category = activeCategory) => {
    setLoading(true);
    setError("");
    try {
      const params = new URLSearchParams({ q: search, category });
      const response = await fetch(`${API}/products?${params}`);
      if (!response.ok) throw new Error("Unable to load products");
      setProducts((await response.json()).products);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    loadProducts("", "");
  }, []);
  useEffect(() => {
    localStorage.setItem("vastaar-cart", JSON.stringify(cart));
  }, [cart]);
  useEffect(() => {
    localStorage.setItem("vastaar-wishlist", JSON.stringify(wishlist));
  }, [wishlist]);
  useEffect(() => {
    try {
      localStorage.setItem(
        "vastaar_customer_location",
        JSON.stringify(customerLocation),
      );
    } catch (err) {
      // Gracefully handle restricted storage
    }
  }, [customerLocation]);
  useEffect(() => {
    const id = window.setInterval(
      () =>
        setSaleEnds((current) =>
          current <= Date.now() ? Date.now() + 86400000 : current,
        ),
      1000,
    );
    return () => window.clearInterval(id);
  }, []);
  useEffect(() => {
    const id = window.setInterval(
      () => setSlide((current) => (current + 1) % 3),
      5000,
    );
    return () => window.clearInterval(id);
  }, []);

  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
  const cartSubtotal = cart.reduce(
    (total, item) => total + Number(item.price) * Number(item.quantity),
    0,
  );
  const saleTime = Math.max(0, saleEnds - Date.now());
  const timer = {
    hours: Math.floor(saleTime / 3600000),
    minutes: Math.floor((saleTime % 3600000) / 60000),
    seconds: Math.floor((saleTime % 60000) / 1000),
  };
  const visibleProducts = useMemo(() => {
    if (!customerLocation?.province) return products;
    return [...products].sort((a, b) => {
      const scoreA = getLocationRelevance(a, customerLocation);
      const scoreB = getLocationRelevance(b, customerLocation);
      return scoreB - scoreA;
    });
  }, [products, customerLocation]);

  const search = () => {
    loadProducts(query, activeCategory);
    document.getElementById("products")?.scrollIntoView({ behavior: "smooth" });
  };
  const setCategory = (category) => {
    const next = activeCategory === category ? "" : category;
    setActiveCategory(next);
    loadProducts(query, next);
  };
  const addToCart = (product) => {
    setCart((items) => {
      const found = items.find((item) => item.id === product.id);
      return found
        ? items.map((item) =>
            item.id === product.id
              ? { ...item, quantity: item.quantity + 1 }
              : item,
          )
        : [...items, { ...product, quantity: 1 }];
    });
    showToast("Added to bag");
  };
  const changeQuantity = (id, amount) =>
    setCart((items) =>
      items
        .map((item) =>
          item.id === id ? { ...item, quantity: item.quantity + amount } : item,
        )
        .filter((item) => item.quantity > 0),
    );
  const toggleWishlist = (id) => {
    setWishlist((items) =>
      items.includes(id) ? items.filter((item) => item !== id) : [...items, id],
    );
    showToast(
      wishlist.includes(id) ? "Removed from wishlist" : "Added to wishlist",
    );
  };

  return (
    <>
      <Announcement />
      <Header
        query={query}
        setQuery={setQuery}
        search={search}
        cartCount={cartCount}
        wishlistCount={wishlist.length}
        openCart={() => setDrawer(true)}
        setCategory={setCategory}
        customerLocation={customerLocation}
        openLocationModal={() => setCustomerLocationModal(true)}
      />
      <Hero
        slide={slide}
        setSlide={setSlide}
        onShop={() =>
          document
            .getElementById("products")
            ?.scrollIntoView({ behavior: "smooth" })
        }
      />
      <CategorySection active={activeCategory} setCategory={setCategory} />
      <BannerStrip onSelect={setCategory} />
      <section className="sec" id="products">
        <SectionHeading
          title="Featured"
          accent="Products"
          subtitle={
            customerLocation?.province
              ? `Local picks for ${
                  customerLocation.city ||
                  customerLocation.district ||
                  customerLocation.province
                } • Handpicked styles across Nepal`
              : "Handpicked styles for you"
          }
          action="View All"
          onAction={() => {
            setActiveCategory("");
            loadProducts("", "");
          }}
        />
        <div className="catalog-location-note">
          <i className="fa fa-circle-info" aria-hidden="true" />
          <span>Distances are approximate and shown when location coordinates are available.</span>
        </div>
        {loading ? (
          <div className="state-box">Curating your edit...</div>
        ) : error ? (
          <div className="state-box error-state">
            {error} <button onClick={() => loadProducts()}>Try again</button>
          </div>
        ) : visibleProducts.length ? (
          <div className="products-grid">
            {visibleProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                wished={wishlist.includes(product.id)}
                onWish={() => toggleWishlist(product.id)}
                onAdd={() => addToCart(product)}
                customerLocation={customerLocation}
              />
            ))}
          </div>
        ) : (
          <div className="state-box">No styles match your search.</div>
        )}
      </section>
      <Reels
        onAdd={(reel) =>
          addToCart({
            id: `reel-${reel[1]}`,
            name: reel[1],
            brand: "VASTAAR Reels",
            price: reel[2],
            emoji: reel[0],
          })
        }
      />
      <SaleBanner
        timer={timer}
        onClick={() => {
          setActiveCategory("");
          loadProducts("", "");
          document
            .getElementById("products")
            ?.scrollIntoView({ behavior: "smooth" });
        }}
      />
      <Arrivals
        onAdd={(item) =>
          addToCart({
            id: `arrival-${item[2]}`,
            name: item[2],
            brand: item[1],
            price: item[3],
            emoji: item[0],
          })
        }
      />
      <Brands />
      <Footer
        onSubscribe={showToast}
        onBecomeSeller={() => setSellerRegistration(true)}
        onOpenDashboard={() => setSellerDashboard(true)}
      />
      <button
        className="back-top"
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        aria-label="Back to top"
      >
        <i className="fa fa-arrow-up" />
      </button>
      {drawer && (
        <CartDrawer
          cart={cart}
          subtotal={cartSubtotal}
          onClose={() => setDrawer(false)}
          onChange={changeQuantity}
          onCheckout={() => {
            setDrawer(false);
            setCheckout(true);
          }}
        />
      )}
      {checkout && (
        <Checkout
          cart={cart}
          subtotal={cartSubtotal}
          onClose={() => setCheckout(false)}
          onSuccess={(order) => {
            setCart([]);
            setCheckout(false);
            setOrderSuccess(order);
          }}
        />
      )}
      {orderSuccess && (
        <OrderSuccess
          order={orderSuccess}
          onContinue={() => setOrderSuccess(null)}
        />
      )}
      {sellerRegistration && (
        <SellerRegistration
          onClose={() => setSellerRegistration(false)}
          onSuccess={() => setSellerRegistration(false)}
        />
      )}
      {sellerDashboard && (
        <SellerDashboard onClose={() => setSellerDashboard(false)} />
      )}
      {customerLocationModal && (
        <CustomerLocationModal
          location={customerLocation}
          onClose={() => setCustomerLocationModal(false)}
          onSave={(loc) => {
            updateCustomerLocation(loc);
            setCustomerLocationModal(false);
          }}
          onClear={() => {
            clearCustomerLocation();
            setCustomerLocationModal(false);
          }}
        />
      )}
      {toast && (
        <div className="toast show">
          <i className="fa fa-check-circle" /> {toast}
        </div>
      )}
    </>
  );
}

function CustomerLocationModal({ location, onClose, onSave, onClear }) {
  const [selectedProvince, setSelectedProvince] = useState(
    location?.province || "",
  );
  const [selectedDistrict, setSelectedDistrict] = useState(
    location?.district || "",
  );
  const [selectedCity, setSelectedCity] = useState(location?.city || "");
  const [latitude, setLatitude] = useState(
    location?.latitude !== null && location?.latitude !== undefined
      ? String(location.latitude)
      : "",
  );
  const [longitude, setLongitude] = useState(
    location?.longitude !== null && location?.longitude !== undefined
      ? String(location.longitude)
      : "",
  );
  const [coordError, setCoordError] = useState("");

  const availableDistricts = useMemo(() => {
    if (!selectedProvince || !NEPAL_LOCATION_DATA[selectedProvince]) {
      return [];
    }
    return Object.keys(NEPAL_LOCATION_DATA[selectedProvince].districts);
  }, [selectedProvince]);

  const availableCities = useMemo(() => {
    if (!selectedProvince || !NEPAL_LOCATION_DATA[selectedProvince]) {
      return [];
    }
    const provinceDistricts = NEPAL_LOCATION_DATA[selectedProvince].districts;
    if (selectedDistrict && provinceDistricts[selectedDistrict]) {
      return provinceDistricts[selectedDistrict];
    }
    return Object.values(provinceDistricts).flat();
  }, [selectedProvince, selectedDistrict]);

  const handleProvinceChange = (province) => {
    setSelectedProvince(province);
    if (!province || !NEPAL_LOCATION_DATA[province]) {
      setSelectedDistrict("");
      setSelectedCity("");
      return;
    }
    const newDistricts = Object.keys(NEPAL_LOCATION_DATA[province].districts);
    if (!newDistricts.includes(selectedDistrict)) {
      setSelectedDistrict("");
      setSelectedCity("");
    } else if (selectedDistrict) {
      const validCities =
        NEPAL_LOCATION_DATA[province].districts[selectedDistrict] || [];
      if (!validCities.includes(selectedCity)) {
        setSelectedCity("");
      }
    }
  };

  const handleDistrictChange = (district) => {
    setSelectedDistrict(district);
    if (district && selectedProvince && NEPAL_LOCATION_DATA[selectedProvince]) {
      const validCities =
        NEPAL_LOCATION_DATA[selectedProvince].districts[district] || [];
      if (!validCities.includes(selectedCity)) {
        setSelectedCity("");
      }
    } else if (!district) {
      if (selectedProvince && NEPAL_LOCATION_DATA[selectedProvince]) {
        const allCities = Object.values(
          NEPAL_LOCATION_DATA[selectedProvince].districts,
        ).flat();
        if (!allCities.includes(selectedCity)) {
          setSelectedCity("");
        }
      } else {
        setSelectedCity("");
      }
    }
  };

  const handleCityChange = (city) => {
    setSelectedCity(city);
    if (
      city &&
      selectedProvince &&
      !selectedDistrict &&
      NEPAL_LOCATION_DATA[selectedProvince]
    ) {
      const provDistricts = NEPAL_LOCATION_DATA[selectedProvince].districts;
      for (const [distName, cities] of Object.entries(provDistricts)) {
        if (cities.includes(city)) {
          setSelectedDistrict(distName);
          break;
        }
      }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setCoordError("");

    const trimmedLat = latitude.trim();
    const trimmedLng = longitude.trim();

    if ((trimmedLat !== "" && trimmedLng === "") || (trimmedLat === "" && trimmedLng !== "")) {
      setCoordError("Please provide both latitude and longitude, or leave both empty.");
      return;
    }

    if (trimmedLat !== "") {
      const sanitizedLat = sanitizeCoordinate(trimmedLat, "lat");
      if (sanitizedLat === null) {
        setCoordError("Latitude must be a valid number between -90 and 90.");
        return;
      }
    }

    if (trimmedLng !== "") {
      const sanitizedLng = sanitizeCoordinate(trimmedLng, "lng");
      if (sanitizedLng === null) {
        setCoordError("Longitude must be a valid number between -180 and 180.");
        return;
      }
    }

    const finalLat = trimmedLat === "" ? null : Number(trimmedLat);
    const finalLng = trimmedLng === "" ? null : Number(trimmedLng);

    const sanitized = sanitizeCustomerLocation({
      country: "Nepal",
      province: selectedProvince,
      district: selectedDistrict,
      city: selectedCity,
      latitude: finalLat,
      longitude: finalLng,
    });
    onSave(sanitized);
  };

  const handleReset = () => {
    setSelectedProvince("");
    setSelectedDistrict("");
    setSelectedCity("");
    setLatitude("");
    setLongitude("");
    setCoordError("");
    onClear();
  };

  const hasCoords =
    typeof location?.latitude === "number" &&
    Number.isFinite(location.latitude) &&
    typeof location?.longitude === "number" &&
    Number.isFinite(location.longitude);

  const isLocationSet = Boolean(
    location?.province || location?.city || location?.district || hasCoords,
  );

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className="location-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="location-modal-title"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className="modal-close"
          onClick={onClose}
          aria-label="Close location selector"
        >
          <i className="fa fa-xmark" />
        </button>
        <p className="eyebrow">YOUR LOCATION IN NEPAL</p>
        <h2 id="location-modal-title">Choose your location</h2>
        <p className="location-modal-desc">
          Choose your location to personalize your VASTAAR shopping experience across Nepal.
        </p>

        <div className={`location-active-card ${isLocationSet ? "active" : ""}`}>
          <div className="location-active-icon">
            <i
              className={
                isLocationSet ? "fa fa-location-dot" : "fa fa-earth-asia"
              }
              aria-hidden="true"
            />
          </div>
          <div className="location-active-info">
            <span className="location-active-label">
              {isLocationSet ? "Current Selected Location" : "Default Location"}
            </span>
            <strong className="location-active-name">
              {isLocationSet
                ? [
                    location.city,
                    location.district ? `${location.district} District` : "",
                    location.province,
                    location.country,
                  ]
                    .filter(Boolean)
                    .join(", ")
                : "Nepal (Countrywide)"}
            </strong>
            {hasCoords ? (
              <span className="location-coords-status">
                <i className="fa fa-circle-check" aria-hidden="true" /> Distance information available
              </span>
            ) : (
              <span className="location-coords-status-muted">
                <i className="fa fa-circle-info" aria-hidden="true" /> Add coordinates below for approximate store distance
              </span>
            )}
          </div>
          {isLocationSet && (
            <button
              type="button"
              className="location-reset-btn"
              onClick={handleReset}
              title="Reset location to default Nepal"
              aria-label="Reset location to default Nepal"
            >
              <i className="fa fa-rotate-left" aria-hidden="true" /> Reset
            </button>
          )}
        </div>

        <form onSubmit={handleSubmit} className="location-form">
          <div className="location-form-fields">
            <label>
              Country
              <input
                type="text"
                value="Nepal"
                disabled
                readOnly
                className="location-country-input"
              />
            </label>

            <label>
              Province
              <select
                value={selectedProvince}
                onChange={(e) => handleProvinceChange(e.target.value)}
                aria-label="Select province"
              >
                <option value="">Select Province (optional)</option>
                {NEPAL_PROVINCES.map((prov) => (
                  <option key={prov} value={prov}>
                    {prov}
                  </option>
                ))}
              </select>
            </label>

            <label>
              District
              <select
                value={selectedDistrict}
                onChange={(e) => handleDistrictChange(e.target.value)}
                disabled={!selectedProvince}
                aria-label="Select district"
              >
                <option value="">
                  {selectedProvince
                    ? "Select District (optional)"
                    : "Select province first"}
                </option>
                {availableDistricts.map((dist) => (
                  <option key={dist} value={dist}>
                    {dist}
                  </option>
                ))}
              </select>
            </label>

            <label>
              City / Municipality
              <select
                value={selectedCity}
                onChange={(e) => handleCityChange(e.target.value)}
                disabled={!selectedProvince}
                aria-label="Select city"
              >
                <option value="">
                  {selectedProvince
                    ? "Select City (optional)"
                    : "Select province first"}
                </option>
                {availableCities.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div className="location-coords-group">
            <div className="location-coords-heading">
              <span className="location-coords-title">Coordinates (Optional)</span>
              <span className="location-coords-hint">
                Coordinates help show approximate distance to stores.
              </span>
            </div>
            {coordError ? (
              <div className="location-coords-error" role="alert">
                <i className="fa fa-circle-exclamation" /> {coordError}
              </div>
            ) : null}
            <div className="location-coords-fields">
              <label>
                Latitude (Optional)
                <input
                  type="number"
                  step="any"
                  min="-90"
                  max="90"
                  placeholder="e.g. 27.7172"
                  value={latitude}
                  onChange={(e) => {
                    setLatitude(e.target.value);
                    if (coordError) setCoordError("");
                  }}
                  aria-label="Latitude (Optional)"
                />
              </label>
              <label>
                Longitude (Optional)
                <input
                  type="number"
                  step="any"
                  min="-180"
                  max="180"
                  placeholder="e.g. 85.3240"
                  value={longitude}
                  onChange={(e) => {
                    setLongitude(e.target.value);
                    if (coordError) setCoordError("");
                  }}
                  aria-label="Longitude (Optional)"
                />
              </label>
            </div>
          </div>

          <div className="location-modal-actions">
            <button
              type="button"
              className="location-cancel-btn"
              onClick={onClose}
            >
              Cancel
            </button>
            <button type="submit" className="location-save-btn">
              <i className="fa fa-check" /> Save Location
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function Announcement() {
  return (
    <div className="topbar">
      🇳🇵 Free delivery across Nepal on orders above <strong>Rs. 1,500</strong>{" "}
      &nbsp;|&nbsp; Use code <strong>VASTAAR20</strong> for 20% off your first
      order &nbsp;|&nbsp; Easy returns within 30 days
    </div>
  );
}
function Header({
  query,
  setQuery,
  search,
  cartCount,
  wishlistCount,
  openCart,
  setCategory,
  customerLocation,
  openLocationModal,
}) {
  const hasCoords =
    typeof customerLocation?.latitude === "number" &&
    Number.isFinite(customerLocation.latitude) &&
    typeof customerLocation?.longitude === "number" &&
    Number.isFinite(customerLocation.longitude);

  const locationTooltip = customerLocation?.province
    ? [
        customerLocation.city,
        customerLocation.district ? `${customerLocation.district} District` : "",
        customerLocation.province,
        customerLocation.country,
        hasCoords ? "(Distance available)" : "",
      ]
        .filter(Boolean)
        .join(", ")
    : hasCoords
    ? "Nepal (Distance available)"
    : "Select your delivery location in Nepal";

  const locationDisplay = customerLocation?.city
    ? `${customerLocation.city}, ${customerLocation.province}`
    : customerLocation?.province
    ? `${customerLocation.province}`
    : "Nepal";

  return (
    <header className="header">
      <div className="header-main">
        <a href="#top" className="logo">
          <div className="logo-mark">V</div>
          <div className="logo-text-wrap">
            <div className="logo-name">VASTAAR</div>
            <div className="logo-tagline">Nepal's Fashion</div>
          </div>
        </a>
        <button
          type="button"
          className={`hdr-location-btn ${hasCoords ? "has-coords" : ""}`}
          onClick={openLocationModal}
          title={locationTooltip}
          aria-label="Select delivery location in Nepal"
        >
          <i className="fa fa-location-dot" aria-hidden="true" />
          <div className="hdr-location-info">
            <span className="hdr-location-caption">Deliver to</span>
            <span className="hdr-location-val">
              {locationDisplay}
              {hasCoords && (
                <span
                  className="hdr-location-badge"
                  title="Approximate distance estimates active"
                  aria-label="Distance active"
                >
                  <i className="fa fa-route" aria-hidden="true" />
                </span>
              )}
            </span>
          </div>
        </button>
        <div className="search-wrap">
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            onKeyDown={(event) => event.key === "Enter" && search()}
            placeholder="Search for clothes, brands, accessories..."
            aria-label="Search products"
          />
          <button onClick={search} aria-label="Search">
            <i className="fa fa-search" />
          </button>
        </div>
        <div className="hdr-actions">
          <button className="hdr-btn">
            <i className="fa fa-user" />
            <span>Profile</span>
          </button>
          <button
            className="hdr-btn"
            onClick={() =>
              document
                .getElementById("products")
                ?.scrollIntoView({ behavior: "smooth" })
            }
          >
            <i className="fa fa-heart" />
            <span>Wishlist</span>
            <span className="hdr-badge">{wishlistCount}</span>
          </button>
          <button className="hdr-btn" onClick={openCart}>
            <i className="fa fa-shopping-bag" />
            <span>Bag</span>
            <span className="hdr-badge">{cartCount}</span>
          </button>
        </div>
      </div>
      <nav className="navbar">
        <div className="nav-inner">
          {[
            "Men",
            "Women",
            "Kids",
            "Ethnic Wear",
            "Western",
            "Footwear",
            "Accessories",
            "Jewellery",
            "Home & Living",
            "Beauty",
          ].map((item) => (
            <button
              key={item}
              className="nav-item"
              onClick={() => {
                setCategory(item);
                document
                  .getElementById("products")
                  ?.scrollIntoView({ behavior: "smooth" });
              }}
            >
              {item}
              {item === "Ethnic Wear" && <span className="new-tag">NEW</span>}
            </button>
          ))}
          <button
            className="nav-item sale-item"
            onClick={() =>
              document
                .getElementById("sale")
                ?.scrollIntoView({ behavior: "smooth" })
            }
          >
            🔥 SALE
          </button>
        </div>
      </nav>
    </header>
  );
}
function Hero({ slide, setSlide, onShop }) {
  const copy = [
    [
      "New Collection 2024",
      <>
        Wear the <em>Pride</em>
        <br />
        of Nepal
      </>,
      "Discover handcrafted ethnic wear, modern Daura-Suruwal, and exquisite Dhaka fabric designs made for every occasion.",
    ],
    [
      "Winter Sale",
      <>
        <em>Upto 60%</em>
        <br />
        Off on Woolens
      </>,
      "Stay warm and stylish this winter with premium woolen jackets, Pashmina shawls, and cozy knitwear from the best Nepali brands.",
    ],
    [
      "Festival Special",
      <>
        Dashain &<br />
        <em>Tihar</em> Looks
      </>,
      "Celebrate with the finest festival fashion - from vibrant Saris and Kurtas to premium accessories for the whole family.",
    ],
  ];
  return (
    <section className="hero">
      <div
        className="hero-track"
        style={{ transform: `translateX(-${slide * 100}%)` }}
      >
        {copy.map((item, index) => (
          <div
            className={`hero-slide slide-${String.fromCharCode(97 + index)}`}
            key={item[0]}
          >
            <div className="slide-overlay" />
            <div className="hero-geo">
              <div className="geo-ring geo-ring-1" />
              <div className="geo-ring geo-ring-2" />
              <div className="geo-ring geo-ring-3" />
            </div>
            <div className="hero-content">
              <div className="hero-pill">{item[0]}</div>
              <h1 className="hero-title">{item[1]}</h1>
              <p className="hero-desc">{item[2]}</p>
              <div className="hero-btns">
                <button className="btn-primary" onClick={onShop}>
                  Shop Now <i className="fa fa-arrow-right" />
                </button>
                <button className="btn-outline" onClick={onShop}>
                  Explore Collection
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="hero-arrows">
        <button
          className="hero-arr"
          onClick={() => setSlide((slide + 2) % 3)}
          aria-label="Previous slide"
        >
          <i className="fa fa-chevron-left" />
        </button>
        <button
          className="hero-arr"
          onClick={() => setSlide((slide + 1) % 3)}
          aria-label="Next slide"
        >
          <i className="fa fa-chevron-right" />
        </button>
      </div>
      <div className="hero-dots">
        {copy.map((item, index) => (
          <button
            key={item[0]}
            className={`hero-dot ${slide === index ? "active" : ""}`}
            onClick={() => setSlide(index)}
            aria-label={`Slide ${index + 1}`}
          />
        ))}
      </div>
    </section>
  );
}
function SectionHeading({ title, accent, subtitle, action, onAction }) {
  return (
    <div className="sec-head">
      <div>
        <div className="sec-title">
          {title} <span>{accent}</span>
        </div>
        <div className="sec-sub">{subtitle}</div>
      </div>
      <button className="view-all" onClick={onAction}>
        {action} <i className="fa fa-arrow-right" />
      </button>
    </div>
  );
}
function CategorySection({ active, setCategory }) {
  return (
    <section className="sec">
      <SectionHeading
        title="Shop by"
        accent="Category"
        subtitle="Browse across all fashion categories"
        action="View All"
        onAction={() => setCategory("")}
      />
      <div className="cat-grid">
        {categories.map(([name, emoji, color]) => (
          <button
            className={`cat-card ${active === name ? "selected" : ""}`}
            key={name}
            onClick={() => setCategory(name)}
          >
            <span className={`cat-circle cat-emoji-box ${color}`}>{emoji}</span>
            <span className="cat-name">{name}</span>
          </button>
        ))}
      </div>
    </section>
  );
}
function BannerStrip({ onSelect }) {
  return (
    <div className="banner-strip">
      <button
        className="banner-card banner-bg-1"
        onClick={() => onSelect("Ethnic Wear")}
      >
        <span className="banner-inner">
          <span className="banner-tag">Exclusive</span>
          <span className="banner-title">
            Dhaka Fabric
            <br />
            <em>Collection</em>
          </span>
          <span className="banner-desc">
            Handwoven heritage patterns - modern cuts
          </span>
          <span className="banner-cta">
            Shop Now <i className="fa fa-arrow-right" />
          </span>
        </span>
        <span className="banner-deco">🧵</span>
      </button>
      <button
        className="banner-card banner-bg-2"
        onClick={() => onSelect("Women")}
      >
        <span className="banner-inner">
          <span className="banner-tag">Trending</span>
          <span className="banner-title">
            Pashmina &<br />
            <em>Shawls</em>
          </span>
          <span className="banner-desc">Luxury wool from the Himalayas</span>
          <span className="banner-cta">
            Explore <i className="fa fa-arrow-right" />
          </span>
        </span>
        <span className="banner-deco">🏔️</span>
      </button>
    </div>
  );
}
function ProductCard({ product, wished, onWish, onAdd, customerLocation }) {
  const hasDiscount = product.was && Number(product.was) > Number(product.price);
  const discount = hasDiscount ? Math.round((1 - product.price / product.was) * 100) : 0;
  const locationScore = useMemo(
    () => getLocationRelevance(product, customerLocation),
    [product, customerLocation],
  );
  const productDistance = useMemo(
    () => getProductDistance(product, customerLocation),
    [product, customerLocation],
  );
  const formattedDistance = useMemo(
    () => (productDistance !== null ? formatDistance(productDistance) : null),
    [productDistance],
  );
  return (
    <article className="prod-card">
      <div className={`prod-img gradient-${product.gradient || "rose"}`}>
        {product.image ? (
          <img
            src={product.image}
            alt={product.name}
            className="product-image"
              onError={(event) => {
                event.currentTarget.style.display = "none";
                event.currentTarget.nextElementSibling?.classList.add("is-visible");
              }}
          />
        ) : (
            <span className="product-fallback is-visible">{product.emoji}</span>
        )}
        {product.image && <span className="product-fallback">{product.emoji}</span>}
        {product.badge ? (
          <span className={`prod-badge badge-${product.badgeType || "new"}`}>
            {product.badge}
          </span>
        ) : null}
        <button
          className={`prod-wish ${wished ? "active" : ""}`}
          onClick={onWish}
          aria-label="Toggle wishlist"
        >
          <i className="fa fa-heart" />
        </button>
        <button className="prod-quick" onClick={onAdd}>
          + ADD TO BAG
        </button>
      </div>
      <div className="prod-info">
        <div className="prod-brand">
          {product.storeName ? (
            <span className="prod-seller-tag">
              <i className="fa fa-store" /> {product.storeName}
              {product.storeCity ? ` • ${product.storeCity}` : ""}
              {locationScore > 0 ? (
                <span className="prod-local-badge" title="Local seller match">
                  <i className="fa fa-location-dot" aria-hidden="true" /> Local Pick
                </span>
              ) : null}
              {formattedDistance ? (
                <span
                  className="prod-distance-badge"
                  title={`Approx. ${formattedDistance} from your location (straight-line)`}
                  aria-label={`Approximate distance: ${formattedDistance} away`}
                >
                  <i className="fa fa-route" aria-hidden="true" /> {formattedDistance} away
                </span>
              ) : null}
            </span>
          ) : (
            product.brand
          )}
        </div>
        <div className="prod-name">{product.name}</div>
        <div className="prod-price">
          <span className="price-now">{money(product.price)}</span>
          {hasDiscount ? (
            <>
              <span className="price-was">{money(product.was)}</span>
              <span className="price-off">{discount}% off</span>
            </>
          ) : null}
        </div>
        <div className="prod-stars">
          <span className="star-badge">
            <i className="fa fa-star" /> {product.rating}
          </span>
          <span className="star-count">
            ({product.reviews.toLocaleString()})
          </span>
        </div>
      </div>
    </article>
  );
}
function Reels({ onAdd }) {
  const [index, setIndex] = useState(0);
  return (
    <section className="reels-section">
      <div className="reels-inner">
        <div className="reels-head">
          <div>
            <div className="reels-title">
              Fashion <span>Reels</span> 🎬
            </div>
            <div className="reels-sub">
              Watch, discover and shop - Nepal's hottest fashion in short clips
            </div>
          </div>
          <button className="reels-view-all" onClick={() => setIndex(0)}>
            See All Reels <i className="fa fa-arrow-right" />
          </button>
        </div>
        <div className="reels-track-wrap">
          <div className="reels-nav">
            <button
              className="reels-arr"
              onClick={() => setIndex(Math.max(0, index - 3))}
              aria-label="Previous reels"
            >
              <i className="fa fa-chevron-left" />
            </button>
            <button
              className="reels-arr"
              onClick={() => setIndex(Math.min(reels.length - 3, index + 3))}
              aria-label="Next reels"
            >
              <i className="fa fa-chevron-right" />
            </button>
          </div>
          <div
            className="reels-track"
            style={{ transform: `translateX(-${index * 216}px)` }}
          >
            {reels.map((reel) => (
              <article className={`reel-card ${reel[3]}`} key={reel[1]}>
                <div className="reel-overlay">
                  <div className="reel-top">
                    <button className="reel-play" aria-label="Play reel">
                      <i className="fa fa-play" />
                    </button>
                    {reel[6] && (
                      <span className="reel-live">
                        <span className="live-dot" />
                        LIVE
                      </span>
                    )}
                  </div>
                  <div className="reel-product-visual">{reel[0]}</div>
                  <div className="reel-bottom">
                    <div className="reel-product-name">{reel[1]}</div>
                    <div className="reel-price">{money(reel[2])}</div>
                    <div className="reel-actions">
                      <button
                        className="reel-add-btn"
                        onClick={() => onAdd(reel)}
                      >
                        + Bag
                      </button>
                      <div className="reel-stats">
                        <span className="reel-stat">
                          <i className="fa fa-heart" /> {reel[4]}
                        </span>
                        <span className="reel-stat">
                          <i className="fa fa-eye" /> {reel[5]}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
function SaleBanner({ timer, onClick }) {
  return (
    <section className="sale-banner" id="sale">
      <div className="sale-inner">
        <div className="sale-pill">⚡ Limited Time Only</div>
        <div className="sale-title">
          End of Season <em>SALE</em>
        </div>
        <div className="sale-desc">
          Upto 70% off on 10,000+ styles - Hurry, offer ends soon!
        </div>
        <div className="sale-timer">
          {[
            ["hours", timer.hours],
            ["mins", timer.minutes],
            ["secs", timer.seconds],
          ].map(([label, value]) => (
            <div className="timer-block" key={label}>
              <div className="timer-num">{String(value).padStart(2, "0")}</div>
              <div className="timer-label">{label.toUpperCase()}</div>
            </div>
          ))}
        </div>
        <button className="sale-cta" onClick={onClick}>
          Grab The Deal <i className="fa fa-arrow-right" />
        </button>
      </div>
    </section>
  );
}
function Arrivals({ onAdd }) {
  return (
    <section className="sec">
      <SectionHeading
        title="New"
        accent="Arrivals"
        subtitle="Fresh styles added daily"
        action="View All"
        onAction={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      />
      <div className="arrivals-track">
        {arrivals.map((item) => (
          <button
            className="arrival-card"
            key={item[2]}
            onClick={() => onAdd(item)}
          >
            <div className={`arrival-img ${item[4]}`}>{item[0]}</div>
            <div className="arrival-info">
              <div className="arrival-brand">{item[1]}</div>
              <div className="arrival-name">{item[2]}</div>
              <div className="arrival-price">{money(item[3])}</div>
            </div>
          </button>
        ))}
      </div>
    </section>
  );
}
function Brands() {
  return (
    <section className="brands-sec">
      <div className="brands-title">Trusted Nepali Brands</div>
      <div className="brands-row">
        {[
          "Tibetan Arts",
          "HimalWool",
          "EverestSteps",
          "DhakaStyle",
          "SherpaKnit",
          "KathmanduGems",
          "NepalPeak",
        ].map((brand) => (
          <span className="brand-logo" key={brand}>
            {brand}
          </span>
        ))}
      </div>
    </section>
  );
}
function Footer({ onSubscribe, onBecomeSeller, onOpenDashboard }) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("");
  const subscribe = async (event) => {
    event.preventDefault();
    try {
      const response = await fetch(`${API}/subscribers`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const body = await response.json();
      if (!response.ok) throw new Error(body.message);
      setStatus(body.message);
      setEmail("");
      onSubscribe("Welcome to the VASTAAR list");
    } catch (err) {
      setStatus(err.message);
    }
  };
  return (
    <footer className="footer">
      <div className="footer-top">
        <div className="footer-brand">
          <div className="logo">
            <div className="logo-mark">V</div>
            <div className="logo-text-wrap">
              <div className="logo-name">VASTAAR</div>
              <div className="logo-tagline">Nepal's Fashion</div>
            </div>
          </div>
          <p className="footer-desc">
            Nepal's premier online fashion destination - bringing authentic
            Nepali craftsmanship, modern style, and unbeatable value to every
            doorstep across the country.
          </p>
          <form className="subscribe-form" onSubmit={subscribe}>
            <label htmlFor="email">Get the edit in your inbox</label>
            <div>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="Email address"
                required
              />
              <button aria-label="Subscribe">
                <i className="fa fa-arrow-right" />
              </button>
            </div>
            <small>{status}</small>
          </form>
        </div>
        {[
          [
            "Quick Links",
            "New Arrivals",
            "Best Sellers",
            "Ethnic Wear",
            "Sale & Offers",
            "Gift Cards",
          ],
          [
            "Customer Care",
            "Track My Order",
            "Returns & Exchange",
            "Size Guide",
            "FAQ",
            "Contact Us",
          ],
          [
            "Company",
            "About VASTAAR",
            "Sell on VASTAAR",
            "Seller Dashboard",
            "Careers",
            "Privacy Policy",
            "Terms of Use",
          ],
        ].map(([heading, ...links]) => (
          <div className="footer-col" key={heading}>
            <h4>{heading}</h4>
            <ul className="footer-links">
              {links.map((link) => (
                <li key={link}>
                  {link === "Sell on VASTAAR" ? (
                    <button className="footer-link-button" onClick={onBecomeSeller}>
                      {link}
                    </button>
                  ) : link === "Seller Dashboard" ? (
                    <button className="footer-link-button" onClick={onOpenDashboard}>
                      {link}
                    </button>
                  ) : (
                    <a href="#products">{link}</a>
                  )}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="footer-bottom">
        <span className="footer-copy">
          © 2026 VASTAAR Fashion Pvt. Ltd. Kathmandu, Nepal. All rights
          reserved.
        </span>
        <div className="footer-pay">
          <span className="pay-badge">eSewa</span>
          <span className="pay-badge">Khalti</span>
          <span className="pay-badge">ConnectIPS</span>
          <span className="pay-badge">COD</span>
        </div>
      </div>
    </footer>
  );
}

function SellerRegistration({ onClose, onSuccess }) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    storeName: "",
    description: "",
    city: "",
    address: "",
    storePhone: "",
  });
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const verificationStatus = submitted?.seller?.status || "pending";
  const statusLabel = {
    pending: "Pending verification",
    approved: "Seller verification approved",
    rejected: "Seller verification rejected",
  }[verificationStatus] || "Pending verification";
  const update = (field, value) =>
    setForm((current) => ({ ...current, [field]: value }));
  const submit = async (event) => {
    event.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      const response = await fetch(`${API}/sellers`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          seller: { name: form.name, email: form.email, phone: form.phone },
          store: {
            name: form.storeName,
            description: form.description,
            city: form.city,
            address: form.address,
            phone: form.storePhone,
          },
        }),
      });
      const body = await response.json();
      if (!response.ok) throw new Error(body.message);
      setSubmitted(body);
    } catch (err) {
      setError(err.message || "Unable to submit registration.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className="seller-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="seller-registration-title"
        onClick={(event) => event.stopPropagation()}
      >
        <button className="modal-close" onClick={onClose} aria-label="Close seller registration">
          <i className="fa fa-xmark" />
        </button>
        {submitted ? (
          <div className="seller-success">
            <div className={`success-icon seller-status-${verificationStatus}`}><i className={`fa ${verificationStatus === "rejected" ? "fa-xmark" : "fa-check"}`} /></div>
            <p className="eyebrow">SELLER STATUS</p>
            <h2 id="seller-registration-title">{statusLabel}</h2>
            <p>
              {verificationStatus === "pending" && "Your seller registration has been submitted. We will review your details before your store goes live."}
              {verificationStatus === "approved" && "Your seller registration has been approved. Store activation will follow in a later marketplace phase."}
              {verificationStatus === "rejected" && (submitted.seller.verification?.rejectionReason || "Your seller registration was not approved.")}
            </p>
            <button className="checkout-btn" onClick={onSuccess}>Continue shopping <i className="fa fa-arrow-right" /></button>
          </div>
        ) : (
          <>
            <p className="eyebrow">JOIN THE MARKETPLACE</p>
            <h2 id="seller-registration-title">Become a VASTAAR seller</h2>
            <p className="seller-intro">Bring your local fashion store to customers across Nepal.</p>
            <form onSubmit={submit}>
              <div className="seller-form-section">
                <h3>Seller information</h3>
                <div className="seller-fields">
                  <label>Full name<input value={form.name} onChange={(event) => update("name", event.target.value)} required /></label>
                  <label>Email<input type="email" value={form.email} onChange={(event) => update("email", event.target.value)} required /></label>
                  <label>Phone<input type="tel" inputMode="tel" minLength={7} maxLength={20} value={form.phone} onChange={(event) => update("phone", event.target.value)} required /></label>
                </div>
              </div>
              <div className="seller-form-section">
                <h3>Store information</h3>
                <div className="seller-fields">
                  <label>Store name<input value={form.storeName} onChange={(event) => update("storeName", event.target.value)} required /></label>
                  <label>City<input value={form.city} onChange={(event) => update("city", event.target.value)} required /></label>
                  <label>Store phone <span className="optional">(optional)</span><input type="tel" inputMode="tel" value={form.storePhone} onChange={(event) => update("storePhone", event.target.value)} placeholder="Uses seller phone if empty" /></label>
                </div>
                <label>Description <span className="optional">(optional)</span><textarea rows="3" value={form.description} onChange={(event) => update("description", event.target.value)} /></label>
                <label>Store address<textarea rows="3" value={form.address} onChange={(event) => update("address", event.target.value)} required /></label>
              </div>
              {error && <p className="form-error">{error}</p>}
              <button className="checkout-btn" type="submit" disabled={submitting}>
                {submitting ? "Submitting..." : "Register as a Seller"} <i className={`fa ${submitting ? "fa-spinner fa-spin" : "fa-arrow-right"}`} />
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}

function SellerDashboard({ onClose }) {
  const [sellers, setSellers] = useState([]);
  const [sellerId, setSellerId] = useState("");
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [view, setView] = useState("dashboard");
  const [openAddProduct, setOpenAddProduct] = useState(false);

  useEffect(() => {
    fetch(`${API}/sellers`)
      .then(async (response) => {
        const body = await response.json();
        if (!response.ok) throw new Error(body.message || "Unable to load sellers.");
        return body.sellers;
      })
      .then((items) => {
        setSellers(items);
        if (items[0]) setSellerId(items[0].id);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    setView("dashboard");
    setOpenAddProduct(false);
    if (!sellerId) {
      setDashboard(null);
      return undefined;
    }
    setError("");
    setLoading(true);
    fetch(`${API}/sellers/${encodeURIComponent(sellerId)}/dashboard`)
      .then(async (response) => {
        const body = await response.json();
        if (!response.ok) throw new Error(body.message || "Unable to load dashboard.");
        return body;
      })
      .then(setDashboard)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
    return undefined;
  }, [sellerId]);

  const status = dashboard?.seller?.status || "pending";
  const statusLabel = { pending: "Pending Review", approved: "Approved", rejected: "Rejected" }[status] || status;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="dashboard-modal" role="dialog" aria-modal="true" aria-labelledby="dashboard-title" onClick={(event) => event.stopPropagation()}>
        <button className="modal-close" onClick={onClose} aria-label="Close seller dashboard"><i className="fa fa-xmark" /></button>
        <p className="eyebrow">LOCAL DEMO ACCESS</p>
        <h2 id="dashboard-title">VASTAAR Seller Dashboard</h2>
        <p className="dashboard-notice">Authentication is not implemented yet. Select a registered seller for local dashboard preview.</p>
        {loading && !sellers.length ? <div className="dashboard-state">Loading seller accounts...</div> : error ? <div className="dashboard-state dashboard-error">{error}</div> : !sellers.length ? <div className="dashboard-state"><i className="fa fa-store" /><strong>No seller accounts yet</strong><span>Complete seller registration before opening a dashboard.</span></div> : (
          <>
            <label className="dashboard-select-label">Demo seller<select value={sellerId} onChange={(event) => setSellerId(event.target.value)}>{sellers.map((seller) => <option value={seller.id} key={seller.id}>{seller.name} - {seller.status}</option>)}</select></label>
            {loading ? <div className="dashboard-state">Loading dashboard...</div> : dashboard && (
              view === "profile" ? (
                <StoreProfile
                  storeId={dashboard.store?.id}
                  initialStore={dashboard.store}
                  onBack={() => setView("dashboard")}
                  onUpdate={(updatedStore) => {
                    setDashboard((current) => current ? { ...current, store: updatedStore } : current);
                  }}
                />
              ) : view === "products" ? (
                <SellerProducts
                  sellerId={dashboard.seller.id}
                  store={dashboard.store}
                  onBack={() => setView("dashboard")}
                  onProductCountChange={(count) => {
                    setDashboard((current) => current ? { ...current, stats: { ...current.stats, products: count } } : current);
                  }}
                  openAddDirectly={openAddProduct}
                  onCloseAddDirectly={() => setOpenAddProduct(false)}
                />
              ) : view === "inventory" ? (
                <SellerInventory
                  sellerId={dashboard.seller.id}
                  store={dashboard.store}
                  onBack={() => setView("dashboard")}
                  onInventoryCountChange={(count) => {
                    setDashboard((current) => current ? { ...current, stats: { ...current.stats, inventory: count } } : current);
                  }}
                />
              ) : view === "orders" ? (
                <SellerOrders
                  sellerId={dashboard.seller.id}
                  store={dashboard.store}
                  onBack={() => setView("dashboard")}
                  onOrderCountChange={(count) => {
                    setDashboard((current) => current ? { ...current, stats: { ...current.stats, orders: count } } : current);
                  }}
                />
              ) : (
                <>
                  <div className="dashboard-welcome"><span>Welcome, {dashboard.seller.name}</span><small>{dashboard.store?.name || "Store not created"}</small></div>
                  <div className="dashboard-grid">
                    <DashboardCard icon="fa-shield-halved" label="Verification" value={statusLabel} tone={status} detail={status === "rejected" ? dashboard.seller.verification?.rejectionReason : status === "pending" ? "Your application is under review." : "Seller verification complete."} />
                    <DashboardCard icon="fa-box" label="Products" value={dashboard.stats.products} detail={`${dashboard.stats.products} listed in store`} />
                    <DashboardCard icon="fa-layer-group" label="Inventory" value={dashboard.stats.inventory !== undefined ? dashboard.stats.inventory : 0} detail={`${dashboard.stats.inventory !== undefined ? dashboard.stats.inventory : 0} tracked items`} />
                    <DashboardCard icon="fa-receipt" label="Orders" value={dashboard.stats.orders !== undefined ? dashboard.stats.orders : 0} detail={`${dashboard.stats.orders !== undefined ? dashboard.stats.orders : 0} seller orders`} />
                    <DashboardCard icon="fa-store" label="Store status" value={dashboard.store?.status || "Not available"} detail={dashboard.store?.city || "Store profile"} />
                    <DashboardCard icon="fa-id-card" label="Seller ID" value={dashboard.seller.id} detail={`Registered ${new Date(dashboard.seller.createdAt).toLocaleDateString("en-NP")}`} />
                  </div>
                  <div className="dashboard-actions">
                    <strong>Quick actions</strong>
                    <div>
                      <button
                        type="button"
                        className="dashboard-action-active"
                        onClick={() => setView("profile")}
                        disabled={!dashboard.store}
                      >
                        Manage Store <small>{dashboard.store ? "View & edit profile" : "Store not created"}</small>
                      </button>
                      <button
                        type="button"
                        className="dashboard-action-active"
                        onClick={() => {
                          setView("products");
                          setOpenAddProduct(false);
                        }}
                        disabled={!dashboard.store}
                      >
                        Manage Products <small>{dashboard.store ? "View & edit products" : "Store not created"}</small>
                      </button>
                      <button
                        type="button"
                        className="dashboard-action-active"
                        onClick={() => {
                          setView("products");
                          setOpenAddProduct(true);
                        }}
                        disabled={!dashboard.store}
                      >
                        Add Product <small>{dashboard.store ? "List a new item" : "Store not created"}</small>
                      </button>
                      <button
                        type="button"
                        className="dashboard-action-active"
                        onClick={() => setView("inventory")}
                        disabled={!dashboard.store}
                      >
                        Manage Inventory <small>{dashboard.store ? "Track & update stock" : "Store not created"}</small>
                      </button>
                      <button
                        type="button"
                        className="dashboard-action-active"
                        onClick={() => setView("orders")}
                        disabled={!dashboard.store}
                      >
                        Manage Orders <small>{dashboard.store ? "View & manage orders" : "Store not created"}</small>
                      </button>
                    </div>
                  </div>
                </>
              )
            )}
          </>
        )}
      </div>
    </div>
  );
}

function StoreProfile({ storeId, initialStore, onBack, onUpdate }) {
  const [store, setStore] = useState(initialStore || null);
  const [loading, setLoading] = useState(!initialStore && Boolean(storeId));
  const [fetchError, setFetchError] = useState("");
  const [form, setForm] = useState({
    name: initialStore?.name || "",
    phone: initialStore?.phone || "",
    email: initialStore?.email || "",
    country: initialStore?.country || "Nepal",
    province: initialStore?.province || "",
    city: initialStore?.city || "",
    district: initialStore?.district || "",
    address: initialStore?.address || "",
    latitude: initialStore?.latitude !== undefined && initialStore?.latitude !== null ? String(initialStore.latitude) : "",
    longitude: initialStore?.longitude !== undefined && initialStore?.longitude !== null ? String(initialStore.longitude) : "",
    openingHours: initialStore?.openingHours || "",
    description: initialStore?.description || "",
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const loadStore = async (id) => {
    if (!id) return;
    setLoading(true);
    setFetchError("");
    try {
      const response = await fetch(`${API}/stores/${encodeURIComponent(id)}`);
      const body = await response.json();
      if (!response.ok) throw new Error(body.message || "Unable to load store profile.");
      setStore(body.store);
      setForm({
        name: body.store.name || "",
        phone: body.store.phone || "",
        email: body.store.email || "",
        country: body.store.country || "Nepal",
        province: body.store.province || "",
        city: body.store.city || "",
        district: body.store.district || "",
        address: body.store.address || "",
        latitude: body.store.latitude !== undefined && body.store.latitude !== null ? String(body.store.latitude) : "",
        longitude: body.store.longitude !== undefined && body.store.longitude !== null ? String(body.store.longitude) : "",
        openingHours: body.store.openingHours || "",
        description: body.store.description || "",
      });
    } catch (err) {
      setFetchError(err.message || "Unable to load store.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (storeId) {
      loadStore(storeId);
    }
  }, [storeId]);

  const updateField = (field, value) => {
    setForm((current) => ({ ...current, [field]: value }));
    if (success) setSuccess("");
    if (error) setError("");
  };

  const handleSave = async (event) => {
    event.preventDefault();
    if (!store?.id) return;
    setError("");
    setSuccess("");
    setSaving(true);

    try {
      const payload = {
        name: form.name.trim(),
        phone: form.phone.trim(),
        email: form.email.trim(),
        country: form.country.trim() || "Nepal",
        province: form.province.trim() || null,
        city: form.city.trim(),
        district: form.district.trim() || null,
        address: form.address.trim(),
        latitude: form.latitude.trim() === "" ? null : Number(form.latitude),
        longitude: form.longitude.trim() === "" ? null : Number(form.longitude),
        openingHours: form.openingHours.trim(),
        description: form.description.trim(),
      };

      const response = await fetch(`${API}/stores/${encodeURIComponent(store.id)}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const body = await response.json();
      if (!response.ok) {
        throw new Error(body.message || "Failed to update store profile.");
      }

      setStore(body.store);
      setForm({
        name: body.store.name || "",
        phone: body.store.phone || "",
        email: body.store.email || "",
        country: body.store.country || "Nepal",
        province: body.store.province || "",
        city: body.store.city || "",
        district: body.store.district || "",
        address: body.store.address || "",
        latitude: body.store.latitude !== undefined && body.store.latitude !== null ? String(body.store.latitude) : "",
        longitude: body.store.longitude !== undefined && body.store.longitude !== null ? String(body.store.longitude) : "",
        openingHours: body.store.openingHours || "",
        description: body.store.description || "",
      });
      setSuccess("Store profile updated successfully.");
      if (onUpdate) onUpdate(body.store);
    } catch (err) {
      setError(err.message || "An unexpected error occurred while saving.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="store-profile">
        <div className="store-profile-header">
          <h3>Store Profile</h3>
          <button type="button" className="store-profile-back" onClick={onBack}>
            <i className="fa fa-arrow-left" /> Back to Dashboard
          </button>
        </div>
        <div className="dashboard-state">Loading store profile...</div>
      </div>
    );
  }

  if (fetchError || !store) {
    return (
      <div className="store-profile">
        <div className="store-profile-header">
          <h3>Store Profile</h3>
          <button type="button" className="store-profile-back" onClick={onBack}>
            <i className="fa fa-arrow-left" /> Back to Dashboard
          </button>
        </div>
        <div className="dashboard-state dashboard-error">
          <i className="fa fa-circle-exclamation" />
          <strong>Store Profile Unavailable</strong>
          <span>{fetchError || "No store is associated with this seller account."}</span>
        </div>
      </div>
    );
  }

  const storeStatus = store.status || "pending";
  const storeStatusLabel = {
    pending: "Pending Review",
    approved: "Active",
    rejected: "Inactive",
  }[storeStatus] || storeStatus;

  return (
    <div className="store-profile">
      <div className="store-profile-header">
        <div>
          <h3>Manage Store Profile</h3>
          <small style={{ color: "var(--gray-mid)" }}>View and update your store details on VASTAAR</small>
        </div>
        <button type="button" className="store-profile-back" onClick={onBack}>
          <i className="fa fa-arrow-left" /> Back to Dashboard
        </button>
      </div>

      <div className="store-readonly-grid">
        <div className="store-readonly-item">
          <span>Store Status</span>
          <div>
            <span className={`store-status-pill ${storeStatus}`}>{storeStatusLabel}</span>
          </div>
        </div>
        <div className="store-readonly-item">
          <span>Store ID</span>
          <strong>{store.id}</strong>
        </div>
        <div className="store-readonly-item">
          <span>Seller ID</span>
          <strong>{store.sellerId}</strong>
        </div>
        <div className="store-readonly-item">
          <span>Created</span>
          <strong>{new Date(store.createdAt).toLocaleDateString("en-NP")}</strong>
        </div>
      </div>

      {success && (
        <div className="store-profile-success" role="status">
          <i className="fa fa-circle-check" />
          <span>{success}</span>
        </div>
      )}

      {error && (
        <div className="store-profile-error" role="alert">
          <i className="fa fa-circle-exclamation" />
          <span>{error}</span>
        </div>
      )}

      <form className="store-profile-form" onSubmit={handleSave}>
        <div className="seller-form-section" style={{ borderTop: "none", paddingTop: 0 }}>
          <div className="seller-fields">
            <label>
              Store Name <span style={{ color: "var(--crimson)" }}>*</span>
              <input
                type="text"
                value={form.name}
                onChange={(event) => updateField("name", event.target.value)}
                required
                minLength={2}
                maxLength={100}
                placeholder="e.g. Kathmandu Heritage Crafts"
              />
            </label>
            <label>
              Store Phone <span style={{ color: "var(--crimson)" }}>*</span>
              <input
                type="tel"
                inputMode="tel"
                value={form.phone}
                onChange={(event) => updateField("phone", event.target.value)}
                required
                minLength={7}
                maxLength={20}
                placeholder="e.g. 9812345678"
              />
            </label>
            <label>
              Store Contact Email <span className="optional">(optional)</span>
              <input
                type="email"
                value={form.email}
                onChange={(event) => updateField("email", event.target.value)}
                maxLength={100}
                placeholder="e.g. store@example.com"
              />
            </label>
            <label>
              Country <span className="optional">(default Nepal)</span>
              <input
                type="text"
                value={form.country}
                onChange={(event) => updateField("country", event.target.value)}
                maxLength={60}
                placeholder="Nepal"
              />
            </label>
            <label>
              Province <span className="optional">(optional)</span>
              <select
                value={form.province}
                onChange={(event) => updateField("province", event.target.value)}
              >
                <option value="">Select Province (optional)</option>
                {NEPAL_PROVINCES.map((prov) => (
                  <option key={prov} value={prov}>
                    {prov}
                  </option>
                ))}
              </select>
            </label>
            <label>
              City <span style={{ color: "var(--crimson)" }}>*</span>
              <input
                type="text"
                value={form.city}
                onChange={(event) => updateField("city", event.target.value)}
                required
                maxLength={60}
                placeholder="e.g. Kathmandu"
              />
            </label>
            <label>
              District <span className="optional">(optional)</span>
              <input
                type="text"
                value={form.district}
                onChange={(event) => updateField("district", event.target.value)}
                maxLength={60}
                placeholder="e.g. Kathmandu, Lalitpur, Kaski"
              />
            </label>
            <label>
              Latitude <span className="optional">(-90 to 90)</span>
              <input
                type="number"
                step="any"
                min="-90"
                max="90"
                value={form.latitude}
                onChange={(event) => updateField("latitude", event.target.value)}
                placeholder="e.g. 27.7172"
              />
            </label>
            <label>
              Longitude <span className="optional">(-180 to 180)</span>
              <input
                type="number"
                step="any"
                min="-180"
                max="180"
                value={form.longitude}
                onChange={(event) => updateField("longitude", event.target.value)}
                placeholder="e.g. 85.3240"
              />
            </label>
            <label>
              Opening Hours <span className="optional">(optional)</span>
              <input
                type="text"
                value={form.openingHours}
                onChange={(event) => updateField("openingHours", event.target.value)}
                maxLength={100}
                placeholder="e.g. 10:00 AM - 7:30 PM, Sun-Fri"
              />
            </label>
          </div>
          <label>
            Store Address <span style={{ color: "var(--crimson)" }}>*</span>
            <textarea
              rows={2}
              value={form.address}
              onChange={(event) => updateField("address", event.target.value)}
              required
              maxLength={200}
              placeholder="e.g. New Road, Ward 22, Kathmandu"
            />
          </label>
          <label>
            Store Description <span className="optional">(optional)</span>
            <textarea
              rows={3}
              value={form.description}
              onChange={(event) => updateField("description", event.target.value)}
              maxLength={500}
              placeholder="Tell customers about your store, craft, materials, and specialties..."
            />
          </label>
        </div>

        <div className="store-profile-actions">
          <button type="button" className="store-profile-back" onClick={onBack}>
            Cancel
          </button>
          <button
            type="submit"
            className="checkout-btn"
            style={{ width: "auto", minWidth: "160px", padding: "0 24px" }}
            disabled={saving}
          >
            {saving ? "Saving..." : "Save Changes"}{" "}
            <i className={`fa ${saving ? "fa-spinner fa-spin" : "fa-check"}`} />
          </button>
        </div>
      </form>
    </div>
  );
}

const PRODUCT_CATEGORIES = [
  "Ethnic Wear",
  "Western",
  "Kids",
  "Footwear",
  "Jewellery",
  "Bags",
  "Beauty",
  "Men",
  "Women",
  "Accessories",
  "Home & Living"
];

const GRADIENT_OPTIONS = [
  { value: "rose", label: "Rose (Warm Pink)" },
  { value: "sky", label: "Sky (Fresh Blue)" },
  { value: "lilac", label: "Lilac (Soft Purple)" },
  { value: "sun", label: "Sun (Warm Amber)" },
  { value: "mint", label: "Mint (Sage Green)" },
  { value: "pink", label: "Pink (Coral Blossom)" },
  { value: "aqua", label: "Aqua (Teal Wave)" },
  { value: "indigo", label: "Indigo (Deep Blue)" }
];

function SellerProducts({ sellerId, store, onBack, onProductCountChange, openAddDirectly, onCloseAddDirectly }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [editingProduct, setEditingProduct] = useState(null);
  const [isCreating, setIsCreating] = useState(false);
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterCategory, setFilterCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [togglingId, setTogglingId] = useState(null);

  useEffect(() => {
    if (openAddDirectly) {
      setIsCreating(true);
      if (onCloseAddDirectly) onCloseAddDirectly();
    }
  }, [openAddDirectly, onCloseAddDirectly]);

  const loadProducts = useCallback(async () => {
    if (!store?.id) return;
    setLoading(true);
    setError("");
    try {
      const response = await fetch(`${API}/stores/${encodeURIComponent(store.id)}/products`);
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Failed to load products.");
      const items = Array.isArray(data.products) ? data.products : [];
      setProducts(items);
      if (onProductCountChange) onProductCountChange(items.length);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [store?.id, onProductCountChange]);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  const handleToggleStatus = async (product) => {
    const newStatus = product.status === "active" ? "inactive" : "active";
    setTogglingId(product.id);
    setError("");
    setSuccess("");
    try {
      const response = await fetch(`${API}/products/${encodeURIComponent(product.id)}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Failed to update product status.");

      setProducts((current) =>
        current.map((item) => (item.id === product.id ? data.product : item))
      );
      setSuccess(`Product "${product.name}" is now ${newStatus}.`);
      setTimeout(() => setSuccess(""), 4000);
    } catch (err) {
      setError(err.message);
    } finally {
      setTogglingId(null);
    }
  };

  const handleProductSaved = (savedProduct, isNew) => {
    if (isNew) {
      setProducts((current) => {
        const next = [savedProduct, ...current];
        if (onProductCountChange) onProductCountChange(next.length);
        return next;
      });
      setSuccess(`Product "${savedProduct.name}" created successfully.`);
    } else {
      setProducts((current) =>
        current.map((item) => (item.id === savedProduct.id ? savedProduct : item))
      );
      setSuccess(`Product "${savedProduct.name}" updated successfully.`);
    }
    setEditingProduct(null);
    setIsCreating(false);
    setTimeout(() => setSuccess(""), 4000);
  };

  const filteredProducts = products.filter((p) => {
    if (filterStatus !== "all" && p.status !== filterStatus) return false;
    if (filterCategory !== "all" && p.category !== filterCategory) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = p.name?.toLowerCase().includes(q);
      const matchBrand = p.brand?.toLowerCase().includes(q);
      const matchCat = p.category?.toLowerCase().includes(q);
      const matchKeywords = Array.isArray(p.keywords) && p.keywords.some((k) => k.toLowerCase().includes(q));
      if (!matchName && !matchBrand && !matchCat && !matchKeywords) return false;
    }
    return true;
  });

  const totalCount = products.length;
  const activeCount = products.filter((p) => p.status === "active").length;
  const inactiveCount = products.filter((p) => p.status === "inactive").length;

  return (
    <div className="seller-products">
      <div className="seller-products-header">
        <div className="seller-products-title-wrap">
          <button type="button" className="store-profile-back" onClick={onBack}>
            <i className="fa fa-arrow-left" /> Back to Dashboard
          </button>
          <div>
            <h3>Manage Products</h3>
            <small style={{ color: "var(--gray-mid)" }}>{store?.name || "Store"}</small>
          </div>
        </div>
        <button
          type="button"
          className="checkout-btn"
          style={{ width: "auto", padding: "0 20px" }}
          onClick={() => {
            setEditingProduct(null);
            setIsCreating(true);
          }}
        >
          <i className="fa fa-plus" /> Add Product
        </button>
      </div>

      {success && (
        <div className="store-profile-success" role="status">
          <i className="fa fa-circle-check" />
          <span>{success}</span>
        </div>
      )}

      {error && (
        <div className="store-profile-error" role="alert">
          <i className="fa fa-circle-exclamation" />
          <span>{error}</span>
        </div>
      )}

      {/* Stats Bar */}
      <div className="seller-stats-bar">
        <div className="seller-stat-chip">
          <span>Total Products</span>
          <strong>{totalCount}</strong>
        </div>
        <div className="seller-stat-chip">
          <span>Active (Public)</span>
          <strong style={{ color: "#2e7d32" }}>{activeCount}</strong>
        </div>
        <div className="seller-stat-chip">
          <span>Inactive (Hidden)</span>
          <strong style={{ color: "#b42318" }}>{inactiveCount}</strong>
        </div>
      </div>

      {/* Search & Filter Controls */}
      <div className="seller-filter-bar">
        <div className="seller-search-box">
          <i className="fa fa-magnifying-glass" />
          <input
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name, brand, category..."
          />
        </div>
        <div className="seller-filter-selects">
          <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
            <option value="all">All Statuses ({totalCount})</option>
            <option value="active">Active Only ({activeCount})</option>
            <option value="inactive">Inactive Only ({inactiveCount})</option>
          </select>
          <select value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)}>
            <option value="all">All Categories</option>
            {PRODUCT_CATEGORIES.map((cat) => (
              <option value={cat} key={cat}>{cat}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Product List */}
      {loading ? (
        <div className="dashboard-state">
          <i className="fa fa-spinner fa-spin" />
          <span>Loading products...</span>
        </div>
      ) : products.length === 0 ? (
        <div className="dashboard-state">
          <i className="fa fa-box-open" />
          <strong>No products listed yet</strong>
          <span>Start selling by adding your first handcrafted or curated product.</span>
          <button
            type="button"
            className="checkout-btn"
            style={{ width: "auto", marginTop: 12, padding: "0 22px" }}
            onClick={() => {
              setEditingProduct(null);
              setIsCreating(true);
            }}
          >
            <i className="fa fa-plus" /> Add First Product
          </button>
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="dashboard-state">
          <i className="fa fa-filter" />
          <strong>No matching products found</strong>
          <span>Try adjusting your search terms or filter selections.</span>
          <button
            type="button"
            className="store-profile-back"
            style={{ marginTop: 8 }}
            onClick={() => {
              setSearchQuery("");
              setFilterStatus("all");
              setFilterCategory("all");
            }}
          >
            Clear Filters
          </button>
        </div>
      ) : (
        <div className="seller-products-grid">
          {filteredProducts.map((product) => {
            const isToggling = togglingId === product.id;
            return (
              <div
                key={product.id}
                className={`seller-product-card ${product.status === "inactive" ? "is-inactive" : ""}`}
              >
                <div className={`seller-product-visual gradient-${product.gradient || "rose"}`}>
                  {product.image ? (
                    <img src={product.image} alt={product.name} />
                  ) : (
                    <span className="seller-product-emoji">{product.emoji || "🛍️"}</span>
                  )}
                  {product.badge && (
                    <span className={`product-badge badge-${product.badgeType || "new"}`}>
                      {product.badge}
                    </span>
                  )}
                  <span className={`product-status-tag ${product.status}`}>
                    {product.status === "active" ? "Active" : "Inactive"}
                  </span>
                </div>

                <div className="seller-product-body">
                  <div className="seller-product-meta">
                    <span className="seller-product-category">{product.category}</span>
                    {product.brand && <span className="seller-product-brand">{product.brand}</span>}
                  </div>
                  <h4 className="seller-product-name">{product.name}</h4>
                  {product.description && (
                    <p className="seller-product-desc">{product.description}</p>
                  )}
                  <div className="seller-product-pricing">
                    <strong className="seller-product-price">Rs. {product.price.toLocaleString("en-NP")}</strong>
                    {product.was && (
                      <span className="seller-product-was">Rs. {product.was.toLocaleString("en-NP")}</span>
                    )}
                  </div>
                </div>

                <div className="seller-product-actions">
                  <button
                    type="button"
                    className="seller-action-btn edit-btn"
                    onClick={() => {
                      setIsCreating(false);
                      setEditingProduct(product);
                    }}
                    aria-label={`Edit ${product.name}`}
                  >
                    <i className="fa fa-pen-to-square" /> Edit
                  </button>
                  <button
                    type="button"
                    className={`seller-action-btn toggle-btn ${product.status === "active" ? "deactivate" : "activate"}`}
                    onClick={() => handleToggleStatus(product)}
                    disabled={isToggling}
                    aria-label={`${product.status === "active" ? "Deactivate" : "Activate"} ${product.name}`}
                  >
                    <i className={`fa ${isToggling ? "fa-spinner fa-spin" : product.status === "active" ? "fa-eye-slash" : "fa-eye"}`} />
                    {product.status === "active" ? "Deactivate" : "Activate"}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add / Edit Product Modal */}
      {(isCreating || editingProduct) && (
        <ProductFormModal
          product={editingProduct}
          storeId={store?.id}
          sellerId={sellerId}
          onClose={() => {
            setIsCreating(false);
            setEditingProduct(null);
          }}
          onSaved={handleProductSaved}
        />
      )}
    </div>
  );
}

function ProductFormModal({ product, storeId, sellerId, onClose, onSaved }) {
  const isEditing = Boolean(product && product.id);
  const [form, setForm] = useState({
    name: product?.name || "",
    category: product?.category || "Ethnic Wear",
    price: product?.price !== undefined ? String(product.price) : "",
    was: product?.was !== undefined && product?.was !== null ? String(product.was) : "",
    brand: product?.brand || "",
    description: product?.description || "",
    status: product?.status || "active",
    gradient: product?.gradient || "rose",
    badge: product?.badge || "",
    badgeType: product?.badgeType || "new",
    image: product?.image || "",
    keywords: Array.isArray(product?.keywords) ? product.keywords.join(", ") : (product?.keywords || "")
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const updateField = (field, value) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    // Client-side validation
    const trimmedName = form.name.trim();
    if (!trimmedName || trimmedName.length < 2 || trimmedName.length > 120) {
      setError("Product name must be between 2 and 120 characters.");
      return;
    }

    const priceNum = Number(form.price);
    if (isNaN(priceNum) || priceNum <= 0 || priceNum > 1000000) {
      setError("Please enter a valid price between Rs. 1 and Rs. 1,000,000.");
      return;
    }

    let wasNum = undefined;
    if (form.was.trim()) {
      wasNum = Number(form.was);
      if (isNaN(wasNum) || wasNum < priceNum) {
        setError("Original price (was) must be greater than or equal to current price.");
        return;
      }
    }

    if (!form.category.trim()) {
      setError("Please select a product category.");
      return;
    }

    const payload = {
      name: trimmedName,
      category: form.category.trim(),
      price: Math.round(priceNum),
      was: wasNum !== undefined ? Math.round(wasNum) : (isEditing ? null : undefined),
      brand: form.brand.trim() || (isEditing ? null : undefined),
      description: form.description.trim() || undefined,
      status: form.status,
      gradient: form.gradient,
      badge: form.badge.trim() || (isEditing ? null : undefined),
      badgeType: form.badge.trim() ? form.badgeType : (isEditing ? null : undefined),
      image: form.image.trim() || (isEditing ? null : undefined),
      keywords: form.keywords.trim() ? form.keywords.split(",").map((k) => k.trim()).filter(Boolean) : []
    };

    setSaving(true);
    try {
      const url = isEditing
        ? `${API}/products/${encodeURIComponent(product.id)}`
        : `${API}/stores/${encodeURIComponent(storeId)}/products`;
      const method = isEditing ? "PATCH" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || (Array.isArray(data.errors) ? data.errors.join("; ") : "Failed to save product."));
      }

      onSaved(data.product, !isEditing);
    } catch (err) {
      setError(err.message);
      setSaving(false);
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className="product-form-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="product-modal-title"
        onClick={(e) => e.stopPropagation()}
      >
        <button className="modal-close" onClick={onClose} aria-label="Close form">
          <i className="fa fa-xmark" />
        </button>

        <p className="eyebrow">{isEditing ? "EDIT PRODUCT" : "NEW PRODUCT"}</p>
        <h2 id="product-modal-title">
          {isEditing ? `Edit "${product.name}"` : "List New Product"}
        </h2>
        <p className="product-form-intro">
          {isEditing
            ? "Update product details, pricing, or catalog visibility."
            : "Add a new handcrafted or artisanal product to your store."}
        </p>

        {error && (
          <div className="store-profile-error" role="alert" style={{ marginBottom: 16 }}>
            <i className="fa fa-circle-exclamation" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="product-form">
          <div className="seller-fields">
            <label>
              Product Name <span style={{ color: "var(--crimson)" }}>*</span>
              <input
                type="text"
                value={form.name}
                onChange={(e) => updateField("name", e.target.value)}
                required
                minLength={2}
                maxLength={120}
                placeholder="e.g. Pure Dhaka Topi (Bhadgaunle)"
              />
            </label>

            <label>
              Category <span style={{ color: "var(--crimson)" }}>*</span>
              <select
                value={form.category}
                onChange={(e) => updateField("category", e.target.value)}
                required
              >
                {PRODUCT_CATEGORIES.map((cat) => (
                  <option value={cat} key={cat}>{cat}</option>
                ))}
              </select>
            </label>

            <label>
              Selling Price (Rs.) <span style={{ color: "var(--crimson)" }}>*</span>
              <input
                type="number"
                value={form.price}
                onChange={(e) => updateField("price", e.target.value)}
                required
                min={1}
                max={1000000}
                placeholder="e.g. 1850"
              />
            </label>

            <label>
              Original Price (Was) <span className="optional">(optional strikethrough)</span>
              <input
                type="number"
                value={form.was}
                onChange={(e) => updateField("was", e.target.value)}
                min={1}
                max={1000000}
                placeholder="e.g. 2400"
              />
            </label>

            <label>
              Brand / Artisan <span className="optional">(optional)</span>
              <input
                type="text"
                value={form.brand}
                onChange={(e) => updateField("brand", e.target.value)}
                maxLength={60}
                placeholder="e.g. Bhaktapur Handloom"
              />
            </label>

            <label>
              Visibility Status
              <select
                value={form.status}
                onChange={(e) => updateField("status", e.target.value)}
              >
                <option value="active">Active (Visible in Store)</option>
                <option value="inactive">Inactive (Hidden Draft)</option>
              </select>
            </label>

            <label>
              Card Color Accent (Theme)
              <select
                value={form.gradient}
                onChange={(e) => updateField("gradient", e.target.value)}
              >
                {GRADIENT_OPTIONS.map((opt) => (
                  <option value={opt.value} key={opt.value}>{opt.label}</option>
                ))}
              </select>
            </label>

            <label>
              Image URL <span className="optional">(optional)</span>
              <input
                type="url"
                value={form.image}
                onChange={(e) => updateField("image", e.target.value)}
                placeholder="e.g. https://images.unsplash.com/..."
              />
            </label>

            <label>
              Badge Label <span className="optional">(optional)</span>
              <input
                type="text"
                value={form.badge}
                onChange={(e) => updateField("badge", e.target.value)}
                maxLength={30}
                placeholder="e.g. Handmade, Hot, 20% Off"
              />
            </label>

            <label>
              Badge Color Style
              <select
                value={form.badgeType}
                onChange={(e) => updateField("badgeType", e.target.value)}
                disabled={!form.badge.trim()}
              >
                <option value="new">Green (New / Fresh)</option>
                <option value="sale">Red (Sale / Discount)</option>
                <option value="hot">Orange (Hot / Trending)</option>
                <option value="best">Gold (Best Seller)</option>
              </select>
            </label>
          </div>

          <label>
            Keywords / Search Tags <span className="optional">(comma separated)</span>
            <input
              type="text"
              value={form.keywords}
              onChange={(e) => updateField("keywords", e.target.value)}
              placeholder="e.g. dhaka, topi, traditional, handloom, bhaktapur"
            />
          </label>

          <label>
            Product Description <span className="optional">(optional)</span>
            <textarea
              rows={3}
              value={form.description}
              onChange={(e) => updateField("description", e.target.value)}
              maxLength={1000}
              placeholder="Describe material, weave, authenticity, sizing guidelines, or craft origin..."
            />
          </label>

          <div className="store-profile-actions">
            <button type="button" className="store-profile-back" onClick={onClose}>
              Cancel
            </button>
            <button
              type="submit"
              className="checkout-btn"
              style={{ width: "auto", minWidth: "160px", padding: "0 24px" }}
              disabled={saving}
            >
              {saving ? "Saving..." : isEditing ? "Update Product" : "Create Product"}{" "}
              <i className={`fa ${saving ? "fa-spinner fa-spin" : isEditing ? "fa-check" : "fa-plus"}`} />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function DashboardCard({ icon, label, value, detail, tone = "" }) {
  return <article className={`dashboard-card ${tone}`}><i className={`fa ${icon}`} /><span>{label}</span><strong>{value}</strong><small>{detail}</small></article>;
}

function SellerInventory({ sellerId, store, onBack, onInventoryCountChange }) {
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [updatingId, setUpdatingId] = useState(null);
  const [editQuantity, setEditQuantity] = useState({});

  const loadInventory = useCallback(async () => {
    if (!sellerId) return;
    setLoading(true);
    setError("");
    try {
      const response = await fetch(`${API}/sellers/${encodeURIComponent(sellerId)}/inventory`);
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Failed to load inventory.");
      const items = Array.isArray(data.inventory) ? data.inventory : [];
      setInventory(items);
      if (onInventoryCountChange) onInventoryCountChange(items.length);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [sellerId, onInventoryCountChange]);

  useEffect(() => {
    loadInventory();
  }, [loadInventory]);

  const handleUpdateQuantity = async (invItem) => {
    const newQty = editQuantity[invItem.id];
    if (newQty === undefined || newQty === null || newQty === "") {
      setError("Please enter a valid quantity.");
      return;
    }

    const qty = Number(newQty);
    if (isNaN(qty) || !Number.isInteger(qty) || qty < 0 || qty > 1000000) {
      setError("Quantity must be an integer between 0 and 1,000,000.");
      return;
    }

    setUpdatingId(invItem.id);
    setError("");
    setSuccess("");

    try {
      const response = await fetch(`${API}/products/${encodeURIComponent(invItem.productId)}/inventory`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ quantity: qty })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Failed to update inventory.");

      setInventory((current) =>
        current.map((item) =>
          item.id === invItem.id ? { ...item, ...data.inventory } : item
        )
      );
      setSuccess(`Inventory for "${invItem.product?.name || 'product'}" updated successfully.`);
      setTimeout(() => setSuccess(""), 4000);
      setEditQuantity((prev) => {
        const next = { ...prev };
        delete next[invItem.id];
        return next;
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setUpdatingId(null);
    }
  };

  const getInventoryStatus = (availableQty) => {
    if (availableQty === 0) return { label: "OUT OF STOCK", tone: "out-of-stock" };
    if (availableQty <= 5) return { label: "LOW STOCK", tone: "low-stock" };
    return { label: "IN STOCK", tone: "in-stock" };
  };

  return (
    <div className="seller-products-view">
      <div className="seller-products-header">
        <div className="seller-products-title-wrap">
          <button className="store-profile-back" onClick={onBack}>
            <i className="fa fa-arrow-left" /> Back to Dashboard
          </button>
          <div>
            <h3>Inventory Management</h3>
            <p className="seller-products-subtitle">Track and update stock quantities</p>
          </div>
        </div>
      </div>

      {error && (
        <div className="store-profile-error" role="alert">
          <i className="fa fa-circle-exclamation" />
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div className="store-profile-success" role="status">
          <i className="fa fa-circle-check" />
          <span>{success}</span>
        </div>
      )}

      {loading ? (
        <div className="seller-products-state">
          <i className="fa fa-spinner fa-spin" />
          <strong>Loading inventory...</strong>
        </div>
      ) : !inventory.length ? (
        <div className="seller-products-state">
          <i className="fa fa-layer-group" />
          <strong>No inventory found</strong>
          <span>Add products to your store to begin tracking inventory.</span>
        </div>
      ) : (
        <div className="inventory-table-wrap">
          <table className="inventory-table">
            <thead>
              <tr>
                <th>Product</th>
                <th>Category</th>
                <th>Price</th>
                <th>Quantity</th>
                <th>Reserved</th>
                <th>Available</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {inventory.map((item) => {
                const product = item.product || {};
                const status = getInventoryStatus(item.availableQuantity);
                const isEditing = editQuantity[item.id] !== undefined;
                const currentQty = isEditing ? editQuantity[item.id] : item.quantity;

                return (
                  <tr key={item.id}>
                    <td className="inventory-product-cell">
                      {product.image ? (
                        <img src={product.image} alt="" className="inventory-product-img" />
                      ) : (
                        <span className="inventory-product-emoji">{product.emoji || "📦"}</span>
                      )}
                      <div className="inventory-product-info">
                        <strong>{product.name || "Unknown Product"}</strong>
                        <small>{product.brand || "—"}</small>
                      </div>
                    </td>
                    <td>{product.category || "—"}</td>
                    <td className="inventory-price">{money(product.price || 0)}</td>
                    <td>
                      <input
                        type="number"
                        className="inventory-qty-input"
                        value={currentQty}
                        onChange={(e) =>
                          setEditQuantity((prev) => ({ ...prev, [item.id]: e.target.value }))
                        }
                        min={0}
                        max={1000000}
                        disabled={updatingId === item.id}
                      />
                    </td>
                    <td>{item.reservedQuantity || 0}</td>
                    <td className="inventory-available">{item.availableQuantity}</td>
                    <td>
                      <span className={`inventory-status ${status.tone}`}>{status.label}</span>
                    </td>
                    <td>
                      <button
                        className="inventory-update-btn"
                        onClick={() => handleUpdateQuantity(item)}
                        disabled={updatingId === item.id || !isEditing}
                      >
                        {updatingId === item.id ? (
                          <>
                            <i className="fa fa-spinner fa-spin" /> Updating...
                          </>
                        ) : (
                          <>
                            <i className="fa fa-check" /> Update
                          </>
                        )}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function SellerOrders({ sellerId, store, onBack, onOrderCountChange }) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [updatingOrderId, setUpdatingOrderId] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState({});
  const [filterStatus, setFilterStatus] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const loadOrders = useCallback(async () => {
    if (!sellerId) return;
    setLoading(true);
    setError("");
    try {
      const response = await fetch(`${API}/sellers/${encodeURIComponent(sellerId)}/orders`);
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Unable to load orders.");
      const items = Array.isArray(data.orders) ? data.orders : [];
      setOrders(items);
      if (onOrderCountChange) onOrderCountChange(items.length);
    } catch (err) {
      setError(err.message || "Unable to load orders.");
    } finally {
      setLoading(false);
    }
  }, [sellerId, onOrderCountChange]);

  useEffect(() => {
    loadOrders();
  }, [loadOrders]);

  const handleUpdateStatus = async (orderId) => {
    const order = orders.find((o) => o.id === orderId);
    if (!order) return;

    const newStatus = selectedStatus[orderId] || order.status;
    if (!newStatus) {
      setError("Please select a status.");
      return;
    }

    setUpdatingOrderId(orderId);
    setError("");
    setSuccess("");

    try {
      const response = await fetch(
        `${API}/sellers/${encodeURIComponent(sellerId)}/orders/${encodeURIComponent(orderId)}/status`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: newStatus })
        }
      );
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Unable to update order status.");
      }

      setOrders((current) =>
        current.map((item) => (item.id === orderId ? data.order : item))
      );
      setSuccess("Order status updated successfully.");
      setTimeout(() => setSuccess(""), 4000);
      setSelectedStatus((prev) => {
        const next = { ...prev };
        delete next[orderId];
        return next;
      });
    } catch (err) {
      setError(err.message || "Unable to update order status.");
    } finally {
      setUpdatingOrderId(null);
    }
  };

  const getStatusBadge = (statusStr) => {
    const s = String(statusStr || "confirmed").toLowerCase();
    const toneMap = {
      placed: "status-placed",
      confirmed: "status-confirmed",
      processing: "status-processing",
      shipped: "status-shipped",
      delivered: "status-delivered",
      cancelled: "status-cancelled"
    };
    return {
      label: s.toUpperCase(),
      tone: toneMap[s] || "status-confirmed"
    };
  };

  const filteredOrders = orders.filter((order) => {
    if (filterStatus !== "all" && String(order.status).toLowerCase() !== filterStatus.toLowerCase()) {
      return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchId = (order.id || "").toLowerCase().includes(q) || (order.orderId || "").toLowerCase().includes(q);
      const matchName = (order.customer?.name || "").toLowerCase().includes(q);
      const matchPhone = (order.customer?.phone || "").toLowerCase().includes(q);
      const matchCity = (order.customer?.city || "").toLowerCase().includes(q);
      const matchItems = Array.isArray(order.items) && order.items.some((it) => (it.name || "").toLowerCase().includes(q));
      if (!matchId && !matchName && !matchPhone && !matchCity && !matchItems) return false;
    }
    return true;
  });

  return (
    <div className="seller-products-view">
      <div className="seller-products-header">
        <div className="seller-products-title-wrap">
          <button className="store-profile-back" onClick={onBack}>
            <i className="fa fa-arrow-left" /> Back to Dashboard
          </button>
          <div>
            <h3>Order Management</h3>
            <p className="seller-products-subtitle">Track, fulfill, and update customer orders</p>
          </div>
        </div>
      </div>

      {error && (
        <div className="store-profile-error" role="alert">
          <i className="fa fa-circle-exclamation" />
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div className="store-profile-success" role="status">
          <i className="fa fa-circle-check" />
          <span>{success}</span>
        </div>
      )}

      {/* Filter / Search Bar */}
      <div className="seller-filter-bar">
        <div className="seller-search-box">
          <i className="fa fa-search" />
          <input
            type="text"
            placeholder="Search by Order ID, customer, phone, or item..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button
              className="seller-search-clear"
              onClick={() => setSearchQuery("")}
              aria-label="Clear search"
            >
              <i className="fa fa-xmark" />
            </button>
          )}
        </div>

        <div className="seller-filter-selects">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            aria-label="Filter by order status"
          >
            <option value="all">All Statuses ({orders.length})</option>
            <option value="placed">Placed</option>
            <option value="confirmed">Confirmed</option>
            <option value="processing">Processing</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="seller-products-state">
          <i className="fa fa-spinner fa-spin" />
          <strong>Loading orders...</strong>
        </div>
      ) : !orders.length ? (
        <div className="seller-products-state">
          <i className="fa fa-receipt" />
          <strong>No orders found</strong>
          <span>Orders containing your products will appear here.</span>
        </div>
      ) : !filteredOrders.length ? (
        <div className="seller-products-state">
          <i className="fa fa-filter" />
          <strong>No matching orders</strong>
          <span>Try adjusting your search query or status filter.</span>
        </div>
      ) : (
        <div className="seller-orders-list">
          {filteredOrders.map((order) => {
            const badge = getStatusBadge(order.status);
            const currentSelected = selectedStatus[order.id] || order.status;
            const isUpdating = updatingOrderId === order.id;

            return (
              <div className="seller-order-card" key={order.id}>
                <div className="seller-order-card-header">
                  <div className="seller-order-header-info">
                    <h4 className="seller-order-id">
                      Order #{order.id}
                    </h4>
                    <span className="seller-order-date">
                      <i className="fa fa-clock" />{" "}
                      {new Date(order.createdAt).toLocaleDateString("en-NP", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit"
                      })}
                    </span>
                  </div>
                  <span className={`order-status-badge ${badge.tone}`}>
                    {badge.label}
                  </span>
                </div>

                <div className="seller-order-details-grid">
                  <div className="seller-order-customer-box">
                    <h5><i className="fa fa-user" /> Customer & Delivery</h5>
                    <div className="seller-order-customer-data">
                      <strong>{order.customer?.name || "Customer"}</strong>
                      {order.customer?.phone && (
                        <span><i className="fa fa-phone" /> {order.customer.phone}</span>
                      )}
                      {order.customer?.email && (
                        <span><i className="fa fa-envelope" /> {order.customer.email}</span>
                      )}
                      {order.customer?.address && (
                        <span className="seller-order-address">
                          <i className="fa fa-location-dot" /> {order.customer.address}, {order.customer.city || ""} {order.customer.postalCode || ""}
                        </span>
                      )}
                      <span className="seller-order-payment">
                        <i className="fa fa-credit-card" /> {order.paymentMethod || "Cash on Delivery"}
                      </span>
                    </div>
                  </div>

                  <div className="seller-order-items-box">
                    <h5><i className="fa fa-box-open" /> Your Order Items</h5>
                    <div className="seller-order-items-table-wrap">
                      <table className="seller-order-items-table">
                        <thead>
                          <tr>
                            <th>Item</th>
                            <th>Price</th>
                            <th>Qty</th>
                            <th style={{ textAlign: "right" }}>Total</th>
                          </tr>
                        </thead>
                        <tbody>
                          {(order.items || []).map((item, idx) => (
                            <tr key={item.productId ? `${item.productId}-${idx}` : idx}>
                              <td>
                                <strong>{item.name}</strong>
                              </td>
                              <td>{money(item.price)}</td>
                              <td>x{item.quantity}</td>
                              <td style={{ textAlign: "right", fontWeight: 600 }}>
                                {money(item.price * item.quantity)}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>

                <div className="seller-order-card-footer">
                  <div className="seller-order-subtotal">
                    <span>Seller Subtotal:</span>
                    <strong>{money(order.subtotal)}</strong>
                  </div>

                  <div className="seller-order-status-actions">
                    <label htmlFor={`status-select-${order.id}`} className="seller-order-status-label">
                      Update Status:
                    </label>
                    <select
                      id={`status-select-${order.id}`}
                      className="seller-order-status-select"
                      value={currentSelected.toLowerCase()}
                      onChange={(e) =>
                        setSelectedStatus((prev) => ({
                          ...prev,
                          [order.id]: e.target.value
                        }))
                      }
                      disabled={isUpdating || order.status === "delivered" || order.status === "cancelled"}
                    >
                      <option value="placed">PLACED</option>
                      <option value="confirmed">CONFIRMED</option>
                      <option value="processing">PROCESSING</option>
                      <option value="shipped">SHIPPED</option>
                      <option value="delivered">DELIVERED</option>
                      <option value="cancelled">CANCELLED</option>
                    </select>
                    <button
                      type="button"
                      className="order-update-btn"
                      onClick={() => handleUpdateStatus(order.id)}
                      disabled={
                        isUpdating ||
                        currentSelected.toLowerCase() === (order.status || "").toLowerCase() ||
                        order.status === "delivered" ||
                        order.status === "cancelled"
                      }
                    >
                      {isUpdating ? (
                        <>
                          <i className="fa fa-spinner fa-spin" /> Updating...
                        </>
                      ) : (
                        <>
                          <i className="fa fa-check" /> Update Status
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function CartDrawer({ cart, subtotal, onClose, onChange, onCheckout }) {
  return (
    <div className="drawer-backdrop" onClick={onClose}>
      <aside
        className="cart-drawer"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="drawer-head">
          <h2>Your Bag</h2>
          <button onClick={onClose} aria-label="Close bag">
            <i className="fa fa-xmark" />
          </button>
        </div>
        {cart.length ? (
          <>
            <div className="cart-items">
              {cart.map((item) => (
                <div className="cart-item" key={item.id}>
                  {item.image ? (
                    <img src={item.image} alt="" className="cart-image" />
                  ) : (
                    <span className="cart-emoji">{item.emoji}</span>
                  )}
                  <div className="cart-item-info">
                    <strong>{item.name}</strong>
                    {item.storeName ? (
                      <span className="cart-store-tag">
                        <i className="fa fa-store" /> {item.storeName}
                      </span>
                    ) : null}
                    <small>{money(item.price)} each</small>
                    <div className="quantity">
                      <button
                        onClick={() => onChange(item.id, -1)}
                        aria-label={`Decrease ${item.name} quantity`}
                      >
                        -
                      </button>
                      <span>{item.quantity}</span>
                      <button
                        onClick={() => onChange(item.id, 1)}
                        aria-label={`Increase ${item.name} quantity`}
                      >
                        +
                      </button>
                    </div>
                  </div>
                  <strong className="item-subtotal">
                    {money(item.price * item.quantity)}
                  </strong>
                </div>
              ))}
            </div>
            <div className="drawer-total">
              <span>Cart subtotal</span>
              <strong>{money(subtotal)}</strong>
            </div>
            <button className="checkout-btn" onClick={onCheckout}>
              Checkout <i className="fa fa-arrow-right" />
            </button>
          </>
        ) : (
          <div className="empty-cart">
            <i className="fa fa-bag-shopping" />
            <p>Your bag is waiting for something beautiful.</p>
          </div>
        )}
      </aside>
    </div>
  );
}
function Checkout({ cart, subtotal, onClose, onSuccess }) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    postalCode: "",
    paymentMethod: "Cash on Delivery",
    promoCode: "",
  });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const delivery = subtotal >= 1500 ? 0 : 100;
  const discount =
    form.promoCode.trim().toUpperCase() === "VASTAAR20"
      ? Math.round(subtotal * 0.2)
      : 0;
  const total = subtotal + delivery - discount;
  const update = (field, value) =>
    setForm((current) => ({ ...current, [field]: value }));
  const submit = async (event) => {
    event.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      const response = await fetch(`${API}/orders`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customer: {
            name: form.name,
            email: form.email,
            phone: form.phone,
            address: form.address,
            city: form.city,
            postalCode: form.postalCode,
          },
          paymentMethod: form.paymentMethod,
          promoCode: form.promoCode,
          items: cart.map(({ id, name, price, quantity, sellerId, storeId }) => ({
            id,
            productId: id,
            name,
            price,
            quantity,
            sellerId,
            storeId
          })),
        }),
      });
      const body = await response.json();
      if (!response.ok) throw new Error(body.message);
      onSuccess(body.order);
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };
  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className="checkout-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="checkout-title"
        onClick={(event) => event.stopPropagation()}
      >
        <button
          className="modal-close"
          onClick={onClose}
          aria-label="Close checkout"
        >
          <i className="fa fa-xmark" />
        </button>
        <p className="eyebrow">SECURE CHECKOUT</p>
        <h2 id="checkout-title">Complete your order</h2>
        <div className="order-summary">
          <div>
            <span>Subtotal</span>
            <strong>{money(subtotal)}</strong>
          </div>
          <div>
            <span>Delivery</span>
            <strong>{delivery ? money(delivery) : "FREE"}</strong>
          </div>
          <div>
            <span>Discount</span>
            <strong>-{money(discount)}</strong>
          </div>
          <div className="summary-total">
            <span>Total</span>
            <strong>{money(total)}</strong>
          </div>
        </div>
        <form onSubmit={submit}>
          <div className="checkout-fields">
            <label>
              Name
              <input
                value={form.name}
                onChange={(event) => update("name", event.target.value)}
                required
              />
            </label>
            <label>
              Email
              <input
                type="email"
                value={form.email}
                onChange={(event) => update("email", event.target.value)}
                required
              />
            </label>
            <label>
              Phone
              <input
                type="tel"
                inputMode="tel"
                minLength={7}
                maxLength={20}
                value={form.phone}
                onChange={(event) => update("phone", event.target.value)}
                required
              />
            </label>
            <label>
              City
              <input
                value={form.city}
                onChange={(event) => update("city", event.target.value)}
                required
              />
            </label>
            <label>
              Postal code
              <input
                inputMode="numeric"
                pattern="[0-9]{4,10}"
                value={form.postalCode}
                onChange={(event) => update("postalCode", event.target.value)}
                required
              />
            </label>
            <label>
              Payment method
              <select
                value={form.paymentMethod}
                onChange={(event) =>
                  update("paymentMethod", event.target.value)
                }
              >
                <option>Cash on Delivery</option>
                <option>eSewa</option>
                <option>Khalti</option>
              </select>
            </label>
          </div>
          <label>
            Delivery address
            <textarea
              value={form.address}
              onChange={(event) => update("address", event.target.value)}
              rows="3"
              required
            />
          </label>
          <label>
            Promo code
            <input
              value={form.promoCode}
              onChange={(event) => update("promoCode", event.target.value)}
              placeholder="VASTAAR20"
            />
          </label>
          {error && <p className="form-error">{error}</p>}
          <button className="checkout-btn" type="submit" disabled={submitting}>
            {submitting ? "Processing..." : "Place order"} <i className={`fa ${submitting ? "fa-spinner fa-spin" : "fa-check"}`} />
          </button>
        </form>
      </div>
    </div>
  );
}

function OrderSuccess({ order, onContinue }) {
  return (
    <div className="modal-backdrop">
      <div className="checkout-modal success-modal" role="dialog" aria-modal="true">
        <div className="success-icon"><i className="fa fa-check" /></div>
        <p className="eyebrow">ORDER CONFIRMED</p>
        <h2>Thank you for shopping with VASTAAR</h2>
        <p className="success-copy">Your order has been placed successfully. We will send delivery updates to your email.</p>
        <div className="success-details">
          <span>Order number</span><strong>{order.id}</strong>
          <span>Final amount</span><strong>{money(order.summary?.total || 0)}</strong>
        </div>
        <button className="checkout-btn" onClick={onContinue}>Continue shopping <i className="fa fa-arrow-right" /></button>
      </div>
    </div>
  );
}

export default App;
