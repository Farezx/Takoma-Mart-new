import { Clock, MapPin, Phone, Package, ChevronRight } from "lucide-react";

export function Footer({ categories = [], onNavigate }) {
  const handleNav = (slug) => {
    if (typeof onNavigate === "function") onNavigate(slug);
  };

  const shopLinks = categories.slice(0, 6).map(({ id, name, slug }) => ({
    key: id,
    label: name,
    slug: slug || `category/${id}`,
  }));

  const customerService = [
    "Contact Support",
    "Order Tracking",
    "Returns & Refunds",
    "FAQ & Help",
    "Pickup Instructions",
    "Quality Guarantee",
  ];

  const aboutLinks = [
    "Our Story",
    "Local Partnerships",
    "Sustainability",
    "Careers",
    "Press & Media",
    "Community Impact",
  ];

  const linkClass =
    "hover:text-green-400 transition-colors duration-200 font-inter inline-flex items-center";

  return (
    <footer className="bg-gray-900 text-white py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-emerald-500 rounded-xl flex items-center justify-center">
                <Package className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold font-sora">Takoma Mart</h3>
            </div>
            <p className="text-gray-300 font-inter leading-relaxed">
              Your neighborhood premium grocery store, serving the finest fresh and local products since 2020.
            </p>
            <div className="space-y-2">
              <div className="flex items-center space-x-3">
                <Clock className="w-4 h-4 text-green-400" />
                <span className="text-sm text-gray-300 font-inter">Mon-Sun: 7AM - 9PM</span>
              </div>
              <div className="flex items-center space-x-3">
                <MapPin className="w-4 h-4 text-green-400" />
                <span className="text-sm text-gray-300 font-inter">123 Main St, Takoma Park, MD</span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="w-4 h-4 text-green-400" />
                <span className="text-sm text-gray-300 font-inter">(301) 555-0123</span>
              </div>
            </div>
          </div>

          <div>
            <h4 className="font-semibold mb-6 font-sora">Shop Categories</h4>
            <ul className="space-y-3 text-sm text-gray-300">
              {shopLinks.map(({ key, label, slug }) => (
                <li key={key}>
                  <button onClick={() => handleNav(slug)} className={linkClass}>
                    <ChevronRight className="w-3 h-3 mr-2" />
                    {label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-6 font-sora">Customer Service</h4>
            <ul className="space-y-3 text-sm text-gray-300">
              {customerService.map((item) => (
                <li key={item}>
                  <button onClick={() => handleNav(item)} className={linkClass}>
                    <ChevronRight className="w-3 h-3 mr-2" />
                    {item}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-6 font-sora">About Takoma Mart</h4>
            <ul className="space-y-3 text-sm text-gray-300">
              {aboutLinks.map((item) => (
                <li key={item}>
                  <button onClick={() => handleNav(item)} className={linkClass}>
                    <ChevronRight className="w-3 h-3 mr-2" />
                    {item}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-sm text-gray-400 font-inter">© 2024 Takoma Mart. All rights reserved.</p>
            <div className="flex items-center space-x-4 text-sm text-gray-400 font-inter">
              {["Privacy Policy", "Terms of Service", "Accessibility"].map((item) => (
                <button key={item} onClick={() => handleNav(item)} className="hover:text-green-400 transition-colors duration-200">
                  {item}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
