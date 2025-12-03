"use client";

import { useHomePage } from "@/hooks/useHomePage";
import { Header } from "@/components/HomePage/Header";
import { HeroSection } from "@/components/HomePage/HeroSection";
import { TrustFeaturesSection } from "@/components/HomePage/TrustFeaturesSection";
import { CategoriesSection } from "@/components/HomePage/CategoriesSection";
import { ProductsSection } from "@/components/HomePage/ProductsSection";
import { ReviewsSection } from "@/components/HomePage/ReviewsSection";
import { NewsletterSection } from "@/components/HomePage/NewsletterSection";
import { Footer } from "@/components/HomePage/Footer";
import { ScrollToTopButton } from "@/components/HomePage/ScrollToTopButton";

export default function HomePage() {
  const {
    mobileMenuOpen,
    setMobileMenuOpen,
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    cartItems,
    email,
    setEmail,
    categories,
    products,
    reviews,
    addToCart,
    handleNewsletterSubmit,
  } = useHomePage();

  return (
    <div className="min-h-screen bg-white">
      <Header
        mobileMenuOpen={mobileMenuOpen}
        setMobileMenuOpen={setMobileMenuOpen}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        cartItems={cartItems}
        categories={categories}
      />

      <HeroSection />

      <TrustFeaturesSection />

      <CategoriesSection
        categories={categories}
        setSelectedCategory={setSelectedCategory}
      />

      <ProductsSection
        products={products}
        categories={categories}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        addToCart={addToCart}
      />

      <ReviewsSection reviews={reviews} />

      <NewsletterSection
        email={email}
        setEmail={setEmail}
        handleNewsletterSubmit={handleNewsletterSubmit}
      />

      <Footer categories={categories} />

      <ScrollToTopButton />

      {/* Loading Animation */}
      <style jsx global>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.7; }
        }
        
        .animate-fadeInUp {
          animation: fadeInUp 0.6s ease-out forwards;
        }
        
        .animate-pulse {
          animation: pulse 2s infinite;
        }
      `}</style>
    </div>
  );
}
