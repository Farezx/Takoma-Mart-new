import { TrendingUp } from "lucide-react";

export function CategoriesSection({ categories = [], selectedCategory, onSelect }) {
  const handleSelect = (id) => {
    if (typeof onSelect === "function") onSelect(id);
  };

  return (
    <section className="py-16 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <header className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4 font-sora">Shop by Category</h2>
          <p className="text-xl text-gray-600 font-inter">Discover our premium selection across all departments</p>
        </header>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {categories.map(({ id, image_url, name }) => {
            const isActive = selectedCategory === id;
            return (
              <button
                key={id}
                onClick={() => handleSelect(id)}
                className={`group relative overflow-hidden rounded-2xl bg-white border-2 transition-all duration-300 hover:shadow-xl ${
                  isActive ? "border-green-400" : "border-gray-100 hover:border-green-200"
                }`}
              >
                <figure className="aspect-square relative">
                  <img
                    src={image_url}
                    alt={name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </figure>

                <div className="p-4">
                  <h3 className="text-sm font-semibold text-gray-900 group-hover:text-green-700 transition-colors duration-200 font-inter">
                    {name}
                  </h3>
                  <p className="text-xs text-gray-500 mt-1 font-inter">Premium Selection</p>
                </div>

                <div className="absolute top-2 right-2 bg-gradient-to-r from-orange-400 to-red-400 text-white text-xs px-2 py-1 rounded-full font-semibold opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <TrendingUp className="w-3 h-3 inline mr-1" />
                  Hot
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
