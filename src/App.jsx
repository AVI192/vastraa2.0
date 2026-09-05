import { useEffect, useMemo, useState } from "react";

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
  const visibleProducts = useMemo(() => products, [products]);

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
          subtitle="Handpicked styles for you"
          action="View All"
          onAction={() => {
            setActiveCategory("");
            loadProducts("", "");
          }}
        />
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
      {toast && (
        <div className="toast show">
          <i className="fa fa-check-circle" /> {toast}
        </div>
      )}
    </>
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
}) {
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
function ProductCard({ product, wished, onWish, onAdd }) {
  const discount = Math.round((1 - product.price / product.was) * 100);
  return (
    <article className="prod-card">
      <div className={`prod-img gradient-${product.gradient}`}>
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
        <span className={`prod-badge badge-${product.badgeType}`}>
          {product.badge}
        </span>
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
        <div className="prod-brand">{product.brand}</div>
        <div className="prod-name">{product.name}</div>
        <div className="prod-price">
          <span className="price-now">{money(product.price)}</span>
          <span className="price-was">{money(product.was)}</span>
          <span className="price-off">{discount}% off</span>
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
              ) : (
                <>
                  <div className="dashboard-welcome"><span>Welcome, {dashboard.seller.name}</span><small>{dashboard.store?.name || "Store not created"}</small></div>
                  <div className="dashboard-grid">
                    <DashboardCard icon="fa-shield-halved" label="Verification" value={statusLabel} tone={status} detail={status === "rejected" ? dashboard.seller.verification?.rejectionReason : status === "pending" ? "Your application is under review." : "Seller verification complete."} />
                    <DashboardCard icon="fa-box" label="Products" value={dashboard.stats.products} detail="Available in later phase" />
                    <DashboardCard icon="fa-layer-group" label="Inventory" value={dashboard.stats.inventory || "Coming soon"} detail="Inventory management is not active yet." />
                    <DashboardCard icon="fa-receipt" label="Orders" value={dashboard.stats.orders} detail="Seller orders arrive in a later phase." />
                    <DashboardCard icon="fa-store" label="Store status" value={dashboard.store?.status || "Not available"} detail={dashboard.store?.city || "Store profile coming soon."} />
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
                      <button disabled>Add Product <small>Next phase</small></button>
                      <button disabled>Manage Inventory <small>Next phase</small></button>
                      <button disabled>View Orders <small>Next phase</small></button>
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
    city: initialStore?.city || "",
    district: initialStore?.district || "",
    address: initialStore?.address || "",
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
        city: body.store.city || "",
        district: body.store.district || "",
        address: body.store.address || "",
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
        city: form.city.trim(),
        district: form.district.trim(),
        address: form.address.trim(),
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
        city: body.store.city || "",
        district: body.store.district || "",
        address: body.store.address || "",
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

function DashboardCard({ icon, label, value, detail, tone = "" }) {
  return <article className={`dashboard-card ${tone}`}><i className={`fa ${icon}`} /><span>{label}</span><strong>{value}</strong><small>{detail}</small></article>;
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
          items: cart.map(({ id, name, price, quantity }) => ({
            id,
            name,
            price,
            quantity,
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
