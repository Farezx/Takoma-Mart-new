"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  ArrowLeft,
  Star,
  ShoppingCart,
  Heart,
  Share2,
  Truck,
  Shield,
  Award,
  Plus,
  Minus,
  MessageSquare,
  ThumbsUp,
  Calendar,
  CheckCircle,
  AlertCircle,
} from "lucide-react";

export default function ProductDetailPage({ params }) {
  const queryClient = useQueryClient();
  const { id } = params;

  const [quantity, setQuantity] = useState(1);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [reviewForm, setReviewForm] = useState({
    rating: 5,
    title: "",
    comment: "",
  });
  const [showReviewForm, setShowReviewForm] = useState(false);

  // Fetch product details
  const { data: productData, isLoading } = useQuery({
    queryKey: ["product", id],
    queryFn: async () => {
      const response = await fetch(`/api/products/${id}`);
      if (!response.ok) throw new Error("Failed to fetch product");
      return response.json();
    },
  });

  // Fetch product reviews
  const { data: reviewsData } = useQuery({
    queryKey: ["reviews", id],
    queryFn: async () => {
      const response = await fetch(`/api/reviews?product_id=${id}&limit=20`);
      if (!response.ok) throw new Error("Failed to fetch reviews");
      return response.json();
    },
  });

  // Add to cart mutation
  const addToCartMutation = useMutation({
    mutationFn: async ({ productId, quantity }) => {
      const response = await fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: 1, // Mock user ID
          productId,
          quantity,
        }),
      });
      if (!response.ok) throw new Error("Failed to add to cart");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["cart"]);
      alert("Added to cart successfully!");
    },
  });

  // Submit review mutation
  const submitReviewMutation = useMutation({
    mutationFn: async (reviewData) => {
      const response = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: 1, // Mock user ID
          product_id: id,
          ...reviewData,
        }),
      });
      if (!response.ok) throw new Error("Failed to submit review");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["reviews", id]);
      queryClient.invalidateQueries(["product", id]);
      setShowReviewForm(false);
      setReviewForm({ rating: 5, title: "", comment: "" });
      alert("Review submitted successfully!");
    },
  });

  const product = productData?.product;
  const reviews = reviewsData?.reviews || [];

  const renderStars = (rating, size = 20) => {
    return [...Array(5)].map((_, i) => (
      <Star
        key={i}
        size={size}
        className={`${
          i < rating ? "text-yellow-400 fill-current" : "text-gray-300"
        }`}
      />
    ));
  };

  const handleAddToCart = () => {
    addToCartMutation.mutate({
      productId: id,
      quantity,
    });
  };

  const handleSubmitReview = (e) => {
    e.preventDefault();
    submitReviewMutation.mutate(reviewForm);
  };

  const goBack = () => {
    if (typeof window !== "undefined") {
      window.history.back();
    }
  };

  const goToHome = () => {
    if (typeof window !== "undefined") {
      window.location.href = "/";
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-600"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="mx-auto h-12 w-12 text-red-500 mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Product Not Found
          </h2>
          <p className="text-gray-600 mb-4">
            The product you're looking for doesn't exist.
          </p>
          <button
            onClick={goToHome}
            className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700"
          >
            Back to Store
          </button>
        </div>
      </div>
    );
  }

  // Mock multiple product images for carousel
  const productImages = [
    product.image_url,
    product.image_url, // Placeholder - in real app these would be different images
    product.image_url,
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <button
              onClick={goBack}
              className="flex items-center space-x-2 text-gray-600 hover:text-green-600 transition-colors font-inter"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="font-medium">Back to Products</span>
            </button>

            <button onClick={goToHome}>
              <h1 className="text-xl font-bold text-green-700 font-sora">
                Takoma Mart
              </h1>
            </button>

            <div className="flex items-center space-x-3">
              <button className="p-2 text-gray-600 hover:text-green-600 transition-colors">
                <Heart className="w-6 h-6" />
              </button>
              <button className="p-2 text-gray-600 hover:text-green-600 transition-colors">
                <Share2 className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Product Details */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="aspect-square rounded-2xl overflow-hidden bg-gray-100">
              <img
                src={productImages[selectedImageIndex]}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex space-x-3">
              {productImages.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImageIndex(index)}
                  className={`w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                    selectedImageIndex === index
                      ? "border-green-600"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <img
                    src={image}
                    alt={`${product.name} ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            {/* Basic Info */}
            <div>
              <div className="flex items-center space-x-2 text-sm text-gray-500 mb-2 font-inter">
                <span>{product.category_name}</span>
                <span>•</span>
                <span>SKU: {product.sku}</span>
              </div>
              <h1 className="text-4xl font-bold text-gray-900 mb-4 font-sora">
                {product.name}
              </h1>
              <p className="text-lg text-gray-600 font-inter leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* Rating */}
            {product.average_rating > 0 && (
              <div className="flex items-center space-x-4">
                <div className="flex space-x-1">
                  {renderStars(Math.round(product.average_rating))}
                </div>
                <span className="text-lg font-semibold text-gray-900 font-sora">
                  {product.average_rating}
                </span>
                <span className="text-gray-600 font-inter">
                  ({product.review_count} reviews)
                </span>
              </div>
            )}

            {/* Product Details */}
            <div className="grid grid-cols-2 gap-4 py-4 border-y border-gray-200">
              <div>
                <span className="text-sm text-gray-500 font-inter">Weight</span>
                <p className="font-semibold text-gray-900 font-inter">
                  {product.weight}
                </p>
              </div>
              <div>
                <span className="text-sm text-gray-500 font-inter">Brand</span>
                <p className="font-semibold text-gray-900 font-inter">
                  {product.brand}
                </p>
              </div>
              <div>
                <span className="text-sm text-gray-500 font-inter">Stock</span>
                <p className="font-semibold text-gray-900 font-inter">
                  {product.stock_quantity > 0
                    ? `${product.stock_quantity} available`
                    : "Out of stock"}
                </p>
              </div>
              <div>
                <span className="text-sm text-gray-500 font-inter">
                  Category
                </span>
                <p className="font-semibold text-gray-900 font-inter">
                  {product.category_name}
                </p>
              </div>
            </div>

            {/* Price */}
            <div className="flex items-center space-x-4">
              <span className="text-4xl font-bold text-green-600 font-sora">
                ${product.price}
              </span>
              <span className="text-xl text-gray-500 line-through font-inter">
                ${(parseFloat(product.price) + 2.0).toFixed(2)}
              </span>
              <span className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm font-semibold">
                Save ${(2.0).toFixed(2)}
              </span>
            </div>

            {/* Quantity Selector */}
            <div className="flex items-center space-x-4">
              <span className="text-lg font-semibold text-gray-900 font-inter">
                Quantity:
              </span>
              <div className="flex items-center border border-gray-300 rounded-xl">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-3 hover:bg-gray-50 transition-colors"
                  disabled={quantity <= 1}
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="px-6 py-3 font-semibold text-lg font-sora">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="p-3 hover:bg-gray-50 transition-colors"
                  disabled={quantity >= product.stock_quantity}
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Add to Cart Button */}
            <button
              onClick={handleAddToCart}
              disabled={
                product.stock_quantity === 0 || addToCartMutation.isLoading
              }
              className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white py-4 rounded-2xl font-semibold text-lg hover:shadow-xl transition-all duration-300 font-inter inline-flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ShoppingCart className="w-6 h-6" />
              <span>
                {addToCartMutation.isLoading
                  ? "Adding..."
                  : product.stock_quantity === 0
                    ? "Out of Stock"
                    : "Add to Cart"}
              </span>
            </button>

            {/* Trust Badges */}
            <div className="grid grid-cols-3 gap-4 pt-6">
              {[
                {
                  icon: Truck,
                  title: "15-Min Pickup",
                  desc: "Ready in 15 minutes",
                },
                {
                  icon: Shield,
                  title: "Quality Guarantee",
                  desc: "100% satisfaction",
                },
                {
                  icon: Award,
                  title: "Premium Fresh",
                  desc: "Locally sourced",
                },
              ].map((badge, index) => (
                <div
                  key={index}
                  className="text-center p-4 bg-gray-50 rounded-xl"
                >
                  <badge.icon className="w-8 h-8 text-green-600 mx-auto mb-2" />
                  <h4 className="font-semibold text-sm text-gray-900 font-inter">
                    {badge.title}
                  </h4>
                  <p className="text-xs text-gray-600 font-inter">
                    {badge.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="mt-16 border-t border-gray-200 pt-12">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-gray-900 font-sora">
              Customer Reviews
            </h2>
            <button
              onClick={() => setShowReviewForm(true)}
              className="bg-green-600 text-white px-6 py-2 rounded-xl hover:bg-green-700 transition-colors font-inter inline-flex items-center space-x-2"
            >
              <MessageSquare className="w-5 h-5" />
              <span>Write Review</span>
            </button>
          </div>

          {/* Review Summary */}
          {product.average_rating > 0 && (
            <div className="bg-gray-50 rounded-2xl p-8 mb-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="text-center">
                  <div className="text-5xl font-bold text-gray-900 font-sora mb-2">
                    {product.average_rating}
                  </div>
                  <div className="flex justify-center space-x-1 mb-2">
                    {renderStars(Math.round(product.average_rating), 24)}
                  </div>
                  <p className="text-gray-600 font-inter">
                    Based on {product.review_count} reviews
                  </p>
                </div>

                <div className="md:col-span-2 space-y-2">
                  {[5, 4, 3, 2, 1].map((rating) => {
                    const count = reviews.filter(
                      (r) => r.rating === rating,
                    ).length;
                    const percentage =
                      product.review_count > 0
                        ? (count / product.review_count) * 100
                        : 0;

                    return (
                      <div key={rating} className="flex items-center space-x-3">
                        <span className="text-sm font-medium text-gray-600 w-8 font-inter">
                          {rating}★
                        </span>
                        <div className="flex-1 bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-yellow-400 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${percentage}%` }}
                          ></div>
                        </div>
                        <span className="text-sm text-gray-600 w-12 font-inter">
                          {count}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* Review Form */}
          {showReviewForm && (
            <div className="bg-white border-2 border-green-200 rounded-2xl p-6 mb-8">
              <h3 className="text-xl font-bold text-gray-900 mb-4 font-sora">
                Write a Review
              </h3>
              <form onSubmit={handleSubmitReview} className="space-y-4">
                {/* Rating */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 font-inter">
                    Rating *
                  </label>
                  <div className="flex space-x-2">
                    {[1, 2, 3, 4, 5].map((rating) => (
                      <button
                        key={rating}
                        type="button"
                        onClick={() =>
                          setReviewForm((prev) => ({ ...prev, rating }))
                        }
                        className="p-1"
                      >
                        <Star
                          size={32}
                          className={`${
                            rating <= reviewForm.rating
                              ? "text-yellow-400 fill-current"
                              : "text-gray-300"
                          } hover:text-yellow-400 transition-colors`}
                        />
                      </button>
                    ))}
                  </div>
                </div>

                {/* Title */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 font-inter">
                    Review Title
                  </label>
                  <input
                    type="text"
                    value={reviewForm.title}
                    onChange={(e) =>
                      setReviewForm((prev) => ({
                        ...prev,
                        title: e.target.value,
                      }))
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 font-inter"
                    placeholder="Give your review a title"
                  />
                </div>

                {/* Comment */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 font-inter">
                    Your Review *
                  </label>
                  <textarea
                    value={reviewForm.comment}
                    onChange={(e) =>
                      setReviewForm((prev) => ({
                        ...prev,
                        comment: e.target.value,
                      }))
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 font-inter"
                    rows="4"
                    placeholder="Share your experience with this product..."
                    required
                  />
                </div>

                {/* Buttons */}
                <div className="flex space-x-3">
                  <button
                    type="submit"
                    disabled={submitReviewMutation.isLoading}
                    className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors font-inter disabled:opacity-50"
                  >
                    {submitReviewMutation.isLoading
                      ? "Submitting..."
                      : "Submit Review"}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowReviewForm(false)}
                    className="border border-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-50 transition-colors font-inter"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Review List */}
          <div className="space-y-6">
            {reviews.map((review) => (
              <div key={review.id} className="bg-gray-50 rounded-2xl p-6">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center text-white font-bold text-lg font-sora">
                    {review.first_name?.[0] || "A"}
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <h4 className="font-semibold text-gray-900 font-inter">
                          {review.first_name} {review.last_name?.[0]}.
                        </h4>
                        <div className="flex items-center space-x-2">
                          <div className="flex space-x-1">
                            {renderStars(review.rating)}
                          </div>
                          <CheckCircle className="w-4 h-4 text-green-500" />
                          <span className="text-xs text-gray-500 font-inter">
                            Verified Purchase
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center space-x-2 text-sm text-gray-500 font-inter">
                          <Calendar className="w-4 h-4" />
                          <span>
                            {new Date(review.created_at).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>

                    {review.title && (
                      <h5 className="font-semibold text-gray-900 mb-2 font-inter">
                        {review.title}
                      </h5>
                    )}
                    <p className="text-gray-700 font-inter leading-relaxed mb-4">
                      {review.comment}
                    </p>

                    <div className="flex items-center space-x-4">
                      <button className="flex items-center space-x-2 text-sm text-gray-500 hover:text-green-600 transition-colors font-inter">
                        <ThumbsUp className="w-4 h-4" />
                        <span>Helpful ({review.helpful_count})</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {reviews.length === 0 && (
            <div className="text-center py-12">
              <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2 font-inter">
                No reviews yet
              </h3>
              <p className="text-gray-600 font-inter">
                Be the first to review this product!
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
