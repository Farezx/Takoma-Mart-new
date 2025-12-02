import { Clock, MapPin, Phone, Package, ChevronRight } from "lucide-react";

export function Footer({ categories }) {
  return (
    <footer className="bg-gray-900 text-white py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-emerald-500 rounded-xl flex items-center justify-center">
                <Package className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold font-sora">Takoma Mart</h3>
            </div>
            <p className="text-gray-300 font-inter leading-relaxed">
              Your neighborhood premium grocery store, serving the finest fresh
              and local products since 2020.
            </p>
            <div className="space-y-2">
              <div className="flex items-center space-x-3">
                <Clock className="w-4 h-4 text-green-400" />
                <span className="text-sm text-gray-300 font-inter">
                  Mon-Sun: 7AM - 9PM
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <MapPin className="w-4 h-4 text-green-400" />
                <span className="text-sm text-gray-300 font-inter">
                  123 Main St, Takoma Park, MD
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="w-4 h-4 text-green-400" />
                <span className="text-sm text-gray-300 font-inter">
                  (301) 555-0123
                </span>
              </div>
            </div>
          </div>

          {/* Shop Categories */}
          <div>
            <h4 className="font-semibold mb-6 font-sora">Shop Categories</h4>
            <ul className="space-y-3 text-sm text-gray-300">
              {categories.slice(0, 6).map((category) => (
                <li key={category.id}>
                  <a
                    href="#"
                    className="hover:text-green-400 transition-colors duration-200 font-inter inline-flex items-center"
                  >
                    <ChevronRight className="w-3 h-3 mr-2" />
                    {category.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h4 className="font-semibold mb-6 font-sora">Customer Service</h4>
            <ul className="space-y-3 text-sm text-gray-300">
              {[
                "Contact Support",
                "Order Tracking",
                "Returns & Refunds",
                "FAQ & Help",
                "Pickup Instructions",
                "Quality Guarantee",
              ].map((item) => (
                <li key={item}>
                  <a
                    href="#"
                    className="hover:text-green-400 transition-colors duration-200 font-inter inline-flex items-center"
                  >
                    <ChevronRight className="w-3 h-3 mr-2" />
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* About */}
          <div>
            <h4 className="font-semibold mb-6 font-sora">About Takoma Mart</h4>
            <ul className="space-y-3 text-sm text-gray-300">
              {[
                "Our Story",
                "Local Partnerships",
                "Sustainability",
                "Careers",
                "Press & Media",
                "Community Impact",
              ].map((item) => (
                <li key={item}>
                  <a
                    href="#"
                    className="hover:text-green-400 transition-colors duration-200 font-inter inline-flex items-center"
                  >
                    <ChevronRight className="w-3 h-3 mr-2" />
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-sm text-gray-400 font-inter">
              © 2024 Takoma Mart. All rights reserved. Made with ❤️ for our
              community.
            </p>
            <div className="flex items-center space-x-4 text-sm text-gray-400 font-inter">
              <a
                href="#"
                className="hover:text-green-400 transition-colors duration-200"
              >
                Privacy Policy
              </a>
              <span>•</span>
              <a
                href="#"
                className="hover:text-green-400 transition-colors duration-200"
              >
                Terms of Service
              </a>
              <span>•</span>
              <a
                href="#"
                className="hover:text-green-400 transition-colors duration-200"
              >
                Accessibility
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
