import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Link, useParams, useNavigate } from "react-router-dom";

// SketchShop Full App: Multi-page Next.js-style layout for React Router
// Features:
// - Artist profiles
// - Shipping options during checkout
// - Inventory management demo
// - Stripe checkout placeholder for production use
// Tailwind CSS required

export default function SketchShopApp() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50 font-sans">
        <Header />
        <main className="max-w-6xl mx-auto p-6 md:p-12">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/art/:id" element={<ProductDetail />} />
            <Route path="/artist/:name" element={<ArtistProfile />} />
            <Route path="/checkout" element={<CheckoutPage />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

// ------------------------------
// Data Section
// ------------------------------
const demoProducts = [
  {
    id: "sk-001",
    title: "Whispering Pines — Pencil Sketch",
    artist: "A. Verma",
    price: 35.0,
    description: "Hand-drawn graphite sketch of a pine tree landscape.",
    dims: "11 x 14 in",
    image: "https://picsum.photos/seed/sk1/800/600?grayscale",
    available: 5,
    tags: ["landscape", "pencil"],
  },
  {
    id: "sk-002",
    title: "Urban Lines — Ink Sketch",
    artist: "R. Kapoor",
    price: 45.0,
    description: "High-contrast ink sketch of an alley and lamp posts.",
    dims: "12 x 16 in",
    image: "https://picsum.photos/seed/sk2/800/600?grayscale",
    available: 3,
    tags: ["urban", "ink"],
  },
  {
    id: "sk-003",
    title: "Portrait of a Doubter — Charcoal",
    artist: "M. Iyer",
    price: 75.0,
    description: "Charcoal portrait on toned paper.",
    dims: "9 x 12 in",
    image: "https://picsum.photos/seed/sk3/800/600?grayscale",
    available: 2,
    tags: ["portrait", "charcoal"],
  },
];

const artists = {
  "A. Verma": {
    name: "A. Verma",
    bio: "Aditi Verma is a fine-arts graduate specializing in nature sketches.",
    avatar: "https://i.pravatar.cc/150?img=3",
    social: { instagram: "https://instagram.com/aditi.verma.art" },
  },
  "R. Kapoor": {
    name: "R. Kapoor",
    bio: "Rohan Kapoor's ink sketches explore city life and light.",
    avatar: "https://i.pravatar.cc/150?img=4",
    social: { instagram: "https://instagram.com/rohan.kapoor.sketches" },
  },
  "M. Iyer": {
    name: "M. Iyer",
    bio: "Meera Iyer works with charcoal and mixed media for expressive portraits.",
    avatar: "https://i.pravatar.cc/150?img=5",
    social: { instagram: "https://instagram.com/meera.iyer.charcoal" },
  },
};

// ------------------------------
// Header & Footer
// ------------------------------
function Header() {
  const [cart, setCart] = useState(() => JSON.parse(localStorage.getItem("cart") || "[]"));
  useEffect(() => localStorage.setItem("cart", JSON.stringify(cart)), [cart]);
  const totalItems = cart.reduce((sum, i) => sum + i.qty, 0);
  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-6xl mx-auto flex items-center justify-between p-4">
        <Link to="/" className="text-2xl font-bold tracking-tight">SketchShop</Link>
        <nav className="flex gap-6 text-sm">
          <Link to="/" className="hover:text-gray-700">Home</Link>
          <Link to="/checkout" className="hover:text-gray-700">Checkout ({totalItems})</Link>
        </nav>
      </div>
    </header>
  );
}

function Footer() {
  return (
    <footer className="text-center py-8 text-sm text-gray-500 border-t mt-12">
      &copy; {new Date().getFullYear()} SketchShop — curated sketch art. Built with ❤️.
    </footer>
  );
}

// ------------------------------
// Home Page
// ------------------------------
function Home() {
  const [query, setQuery] = useState("");
  const [filterTag, setFilterTag] = useState("all");
  const products = demoProducts.filter((p) => {
    const qMatch = (p.title + p.description + p.artist).toLowerCase().includes(query.toLowerCase());
    const tagMatch = filterTag === "all" || p.tags.includes(filterTag);
    return qMatch && tagMatch;
  });
  const tags = Array.from(new Set(demoProducts.flatMap((p) => p.tags)));
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
      <aside className="md:col-span-1 bg-white p-5 rounded-2xl shadow-sm">
        <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search sketches" className="w-full border rounded-md px-3 py-2 mb-3" />
        <div className="space-y-2">
          <button onClick={() => setFilterTag("all")} className={`block w-full text-left px-3 py-1 rounded ${filterTag === "all" ? "bg-gray-900 text-white" : "bg-gray-100"}`}>All</button>
          {tags.map((t) => (
            <button key={t} onClick={() => setFilterTag(t)} className={`block w-full text-left px-3 py-1 rounded ${filterTag === t ? "bg-gray-900 text-white" : "bg-gray-100"}`}>{t}</button>
          ))}
        </div>
      </aside>
      <section className="md:col-span-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((p) => (
          <Link key={p.id} to={`/art/${p.id}`} className="bg-white rounded-2xl shadow-sm overflow-hidden hover:shadow-md transition">
            <img src={p.image} alt={p.title} className="w-full aspect-[4/3] object-cover" />
            <div className="p-4">
              <h3 className="font-semibold">{p.title}</h3>
              <p className="text-xs text-gray-500">by {p.artist}</p>
              <p className="text-lg font-bold mt-2">₹{Math.round(p.price * 83)}</p>
            </div>
          </Link>
        ))}
      </section>
    </div>
  );
}

// ------------------------------
// Product Detail Page
// ------------------------------
function ProductDetail() {
  const { id } = useParams();
  const product = demoProducts.find((p) => p.id === id);
  const navigate = useNavigate();
  const [cart, setCart] = useState(() => JSON.parse(localStorage.getItem("cart") || "[]"));
  useEffect(() => localStorage.setItem("cart", JSON.stringify(cart)), [cart]);

  if (!product) return <div>Product not found</div>;

  function addToCart() {
    setCart((prev) => {
      const existing = prev.find((p) => p.id === product.id);
      if (existing) return prev.map((p) => p.id === product.id ? { ...p, qty: p.qty + 1 } : p);
      return [...prev, { id: product.id, title: product.title, price: product.price, qty: 1 }];
    });
    navigate("/checkout");
  }

  const artist = artists[product.artist];

  return (
    <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
      <div className="grid grid-cols-1 md:grid-cols-2">
        <div className="bg-gray-100">
          <img src={product.image} alt={product.title} className="w-full h-96 object-contain" />
        </div>
        <div className="p-6">
          <h1 className="text-3xl font-bold">{product.title}</h1>
          <Link to={`/artist/${product.artist}`} className="text-gray-600 text-sm">by {product.artist}</Link>
          <p className="mt-4 text-gray-700">{product.description}</p>
          <p className="text-lg font-semibold mt-4">₹{Math.round(product.price * 83)}</p>
          <button onClick={addToCart} className="mt-4 bg-gray-900 text-white px-4 py-2 rounded-lg">Add to Cart</button>
        </div>
      </div>
      {artist && (
        <div className="p-6 border-t bg-gray-50">
          <h3 className="text-sm font-semibold mb-2">About the Artist</h3>
          <div className="flex items-center gap-4">
            <img src={artist.avatar} alt={artist.name} className="w-12 h-12 rounded-full" />
            <div>
              <div className="font-medium">{artist.name}</div>
              <div className="text-xs text-gray-600">{artist.bio}</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ------------------------------
// Artist Profile Page
// ------------------------------
function ArtistProfile() {
  const { name } = useParams();
  const artist = artists[name];
  if (!artist) return <div>Artist not found</div>;
  const works = demoProducts.filter((p) => p.artist === name);
  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-2xl shadow-sm flex items-center gap-6">
        <img src={artist.avatar} alt={artist.name} className="w-24 h-24 rounded-full" />
        <div>
          <h1 className="text-2xl font-bold">{artist.name}</h1>
          <p className="text-gray-600 text-sm">{artist.bio}</p>
          {artist.social?.instagram && <a href={artist.social.instagram} target="_blank" rel="noreferrer" className="text-blue-600 text-sm mt-2 block">Instagram</a>}
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {works.map((w) => (
          <Link key={w.id} to={`/art/${w.id}`} className="bg-white rounded-2xl shadow-sm overflow-hidden">
            <img src={w.image} alt={w.title} className="w-full aspect-[4/3] object-cover" />
            <div className="p-4">
              <h3 className="font-semibold">{w.title}</h3>
              <p className="text-xs text-gray-500">₹{Math.round(w.price * 83)}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

// ------------------------------
// Checkout Page with Shipping & Inventory
// ------------------------------
function CheckoutPage() {
  const [cart, setCart] = useState(() => JSON.parse(localStorage.getItem("cart") || "[]"));
  const [shipping, setShipping] = useState("standard");
  const [status, setStatus] = useState(null);
  const navigate = useNavigate();
  const subtotal = cart.reduce((s, i) => s + i.price * i.qty, 0);

  const shippingCost = shipping === "express" ? 10 : 5;
  const total = subtotal + shippingCost;

  async function handleCheckout() {
    setStatus("processing");
    await new Promise((r) => setTimeout(r, 1500));
    setStatus("success");
    setCart([]);
    localStorage.removeItem("cart");
  }

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm">
      <h2 className="text-2xl font-bold mb-4">Checkout</h2>
      {cart.length === 0 ? (
        <div className="text-gray-600 text-center py-12">Your cart is empty. <button onClick={() => navigate('/')} className="text-blue-600 underline">Shop now</button></div>
      ) : (
        <div className="space-y-6">
          {cart.map((item) => (
            <div key={item.id} className="flex items-center justify-between border-b pb-2">
              <div>
                <div className="font-medium">{item.title}</div>
                <div className="text-xs text-gray-500">Qty: {item.qty}</div>
              </div>
              <div>₹{Math.round(item.price * 83 * item.qty)}</div>
            </div>
          ))}

          <div className="pt-4 border-t">
            <label className="block mb-2 text-sm">Shipping Options</label>
            <select value={shipping} onChange={(e) => setShipping(e.target.value)} className="border rounded-md px-3 py-2">
              <option value="standard">Standard (₹{5 * 83})</option>
              <option value="express">Express (₹{10 * 83})</option>
            </select>
          </div>

          <div className="pt-4 border-t flex justify-between">
            <div>Subtotal</div>
            <div>₹{Math.round(subtotal * 83)}</div>
          </div>
          <div className="flex justify-between">
            <div>Shipping</div>
            <div>₹{Math.round(shippingCost * 83)}</div>
          </div>
          <div className="font-bold flex justify-between text-lg border-t pt-2">
            <div>Total</div>
            <div>₹{Math.round(total * 83)}</div>
          </div>

          <button onClick={handleCheckout} className="w-full bg-gray-900 text-white px-4 py-2 rounded-lg">
            {status === "processing" ? "Processing Payment..." : "Pay with Stripe (Demo)"}
          </button>
          {status === "success" && <div className="text-green-600 mt-2 text-center">Payment successful! Thank you for your purchase.</div>}
        </div>
      )}
    </div>
  );
}
