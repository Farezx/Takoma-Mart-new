import { ShoppingCart, ArrowRight } from "lucide-react";
import { renderStars } from "@/utils/renderStars";

export function ProductsSection({
  products,
  categories,
  selectedCategory,
  setSelectedCategory,
  addToCart,
}) {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-end mb-12">
          <div>
            <h2 className="text-4xl font-bold text-gray-900 font-sora mb-2">
              {selectedCategory
                ? `${categories.find((c) => c.id === selectedCategory)?.name} Products`
                : "Trending Products"}
            </h2>
            <p className="text-gray-600 font-inter">
              Handpicked favorites with amazing reviews
            </p>
          </div>
          {selectedCategory && (
            <button
              onClick={() => setSelectedCategory(null)}
              className="group text-green-700 hover:text-green-800 font-medium font-inter inline-flex items-center"
            >
              View All Products
              <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {products.map((product) => (
            <div
              key={product.id}
              className="group bg-white rounded-3xl border-2 border-gray-100 hover:border-green-200 transition-all duration-300 hover:shadow-2xl overflow-hidden cursor-pointer"
              onClick={() => {
                if (typeof window !== "undefined") {
                  window.location.href = `/products/${product.id}`;
                }
              }}
            >
              <div className="aspect-square rounded-t-3xl overflow-hidden relative">
                <img
                  src={product.image_url}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                {/* Discount Badge */}
                <div className="absolute top-4 left-4 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs px-3 py-1 rounded-full font-bold">
                  Fresh
                </div>
                {/* Quick Add Button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    addToCart(product.id);
                  }}
                  className="absolute top-4 right-4 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-green-500 hover:text-white"
                >
                  <ShoppingCart className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6 space-y-4">
                {/* Product Info */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2 font-inter group-hover:text-green-700 transition-colors duration-200">
                    {product.name}
                  </h3>
                  <p className="text-sm text-gray-500 font-inter">
                    {product.weight} • {product.brand}
                  </p>
                </div>

                {/* Rating */}
                {product.average_rating > 0 && (
                  <div className="flex items-center space-x-2">
                    <div className="flex space-x-1">
                      {renderStars(Math.round(product.average_rating))}
                    </div>
                    <span className="text-sm font-medium text-gray-700 font-inter">
                      {product.average_rating}
                    </span>
                    <span className="text-sm text-gray-500 font-inter">
                      ({product.review_count} reviews)
                    </span>
                  </div>
                )}

                {/* Price and Add to Cart */}
                <div className="flex justify-between items-center pt-2">
                  <div>
                    <span className="text-2xl font-bold text-gray-900 font-sora">
                      ${product.price}
                    </span>
                    <span className="text-sm text-gray-500 ml-2 line-through font-inter">
                      ${(parseFloat(product.price) + 1.5).toFixed(2)}
                    </span>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      addToCart(product.id);
                    }}
                    className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-6 py-2 rounded-xl font-semibold hover:shadow-lg hover:scale-105 transition-all duration-200 font-inter"
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
