import { Award, ArrowRight, ChevronRight } from "lucide-react";
import { renderStars } from "@/utils/renderStars";

export function HeroSection() {
  return (
    <section className="relative bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 pt-12 pb-20 overflow-hidden">
      {/* Background Decorations */}
      <div className="absolute inset-0">
        <div className="absolute top-10 left-10 w-72 h-72 bg-green-200/30 rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-emerald-200/20 rounded-full blur-3xl"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Hero Content */}
          <div className="space-y-8">
            {/* Trust Badge */}
            <div className="inline-flex items-center space-x-2 bg-white/70 backdrop-blur-sm px-4 py-2 rounded-full border border-green-200">
              <Award className="w-4 h-4 text-green-600" />
              <span className="text-sm font-medium text-green-800 font-inter">
                Premium Quality Guaranteed
              </span>
            </div>

            <div className="space-y-6">
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-gray-900 font-sora leading-tight">
                Fresh<span className="text-green-600">.</span>
                <br />
                Local<span className="text-emerald-600">.</span>
                <br />
                <span className="bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                  Premium
                </span>
              </h1>
              <p className="text-xl text-gray-600 max-w-lg font-inter leading-relaxed">
                Experience the finest selection of organic produce, artisan
                goods, and premium groceries.
                <strong className="text-gray-900">
                  {" "}
                  Order online, pickup fresh.
                </strong>
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <button className="group bg-gradient-to-r from-green-600 to-emerald-600 text-white px-8 py-4 rounded-2xl font-semibold hover:shadow-xl transition-all duration-300 font-inter inline-flex items-center justify-center">
                Start Shopping
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" />
              </button>
              <button className="group border-2 border-green-200 text-green-700 px-8 py-4 rounded-2xl font-semibold hover:bg-green-50 hover:border-green-300 transition-all duration-300 font-inter inline-flex items-center justify-center">
                View Categories
                <ChevronRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" />
              </button>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-3 gap-4 pt-8 border-t border-green-100">
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900 font-sora">
                  500+
                </div>
                <div className="text-sm text-gray-600 font-inter">
                  Premium Products
                </div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900 font-sora">
                  15min
                </div>
                <div className="text-sm text-gray-600 font-inter">
                  Pickup Time
                </div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900 font-sora">
                  4.9★
                </div>
                <div className="text-sm text-gray-600 font-inter">
                  Customer Rating
                </div>
              </div>
            </div>
          </div>

          {/* Hero Image */}
          <div className="relative">
            <div className="relative bg-white/50 backdrop-blur-sm rounded-3xl p-8 shadow-2xl">
              <img
                src="https://images.unsplash.com/photo-1542838132-92c53300491e?w=600&h=500&fit=crop"
                alt="Fresh groceries"
                className="w-full h-96 object-cover rounded-2xl"
              />
              {/* Floating Review Card */}
              <div className="absolute -bottom-4 -left-4 bg-white rounded-2xl p-4 shadow-xl border border-gray-100">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center text-white font-bold">
                    A
                  </div>
                  <div>
                    <div className="flex space-x-1 mb-1">{renderStars(5)}</div>
                    <p className="text-sm font-medium text-gray-900 font-inter">
                      "Amazing quality!"
                    </p>
                    <p className="text-xs text-gray-500 font-inter">
                      - Anna M.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
