"use client";

import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Clock,
  Package,
  CheckCircle,
  AlertCircle,
  User,
  Phone,
  Calendar,
  Printer,
  Bell,
  Menu,
} from "lucide-react";

export default function StaffDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const queryClient = useQueryClient();

  // Fetch orders for staff dashboard
  const { data: ordersData, isLoading } = useQuery({
    queryKey: ["staff-orders"],
    queryFn: async () => {
      const response = await fetch("/api/orders?limit=50");
      if (!response.ok) throw new Error("Failed to fetch orders");
      return response.json();
    },
    refetchInterval: 30000, // Refresh every 30 seconds
  });

  // Update order status mutation
  const updateOrderMutation = useMutation({
    mutationFn: async ({ orderId, status }) => {
      const response = await fetch(`/api/orders/${orderId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (!response.ok) throw new Error("Failed to update order");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["staff-orders"] });
    },
  });

  const orders = ordersData?.orders || [];

  // Group orders by status
  const pendingOrders = orders.filter((order) => order.status === "pending");
  const preparingOrders = orders.filter(
    (order) => order.status === "preparing",
  );
  const readyOrders = orders.filter((order) => order.status === "ready");
  const completedOrders = orders.filter(
    (order) => order.status === "completed",
  );

  const updateOrderStatus = (orderId, newStatus) => {
    updateOrderMutation.mutate({ orderId, status: newStatus });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "preparing":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "ready":
        return "bg-green-100 text-green-800 border-green-200";
      case "completed":
        return "bg-gray-100 text-gray-800 border-gray-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getNextStatus = (currentStatus) => {
    switch (currentStatus) {
      case "pending":
        return "preparing";
      case "preparing":
        return "ready";
      case "ready":
        return "completed";
      default:
        return currentStatus;
    }
  };

  const getStatusAction = (status) => {
    switch (status) {
      case "pending":
        return "Start Preparing";
      case "preparing":
        return "Mark Ready";
      case "ready":
        return "Complete Order";
      default:
        return "Update";
    }
  };

  const OrderCard = ({ order, showActions = true }) => (
    <div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-all duration-200">
      <div className="flex justify-between items-start mb-3">
        <div>
          <h3 className="font-bold text-lg text-black font-inter">
            Order #{order.id}
          </h3>
          <p className="text-sm text-gray-600 font-inter">
            {order.first_name} {order.last_name}
          </p>
        </div>
        <div
          className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(order.status)}`}
        >
          {order.status}
        </div>
      </div>

      <div className="space-y-2 mb-4">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <User className="w-4 h-4" />
          <span className="font-inter">{order.email}</span>
        </div>
        {order.phone && (
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Phone className="w-4 h-4" />
            <span className="font-inter">{order.phone}</span>
          </div>
        )}
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Calendar className="w-4 h-4" />
          <span className="font-inter">
            {order.pickup_time
              ? `Pickup: ${new Date(order.pickup_time).toLocaleString()}`
              : `Ordered: ${new Date(order.created_at).toLocaleString()}`}
          </span>
        </div>
      </div>

      <div className="flex justify-between items-center mb-4">
        <span className="font-bold text-green-700 text-lg font-sora">
          ${order.total_amount}
        </span>
        <span className="text-sm text-gray-500 font-inter">
          {order.item_count} item{order.item_count !== 1 ? "s" : ""}
        </span>
      </div>

      {order.notes && (
        <div className="bg-gray-50 rounded-lg p-3 mb-4">
          <p className="text-sm text-gray-700 font-inter">
            <strong>Notes:</strong> {order.notes}
          </p>
        </div>
      )}

      {showActions && order.status !== "completed" && (
        <div className="flex gap-2">
          <button
            onClick={() =>
              updateOrderStatus(order.id, getNextStatus(order.status))
            }
            disabled={updateOrderMutation.isLoading}
            className="flex-1 bg-green-700 text-white px-4 py-2 rounded-lg font-semibold hover:bg-green-800 transition-colors duration-200 disabled:opacity-50 font-inter"
          >
            {getStatusAction(order.status)}
          </button>
          <button
            onClick={() => setSelectedOrderId(order.id)}
            className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg font-semibold hover:bg-gray-200 transition-colors duration-200 font-inter"
          >
            Details
          </button>
          <button className="bg-blue-100 text-blue-700 px-3 py-2 rounded-lg hover:bg-blue-200 transition-colors duration-200">
            <Printer className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );

  const Header = () => (
    <div className="bg-white border-b border-gray-200 px-4 md:px-6 py-4">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200"
          >
            <Menu size={20} className="text-gray-600" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-green-700 font-sora">
              Takoma Mart
            </h1>
            <p className="text-sm text-gray-600 font-inter">Staff Dashboard</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {/* Quick Stats */}
          <div className="hidden sm:flex items-center gap-6">
            <div className="text-center">
              <div className="text-lg font-bold text-yellow-600 font-sora">
                {pendingOrders.length}
              </div>
              <div className="text-xs text-gray-500 font-inter">Pending</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-blue-600 font-sora">
                {preparingOrders.length}
              </div>
              <div className="text-xs text-gray-500 font-inter">Preparing</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-green-600 font-sora">
                {readyOrders.length}
              </div>
              <div className="text-xs text-gray-500 font-inter">Ready</div>
            </div>
          </div>

          {/* Notifications */}
          <button className="relative p-2 text-gray-600 hover:text-green-700 transition-colors duration-200">
            <Bell className="w-5 h-5" />
            {pendingOrders.length + readyOrders.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full text-xs w-5 h-5 flex items-center justify-center">
                {pendingOrders.length + readyOrders.length}
              </span>
            )}
          </button>

          {/* Staff Avatar */}
          <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
            <span className="text-green-700 font-bold text-sm">ST</span>
          </div>
        </div>
      </div>
    </div>
  );

  const QuickActions = () => (
    <div className="bg-white border-b border-gray-200 px-4 md:px-6 py-3">
      <div className="flex gap-2 overflow-x-auto">
        <button
          onClick={() =>
            document
              .getElementById("pending-section")
              ?.scrollIntoView({ behavior: "smooth" })
          }
          className="flex items-center gap-2 px-4 py-2 bg-yellow-100 text-yellow-800 rounded-lg font-medium whitespace-nowrap hover:bg-yellow-200 transition-colors duration-200 font-inter"
        >
          <AlertCircle className="w-4 h-4" />
          {pendingOrders.length} Pending
        </button>
        <button
          onClick={() =>
            document
              .getElementById("preparing-section")
              ?.scrollIntoView({ behavior: "smooth" })
          }
          className="flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-800 rounded-lg font-medium whitespace-nowrap hover:bg-blue-200 transition-colors duration-200 font-inter"
        >
          <Clock className="w-4 h-4" />
          {preparingOrders.length} Preparing
        </button>
        <button
          onClick={() =>
            document
              .getElementById("ready-section")
              ?.scrollIntoView({ behavior: "smooth" })
          }
          className="flex items-center gap-2 px-4 py-2 bg-green-100 text-green-800 rounded-lg font-medium whitespace-nowrap hover:bg-green-200 transition-colors duration-200 font-inter"
        >
          <CheckCircle className="w-4 h-4" />
          {readyOrders.length} Ready
        </button>
      </div>
    </div>
  );

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-700 mx-auto mb-4"></div>
          <p className="text-gray-600 font-inter">Loading orders...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <QuickActions />

      <div className="max-w-7xl mx-auto p-4 md:p-6">
        {/* Pending Orders - High Priority */}
        {pendingOrders.length > 0 && (
          <section id="pending-section" className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <AlertCircle className="w-5 h-5 text-yellow-600" />
              <h2 className="text-xl font-bold text-gray-900 font-sora">
                Pending Orders ({pendingOrders.length})
              </h2>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
              {pendingOrders.map((order) => (
                <OrderCard key={order.id} order={order} />
              ))}
            </div>
          </section>
        )}

        {/* Preparing Orders */}
        {preparingOrders.length > 0 && (
          <section id="preparing-section" className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <Clock className="w-5 h-5 text-blue-600" />
              <h2 className="text-xl font-bold text-gray-900 font-sora">
                Preparing Orders ({preparingOrders.length})
              </h2>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
              {preparingOrders.map((order) => (
                <OrderCard key={order.id} order={order} />
              ))}
            </div>
          </section>
        )}

        {/* Ready for Pickup */}
        {readyOrders.length > 0 && (
          <section id="ready-section" className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <h2 className="text-xl font-bold text-gray-900 font-sora">
                Ready for Pickup ({readyOrders.length})
              </h2>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
              {readyOrders.map((order) => (
                <OrderCard key={order.id} order={order} />
              ))}
            </div>
          </section>
        )}

        {/* Completed Orders (Recent) */}
        {completedOrders.length > 0 && (
          <section className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <Package className="w-5 h-5 text-gray-600" />
              <h2 className="text-xl font-bold text-gray-900 font-sora">
                Recently Completed ({completedOrders.slice(0, 6).length})
              </h2>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
              {completedOrders.slice(0, 6).map((order) => (
                <OrderCard key={order.id} order={order} showActions={false} />
              ))}
            </div>
          </section>
        )}

        {/* Empty State */}
        {orders.length === 0 && (
          <div className="text-center py-12">
            <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2 font-sora">
              No Orders Yet
            </h3>
            <p className="text-gray-600 font-inter">
              Orders will appear here when customers place them.
            </p>
          </div>
        )}
      </div>

      {/* Auto-refresh indicator */}
      <div className="fixed bottom-4 right-4 bg-white border border-gray-200 rounded-lg px-3 py-2 shadow-lg">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-xs text-gray-600 font-inter">
            Auto-refreshing
          </span>
        </div>
      </div>
    </div>
  );
}
