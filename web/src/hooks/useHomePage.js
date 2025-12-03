import { useState } from "react";
import { useQuery } from "@tanstack/react-query";

export function useHomePage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [cartItems, setCartItems] = useState([]);
  const [email, setEmail] = useState("");

  // Fetch categories
  const { data: categoriesData } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const response = await fetch("/api/categories");
      if (!response.ok) throw new Error("Failed to fetch categories");
      return response.json();
    },
  });

  // Fetch products
  const { data: productsData } = useQuery({
    queryKey: ["products", selectedCategory, searchQuery],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (selectedCategory) params.append("category", selectedCategory);
      if (searchQuery) params.append("search", searchQuery);
      params.append("limit", "8");

      const response = await fetch(`/api/products?${params}`);
      if (!response.ok) throw new Error("Failed to fetch products");
      return response.json();
    },
  });

  // Fetch recent reviews
  const { data: reviewsData } = useQuery({
    queryKey: ["reviews"],
    queryFn: async () => {
      const response = await fetch("/api/reviews?limit=6");
      if (!response.ok) throw new Error("Failed to fetch reviews");
      return response.json();
    },
  });

  const categories = categoriesData?.categories || [];
  const products = productsData?.products || [];
  const reviews = reviewsData?.reviews || [];

  const addToCart = async (productId, quantity = 1) => {
    try {
      const userId = 1; // Mock user ID for demo
      const response = await fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, productId, quantity }),
      });

      if (response.ok) {
        setCartItems((prev) => [...prev, { productId, quantity }]);
      }
    } catch (error) {
      console.error("Error adding to cart:", error);
    }
  };

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    // Handle newsletter signup
    setEmail("");
    alert("Thank you for subscribing!");
  };

  return {
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
  };
}
