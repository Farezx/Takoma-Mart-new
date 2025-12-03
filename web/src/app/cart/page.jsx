"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  ShoppingCart,
  Plus,
  Minus,
  Trash2,
  Calendar,
  CreditCard,
  ArrowLeft,
  Clock,
  MapPin,
  CheckCircle,
} from "lucide-react";

export default function CartPage() {
  const queryClient = useQueryClient();
  const [checkoutStep, setCheckoutStep] = useState("cart"); // cart, pickup, payment, confirmation
  const [pickupTime, setPickupTime] = useState("");
  const [orderNotes, setOrderNotes] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("stripe");
  const [orderId, setOrderId] = useState(null);

  // Mock user ID for demo
  const userId = 1;

  const navigateBack = () => {
    if (typeof window !== "undefined") {
      window.history.back();
    }
  };

  const navigateToHome = () => {
    if (typeof window !== "undefined") {
      window.location.href = "/";
    }
  };

  const navigateToOrders = () => {
    if (typeof window !== "undefined") {
      window.location.href = "/orders";
    }
  };

  // Fetch cart items
  const { data: cartData, isLoading } = useQuery({
    queryKey: ["cart", userId],
    queryFn: async () => {
      const response = await fetch(`/api/cart?userId=${userId}`);
      if (!response.ok) throw new Error("Failed to fetch cart");
      return response.json();
    },
  });

  // Update cart item quantity
  const updateCartMutation = useMutation({
    mutationFn: async ({ cartItemId, quantity }) => {
      const response = await fetch("/api/cart", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cartItemId, quantity }),
      });
      if (!response.ok) throw new Error("Failed to update cart");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart", userId] });
    },
  });

  // Remove item from cart
  const removeItemMutation = useMutation({
    mutationFn: async (cartItemId) => {
      const response = await fetch("/api/cart", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cartItemId, quantity: 0 }),
      });
      if (!response.ok) throw new Error("Failed to remove item");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart", userId] });
    },
  });

  // Create order
  const createOrderMutation = useMutation({
    mutationFn: async (orderData) => {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderData),
      });
      if (!response.ok) throw new Error("Failed to create order");
      return response.json();
    },
    onSuccess: (data) => {
      setOrderId(data.order.id);
      setCheckoutStep("confirmation");
      queryClient.invalidateQueries({ queryKey: ["cart", userId] });
    },
  });

  const cart = cartData || { cartItems: [], total: "0.00", itemCount: 0 };
  const subtotal = parseFloat(cart.total);
  const taxRate = 0.08;
  const tax = subtotal * taxRate;
  const total = subtotal + tax;

  // Generate pickup time slots for next 3 days
  const generatePickupSlots = () => {
    const slots = [];
    const now = new Date();

    for (let day = 0; day < 3; day++) {
      const date = new Date(now);
      date.setDate(date.getDate() + day);

      // Skip today if it's after 6 PM
      if (day === 0 && now.getHours() >= 18) continue;

      const dayName =
        day === 0
          ? "Today"
          : day === 1
            ? "Tomorrow"
            : date.toLocaleDateString("en-US", { weekday: "long" });
      const dateStr = date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });

      // Add time slots from 9 AM to 7 PM
      for (let hour = 9; hour <= 19; hour++) {
        const time = new Date(date);
        time.setHours(hour, 0, 0, 0);

        // Skip past times for today
        if (day === 0 && time <= now) continue;

        const timeStr = time.toLocaleTimeString("en-US", {
          hour: "numeric",
          minute: "2-digit",
          hour12: true,
        });

        slots.push({
          value: time.toISOString(),
          label: `${dayName}, ${dateStr} at ${timeStr}`,
          day: dayName,
          date: dateStr,
          time: timeStr,
        });
      }
    }

    return slots;
  };

  const updateQuantity = (cartItemId, newQuantity) => {
    if (newQuantity < 1) {
      removeItemMutation.mutate(cartItemId);
    } else {
      updateCartMutation.mutate({ cartItemId, quantity: newQuantity });
    }
  };

  const removeItem = (cartItemId) => {
    removeItemMutation.mutate(cartItemId);
  };

  const proceedToPickup = () => {
    if (cart.cartItems.length === 0) return;
    setCheckoutStep("pickup");
  };

  const proceedToPayment = () => {
    if (!pickupTime) return;
    setCheckoutStep("payment");
  };

  const completeOrder = () => {
    if (!pickupTime || !paymentMethod) return;

    createOrderMutation.mutate({
      userId,
      pickupTime,
      notes: orderNotes,
      paymentMethod,
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-700 mx-auto mb-4"></div>
          <p className="text-gray-600 font-inter">Loading your cart...</p>
        </div>
      </div>
    );
  }

  // Cart Step
  if (checkoutStep === "cart") {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 sticky top-0 z-50">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center gap-4">
              <button
                onClick={navigateBack}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
              >
                <ArrowLeft className="w-5 h-5 text-gray-600" />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-green-700 font-sora">
                  Your Cart
                </h1>
                <p className="text-sm text-gray-600 font-inter">
                  {cart.itemCount} item{cart.itemCount !== 1 ? "s" : ""} in your
                  cart
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {cart.cartItems.length === 0 ? (
            <div className="text-center py-12">
              <ShoppingCart className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-gray-900 mb-2 font-sora">
                Your cart is empty
              </h2>
              <p className="text-gray-600 mb-6 font-inter">
                Start shopping to add items to your cart.
              </p>
              <button
                onClick={navigateToHome}
                className="bg-green-700 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-800 transition-colors duration-200 font-inter"
              >
                Continue Shopping
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Cart Items */}
              <div className="lg:col-span-2 space-y-4">
                {cart.cartItems.map((item) => (
                  <div
                    key={item.id}
                    className="bg-white rounded-lg border border-gray-200 p-6"
                  >
                    <div className="flex items-center gap-4">
                      <img
                        src={item.image_url}
                        alt={item.name}
                        className="w-20 h-20 object-cover rounded-lg"
                      />
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 font-inter">
                          {item.name}
                        </h3>
                        <p className="text-sm text-gray-600 font-inter">
                          ${item.price} each
                        </p>
                        {item.notes && (
                          <p className="text-sm text-gray-500 italic font-inter">
                            Note: {item.notes}
                          </p>
                        )}
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="flex items-center border border-gray-300 rounded-lg">
                          <button
                            onClick={() =>
                              updateQuantity(item.id, item.quantity - 1)
                            }
                            className="p-2 hover:bg-gray-100 transition-colors duration-200"
                            disabled={updateCartMutation.isLoading}
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                          <span className="px-4 py-2 font-semibold font-inter">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() =>
                              updateQuantity(item.id, item.quantity + 1)
                            }
                            className="p-2 hover:bg-gray-100 transition-colors duration-200"
                            disabled={updateCartMutation.isLoading}
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>

                        <span className="font-bold text-green-700 w-20 text-right font-sora">
                          ${(parseFloat(item.price) * item.quantity).toFixed(2)}
                        </span>

                        <button
                          onClick={() => removeItem(item.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
                          disabled={removeItemMutation.isLoading}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Order Summary */}
              <div className="bg-white rounded-lg border border-gray-200 p-6 h-fit">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 font-sora">
                  Order Summary
                </h3>

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between font-inter">
                    <span>Subtotal</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between font-inter">
                    <span>Tax (8%)</span>
                    <span>${tax.toFixed(2)}</span>
                  </div>
                  <div className="border-t border-gray-200 pt-2 mt-2">
                    <div className="flex justify-between font-semibold text-lg font-sora">
                      <span>Total</span>
                      <span className="text-green-700">
                        ${total.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={proceedToPickup}
                  className="w-full bg-green-700 text-white py-3 rounded-lg font-semibold hover:bg-green-800 transition-colors duration-200 mt-6 font-inter"
                >
                  Proceed to Pickup
                </button>

                <button
                  onClick={navigateToHome}
                  className="w-full border border-green-700 text-green-700 py-3 rounded-lg font-semibold hover:bg-green-50 transition-colors duration-200 mt-2 font-inter"
                >
                  Continue Shopping
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Pickup Time Step
  if (checkoutStep === "pickup") {
    const pickupSlots = generatePickupSlots();

    return (
      <div className="min-h-screen bg-gray-50">
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setCheckoutStep("cart")}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
              >
                <ArrowLeft className="w-5 h-5 text-gray-600" />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-green-700 font-sora">
                  Schedule Pickup
                </h1>
                <p className="text-sm text-gray-600 font-inter">
                  Choose when you'd like to pick up your order
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
            <div className="flex items-center gap-3 mb-4">
              <MapPin className="w-5 h-5 text-green-600" />
              <div>
                <h3 className="font-semibold text-gray-900 font-inter">
                  Pickup Location
                </h3>
                <p className="text-sm text-gray-600 font-inter">
                  123 Main Street, Takoma Park, MD 20912
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
            <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2 font-inter">
              <Calendar className="w-5 h-5 text-green-600" />
              Select Pickup Time
            </h3>

            <div className="grid grid-cols-1 gap-2 max-h-64 overflow-y-auto">
              {pickupSlots.map((slot) => (
                <label
                  key={slot.value}
                  className={`flex items-center p-3 rounded-lg border-2 cursor-pointer transition-all duration-200 ${
                    pickupTime === slot.value
                      ? "border-green-500 bg-green-50"
                      : "border-gray-200 hover:border-green-300"
                  }`}
                >
                  <input
                    type="radio"
                    value={slot.value}
                    checked={pickupTime === slot.value}
                    onChange={(e) => setPickupTime(e.target.value)}
                    className="sr-only"
                  />
                  <Clock className="w-4 h-4 text-gray-400 mr-3" />
                  <span className="font-inter">{slot.label}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2 font-inter">
              Order Notes (Optional)
            </label>
            <textarea
              value={orderNotes}
              onChange={(e) => setOrderNotes(e.target.value)}
              placeholder="Any special instructions or requests..."
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent font-inter"
              rows={3}
            />
          </div>

          <button
            onClick={proceedToPayment}
            disabled={!pickupTime}
            className="w-full bg-green-700 text-white py-3 rounded-lg font-semibold hover:bg-green-800 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed font-inter"
          >
            Continue to Payment
          </button>
        </div>
      </div>
    );
  }

  // Payment Step
  if (checkoutStep === "payment") {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setCheckoutStep("pickup")}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
              >
                <ArrowLeft className="w-5 h-5 text-gray-600" />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-green-700 font-sora">
                  Payment
                </h1>
                <p className="text-sm text-gray-600 font-inter">
                  Complete your order
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
            <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2 font-inter">
              <CreditCard className="w-5 h-5 text-green-600" />
              Payment Method
            </h3>

            <div className="space-y-3">
              {[
                {
                  id: "stripe",
                  name: "Credit/Debit Card",
                  description: "Secure payment with Stripe",
                },
                {
                  id: "apple-pay",
                  name: "Apple Pay",
                  description: "Pay with Touch ID or Face ID",
                },
                {
                  id: "google-pay",
                  name: "Google Pay",
                  description: "Fast and secure",
                },
              ].map((method) => (
                <label
                  key={method.id}
                  className={`flex items-center p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 ${
                    paymentMethod === method.id
                      ? "border-green-500 bg-green-50"
                      : "border-gray-200 hover:border-green-300"
                  }`}
                >
                  <input
                    type="radio"
                    value={method.id}
                    checked={paymentMethod === method.id}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="sr-only"
                  />
                  <div>
                    <div className="font-semibold text-gray-900 font-inter">
                      {method.name}
                    </div>
                    <div className="text-sm text-gray-600 font-inter">
                      {method.description}
                    </div>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Order Summary */}
          <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
            <h3 className="font-semibold text-gray-900 mb-4 font-sora">
              Order Summary
            </h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between font-inter">
                <span>
                  Subtotal ({cart.itemCount} item
                  {cart.itemCount !== 1 ? "s" : ""})
                </span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-inter">
                <span>Tax</span>
                <span>${tax.toFixed(2)}</span>
              </div>
              <div className="border-t border-gray-200 pt-2 mt-2">
                <div className="flex justify-between font-semibold text-lg font-sora">
                  <span>Total</span>
                  <span className="text-green-700">${total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>

          <button
            onClick={completeOrder}
            disabled={createOrderMutation.isLoading}
            className="w-full bg-green-700 text-white py-3 rounded-lg font-semibold hover:bg-green-800 transition-colors duration-200 disabled:opacity-50 font-inter"
          >
            {createOrderMutation.isLoading
              ? "Processing..."
              : `Place Order • $${total.toFixed(2)}`}
          </button>
        </div>
      </div>
    );
  }

  // Confirmation Step
  if (checkoutStep === "confirmation") {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-6" />
            <h1 className="text-3xl font-bold text-gray-900 mb-4 font-sora">
              Order Confirmed!
            </h1>
            <p className="text-gray-600 mb-8 font-inter">
              Thank you for your order. We'll have it ready for pickup at your
              scheduled time.
            </p>

            <div className="bg-white rounded-lg border border-gray-200 p-6 mb-8 text-left">
              <h3 className="font-semibold text-gray-900 mb-4 font-inter">
                Order Details
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between font-inter">
                  <span>Order Number</span>
                  <span className="font-semibold">#{orderId}</span>
                </div>
                <div className="flex justify-between font-inter">
                  <span>Pickup Time</span>
                  <span>{new Date(pickupTime).toLocaleString()}</span>
                </div>
                <div className="flex justify-between font-inter">
                  <span>Total Amount</span>
                  <span className="font-semibold text-green-700">
                    ${total.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <button
                onClick={navigateToOrders}
                className="w-full bg-green-700 text-white py-3 rounded-lg font-semibold hover:bg-green-800 transition-colors duration-200 font-inter"
              >
                View Order Status
              </button>
              <button
                onClick={navigateToHome}
                className="w-full border border-green-700 text-green-700 py-3 rounded-lg font-semibold hover:bg-green-50 transition-colors duration-200 font-inter"
              >
                Continue Shopping
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
