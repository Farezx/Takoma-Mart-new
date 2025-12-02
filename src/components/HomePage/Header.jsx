import { Search, ShoppingCart, Menu, X, User, Package } from "lucide-react";

export function Header({
  mobileMenuOpen,
  setMobileMenuOpen,
  searchQuery,
  setSearchQuery,
  selectedCategory,
  setSelectedCategory,
  cartItems,
  categories,
}) {
  return (
    <header className="bg-white/95 backdrop-blur-md border-b border-gray-100 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-18">
          {/* Enhanced Logo */}
          <div className="flex items-center">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-green-700 rounded-xl flex items-center justify-center">
                <Package className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-green-700 font-sora">
                  Takoma Mart
                </h1>
                <p className="text-xs text-gray-500 font-inter">
                  Premium Grocery
                </p>
              </div>
            </div>
          </div>

          {/* Enhanced Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            <button
              onClick={() => setSelectedCategory(null)}
              className={`text-sm font-medium transition-all duration-200 font-inter px-3 py-2 rounded-lg ${
                !selectedCategory
                  ? "text-green-700 bg-green-50"
                  : "text-gray-700 hover:text-green-700 hover:bg-green-50"
              }`}
            >
              All Products
            </button>
            {categories.slice(0, 4).map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`text-sm font-medium transition-all duration-200 font-inter px-3 py-2 rounded-lg ${
                  selectedCategory === category.id
                    ? "text-green-700 bg-green-50"
                    : "text-gray-700 hover:text-green-700 hover:bg-green-50"
                }`}
              >
                {category.name}
              </button>
            ))}
          </nav>

          {/* Enhanced Search and Actions */}
          <div className="flex items-center space-x-4">
            {/* Enhanced Search Bar */}
            <div className="relative hidden sm:block">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search fresh products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent w-72 font-inter bg-gray-50/50 backdrop-blur-sm"
              />
            </div>

            {/* Enhanced Cart */}
            <button className="relative p-3 text-gray-700 hover:text-green-700 transition-all duration-200 hover:bg-green-50 rounded-xl">
              <ShoppingCart className="w-6 h-6" />
              {cartItems.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-full text-xs w-6 h-6 flex items-center justify-center font-semibold animate-pulse">
                  {cartItems.length}
                </span>
              )}
            </button>

            {/* Enhanced User Account */}
            <button className="p-3 text-gray-700 hover:text-green-700 transition-all duration-200 hover:bg-green-50 rounded-xl">
              <User className="w-6 h-6" />
            </button>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-3 text-gray-700 hover:text-green-700 transition-all duration-200 hover:bg-green-50 rounded-xl"
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {/* Enhanced Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-6 border-t border-gray-100">
            <div className="space-y-6">
              {/* Mobile Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search fresh products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent font-inter bg-gray-50"
                />
              </div>

              {/* Mobile Navigation */}
              <nav className="space-y-2">
                <button
                  onClick={() => {
                    setSelectedCategory(null);
                    setMobileMenuOpen(false);
                  }}
                  className="block w-full text-left px-4 py-3 text-sm font-medium text-gray-700 hover:text-green-700 hover:bg-green-50 rounded-xl transition-all duration-200 font-inter"
                >
                  All Products
                </button>
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => {
                      setSelectedCategory(category.id);
                      setMobileMenuOpen(false);
                    }}
                    className="block w-full text-left px-4 py-3 text-sm font-medium text-gray-700 hover:text-green-700 hover:bg-green-50 rounded-xl transition-all duration-200 font-inter"
                  >
                    {category.name}
                  </button>
                ))}
              </nav>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
