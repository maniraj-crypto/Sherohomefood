import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

const WHATSAPP_NUMBER = "919XXXXXXXXX"; // Replace with your number

export default function EventCateringPage() {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    pincode: "",
    event_date: "",
    guest_count: "",
    event_details: "",
  });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [utmParams, setUtmParams] = useState<Record<string, string>>({});

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setUtmParams({
      utm_source: params.get("utm_source") || "",
      utm_medium: params.get("utm_medium") || "",
      utm_campaign: params.get("utm_campaign") || "",
      utm_content: params.get("utm_content") || "",
      utm_term: params.get("utm_term") || "",
    });
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const sendEmailNotification = async (leadData: typeof form) => {
    try {
      await fetch("https://api.emailjs.com/api/v1.0/email/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          service_id: import.meta.env.VITE_EMAILJS_SERVICE_ID,
          template_id: import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
          user_id: import.meta.env.VITE_EMAILJS_PUBLIC_KEY,
          template_params: {
            lead_name: leadData.name,
            lead_phone: "+91" + leadData.phone,
            lead_pincode: leadData.pincode,
            lead_event_date: leadData.event_date,
            lead_guest_count: leadData.guest_count,
            lead_event_details: leadData.event_details,
            lead_source: utmParams.utm_source || "landing_page",
            lead_campaign: utmParams.utm_campaign || "",
          },
        }),
      });
    } catch {
      // Email failure is silent — lead is already saved in DB
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const { error: dbError } = await supabase.from("leads").insert({
      name: form.name,
      phone: "+91" + form.phone,
      pincode: form.pincode,
      event_date: form.event_date,
      guest_count: form.guest_count,
      event_details: form.event_details,
      source: utmParams.utm_source || "landing_page",
      campaign: utmParams.utm_campaign || "",
      ad_medium: utmParams.utm_medium || "",
      ad_content: utmParams.utm_content || "",
      page: "event-catering",
      status: "intake",
      created_at: new Date().toISOString(),
    });

    if (!dbError) {
      await sendEmailNotification(form);
    }

    setLoading(false);

    if (dbError) {
      setError("Something went wrong. Please try again.");
    } else {
      setSubmitted(true);
    }
  };

  const services = [
    { label: "Bulk Food Delivery", img: "https://images.unsplash.com/photo-1547592180-85f173990554?w=400&q=80" },
    { label: "House Party Catering", img: "https://images.unsplash.com/photo-1528605248644-14dd04022da1?w=400&q=80" },
    { label: "Wedding Catering", img: "https://images.unsplash.com/photo-1606787366850-de6330128bfc?w=400&q=80" },
    { label: "Birthday Party Catering", img: "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=400&q=80" },
    { label: "Corporate Catering", img: "https://images.unsplash.com/photo-1555244162-803834f70033?w=400&q=80" },
    { label: "Any Other Occasion", img: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400&q=80" },
  ];

  return (
    <div className="min-h-screen bg-white font-sans">

      {/* ── HEADER ── */}
      <header className="flex items-center justify-between px-8 py-4 bg-white shadow-sm">
        <nav className="flex gap-8 text-gray-700 font-medium text-sm">
          <a href="#" className="hover:text-teal-600">Party Order</a>
          <a href="#" className="hover:text-teal-600">Subscriptions</a>
          <a href="#" className="hover:text-teal-600">Catering</a>
        </nav>
        <div className="flex items-center gap-2">
          <span className="text-3xl font-bold text-teal-600" style={{ fontFamily: "serif" }}>S</span>
          <div className="leading-tight">
            <span className="text-xl font-bold text-teal-700">hero</span>
            <div className="text-xs tracking-widest text-gray-500 uppercase">Home Fo<span className="text-red-500">o</span>d</div>
          </div>
        </div>
        <a
          href={`https://wa.me/${WHATSAPP_NUMBER}`}
          target="_blank"
          rel="noopener noreferrer"
          className="bg-red-900 text-white px-5 py-2 rounded text-sm font-semibold hover:bg-red-800 transition"
        >
          WhatsApp Us
        </a>
      </header>

      {/* ── HERO ── */}
      <section
        className="relative min-h-[500px] flex items-center"
        style={{
          background: "linear-gradient(to right, rgba(120,20,20,0.85) 45%, rgba(120,20,20,0.3) 100%)",
          backgroundImage: "url(https://images.unsplash.com/photo-1606787366850-de6330128bfc?w=1400&q=80)",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundBlendMode: "multiply",
        }}
      >
        <div className="px-12 py-16 max-w-2xl">
          <h1 className="text-5xl font-extrabold text-white leading-tight uppercase">
            Delicious Food For<br />
            <span className="relative">
              Your Next Big Gathering
              <svg className="absolute -bottom-3 left-0 w-full" viewBox="0 0 300 12" fill="none">
                <path d="M0 6 Q37 0 75 6 Q112 12 150 6 Q187 0 225 6 Q262 12 300 6" stroke="#F9A8C9" strokeWidth="3" fill="none"/>
              </svg>
            </span>
          </h1>
          <div className="mt-8 inline-block bg-pink-100 bg-opacity-80 text-pink-700 px-5 py-2 rounded-full text-sm font-medium">
            One-stop solution for all your requirements
          </div>
          <div className="mt-6 grid grid-cols-2 gap-x-12 gap-y-3 text-white font-medium text-lg">
            {["Housewarming", "Birthday Party", "Wedding", "Corporate", "Events", "Private Party"].map((item) => (
              <div key={item} className="flex items-center gap-2">
                <span className="text-green-400 font-bold">✓</span> {item}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FORM SECTION ── */}
      <section className="relative py-16 px-4 overflow-hidden" style={{ background: "#f5f5f5" }}>
        {/* Teal decorative circles */}
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-64 h-64 rounded-full opacity-20" style={{ background: "#4DB6AC", transform: "translate(-40%, -50%)" }} />
        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-64 h-64 rounded-full opacity-20" style={{ background: "#4DB6AC", transform: "translate(40%, -50%)" }} />

        {/* Sparkles */}
        <div className="absolute top-8 left-16 text-teal-400 text-3xl select-none">✦ ✦</div>
        <div className="absolute bottom-8 right-16 text-teal-400 text-3xl select-none">✦ ✦</div>

        <div className="relative max-w-xl mx-auto text-center">
          <p className="text-gray-500 text-sm mb-2">Hassle-Free Event, Delicious Food EVERY TIME!</p>
          <h2 className="text-4xl font-bold text-gray-800 mb-8">
            Get a Call Back<br />to Know More
          </h2>

          {submitted ? (
            <div className="bg-teal-50 border border-teal-300 rounded-xl p-10 text-center">
              <div className="text-5xl mb-4">🎉</div>
              <h3 className="text-2xl font-bold text-teal-700 mb-2">Thank You!</h3>
              <p className="text-gray-600">We've received your request. Our team will call you back within 24 hours.</p>
              <a
                href={`https://wa.me/${WHATSAPP_NUMBER}?text=Hi, I just filled the catering form for my event.`}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-6 inline-block bg-green-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-600 transition"
              >
                Chat on WhatsApp
              </a>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <input
                name="name"
                type="text"
                placeholder="Full Name *"
                required
                value={form.name}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 text-gray-700 bg-white focus:outline-none focus:border-teal-500"
              />

              <div className="flex border border-gray-300 rounded-lg overflow-hidden bg-white focus-within:border-teal-500">
                <div className="flex items-center gap-2 px-3 bg-white border-r border-gray-300 text-gray-600 text-sm font-medium whitespace-nowrap">
                  🇮🇳 +91
                </div>
                <input
                  name="phone"
                  type="tel"
                  placeholder="Phone Number *"
                  required
                  maxLength={10}
                  value={form.phone}
                  onChange={handleChange}
                  className="flex-1 px-4 py-3 text-gray-700 focus:outline-none"
                />
              </div>

              <input
                name="pincode"
                type="text"
                placeholder="Pin Code *"
                required
                maxLength={6}
                value={form.pincode}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 text-gray-700 bg-white focus:outline-none focus:border-teal-500"
              />

              <div className="text-left">
                <label className="block text-gray-600 text-sm mb-1 ml-1">Event Date *</label>
                <input
                  name="event_date"
                  type="date"
                  required
                  value={form.event_date}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 text-gray-700 bg-white focus:outline-none focus:border-teal-500"
                />
              </div>

              <input
                name="guest_count"
                type="number"
                placeholder="Number of Guests *"
                required
                min={1}
                value={form.guest_count}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 text-gray-700 bg-white focus:outline-none focus:border-teal-500"
              />

              <textarea
                name="event_details"
                placeholder="Mention details about your event and Write your menu choices here *"
                required
                rows={4}
                value={form.event_details}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 text-gray-700 bg-white focus:outline-none focus:border-teal-500 resize-none"
              />

              {error && <p className="text-red-500 text-sm">{error}</p>}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-lg text-white font-bold text-lg transition"
                style={{ background: loading ? "#9CA3AF" : "#2D9C8B" }}
              >
                {loading ? "Submitting..." : "Get a Call Back"}
              </button>
            </form>
          )}
        </div>
      </section>

      {/* ── SERVICES SECTION ── */}
      <section className="py-16 px-8 bg-white">
        <div className="text-center mb-10">
          <h2 className="text-4xl font-bold text-gray-800 mb-4">
            Big or Small, We Bring the Best<br />to Your Next Event
          </h2>
          <p className="text-gray-500 max-w-2xl mx-auto">
            Whether you're hosting an intimate gathering or a grand celebration, trust us to serve fresh, flavorful dishes that delight every guest.
          </p>
        </div>
        <div className="grid grid-cols-3 gap-6 max-w-5xl mx-auto">
          {services.map((service) => (
            <div key={service.label} className="text-center">
              <img
                src={service.img}
                alt={service.label}
                className="w-full h-48 object-cover rounded-xl mb-3"
              />
              <p className="font-semibold text-gray-700">{service.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="bg-gray-800 text-gray-400 text-center py-6 text-sm">
        © {new Date().getFullYear()} Shero Home Food. All rights reserved.
      </footer>
    </div>
  );
}
