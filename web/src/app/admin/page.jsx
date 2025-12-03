"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  LayoutDashboard,
  Package,
  Users,
  ShoppingBag,
  Settings,
  BarChart3,
  Plus,
  Search,
  Bell,
  MessageCircle,
  Menu,
  ChevronDown,
  Edit,
  Trash2,
  Eye,
} from "lucide-react";

export default function AdminDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("Dashboard");
  const [searchQuery, setSearchQuery] = useState("");

  // Fetch dashboard data
  const { data: statsData } = useQuery({
    queryKey: ["admin-stats"],
    queryFn: async () => {
      const [ordersRes, usersRes, productsRes] = await Promise.all([
        fetch("/api/orders"),
        fetch("/api/users"),
        fetch("/api/products?limit=100"),
      ]);

      const orders = await ordersRes.json();
      const users = await usersRes.json();
      const products = await productsRes.json();

      return {
        orders: orders.orders || [],
        users: users.users || [],
        products: products.products || [],
      };
    },
  });

  // Fetch products for management
  const { data: productsData } = useQuery({
    queryKey: ["admin-products", searchQuery],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (searchQuery) params.append("search", searchQuery);
      params.append("limit", "20");

      const response = await fetch(`/api/products?${params}`);
      if (!response.ok) throw new Error("Failed to fetch products");
      return response.json();
    },
  });

  // Fetch categories
  const { data: categoriesData } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const response = await fetch("/api/categories");
      if (!response.ok) throw new Error("Failed to fetch categories");
      return response.json();
    },
  });

  // Fetch recent orders
  const { data: ordersData } = useQuery({
    queryKey: ["admin-orders"],
    queryFn: async () => {
      const response = await fetch("/api/orders?limit=10");
      if (!response.ok) throw new Error("Failed to fetch orders");
      return response.json();
    },
  });

  const stats = statsData || { orders: [], users: [], products: [] };
  const products = productsData?.products || [];
  const categories = categoriesData?.categories || [];
  const orders = ordersData?.orders || [];

  // Calculate stats
  const totalRevenue = stats.orders.reduce(
    (sum, order) => sum + parseFloat(order.total_amount || 0),
    0,
  );
  const totalOrders = stats.orders.length;
  const totalCustomers = stats.users.filter(
    (user) => user.role === "customer",
  ).length;
  const totalProducts = stats.products.length;

  const navigationItems = [
    { name: "Dashboard", icon: LayoutDashboard },
    { name: "Products", icon: Package },
    { name: "Categories", icon: LayoutDashboard },
    { name: "Orders", icon: ShoppingBag },
    { name: "Customers", icon: Users },
    { name: "Analytics", icon: BarChart3 },
    { name: "Settings", icon: Settings },
  ];

  const Sidebar = () => (
    <div className="w-60 bg-[#F3F3F3] dark:bg-[#1A1A1A] flex-shrink-0 flex flex-col h-full">
      {/* Brand Logo */}
      <div className="p-4 flex justify-start">
        <div className="w-12 h-12 bg-white dark:bg-[#262626] rounded-full border border-[#E4E4E4] dark:border-[#404040] flex items-center justify-center">
          <div className="w-8 h-8 bg-green-700 rounded-full opacity-90 flex items-center justify-center">
            <span className="text-white font-bold text-xs">TM</span>
          </div>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 px-4">
        <div className="space-y-2">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.name;

            return (
              <button
                key={item.name}
                onClick={() => setActiveTab(item.name)}
                className={`w-full flex items-center justify-between px-3 py-3 rounded-lg transition-all duration-200 ${
                  isActive
                    ? "bg-white dark:bg-[#262626] border border-[#E4E4E4] dark:border-[#404040] text-black dark:text-white"
                    : "text-black/70 dark:text-white/70 hover:text-black dark:hover:text-white hover:bg-white/50 dark:hover:bg-white/10 active:bg-white/70 dark:active:bg-white/15 active:scale-[0.98]"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    size={20}
                    className={
                      isActive
                        ? "text-green-700 dark:text-green-500"
                        : "text-black/70 dark:text-white/70"
                    }
                  />
                  <span
                    className={`font-medium text-sm font-plus-jakarta ${
                      isActive
                        ? "text-black dark:text-white"
                        : "text-black/70 dark:text-white/70"
                    }`}
                  >
                    {item.name}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </nav>

      {/* Chat Button */}
      <div className="p-4">
        <button className="w-10 h-10 bg-white dark:bg-[#262626] rounded-full border border-[#DADADA] dark:border-[#404040] flex items-center justify-center transition-all duration-200 hover:bg-[#F8F8F8] dark:hover:bg-[#2A2A2A] hover:border-[#C0C0C0] dark:hover:border-[#505050] active:bg-[#F0F0F0] dark:active:bg-[#333333] active:scale-95">
          <MessageCircle
            size={18}
            className="text-black/70 dark:text-white/70"
          />
        </button>
      </div>
    </div>
  );

  const Header = () => (
    <div className="h-16 bg-[#F3F3F3] dark:bg-[#1A1A1A] flex items-center justify-between px-4 md:px-6 flex-shrink-0">
      {/* Left side */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="lg:hidden p-2 rounded-lg transition-all duration-150 hover:bg-[#F5F5F5] dark:hover:bg-[#1E1E1E] active:bg-[#EEEEEE] dark:active:bg-[#2A2A2A] active:scale-95"
        >
          <Menu size={20} className="text-[#4B4B4B] dark:text-[#B0B0B0]" />
        </button>
        <h1 className="text-xl md:text-2xl font-bold text-black dark:text-white tracking-tight font-inter">
          Admin Dashboard
        </h1>
      </div>

      {/* Right side */}
      <div className="flex items-center space-x-2 md:space-x-4">
        {/* Search */}
        <div className="relative hidden md:block">
          <input
            type="text"
            placeholder="Search anything…"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-[200px] h-10 pl-10 pr-4 rounded-full bg-white dark:bg-[#1E1E1E] border border-[#E5E5E5] dark:border-[#333333] transition-all duration-200 font-inter text-sm text-black dark:text-white placeholder-[#6E6E6E] dark:placeholder-[#888888] focus:border-green-700 dark:focus:border-green-500"
          />
          <Search
            size={16}
            className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-[#6E6E6E] dark:text-[#888888]"
          />
        </div>

        <button className="w-10 h-10 rounded-full bg-white dark:bg-[#1E1E1E] border border-[#E5E5E5] dark:border-[#333333] flex items-center justify-center transition-all duration-150 hover:bg-[#F8F8F8] dark:hover:bg-[#262626] active:scale-95">
          <Bell size={18} className="text-[#4B4B4B] dark:text-[#B0B0B0]" />
        </button>

        <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
          <span className="text-green-700 font-bold text-sm">AD</span>
        </div>
      </div>
    </div>
  );

  const DashboardOverview = () => (
    <div className="p-4 md:p-8">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white dark:bg-[#1E1E1E] rounded-xl border border-[#E6E6E6] dark:border-[#333333] p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <ShoppingBag className="w-5 h-5 text-green-700" />
            </div>
            <span className="font-semibold text-gray-700 dark:text-gray-300 font-inter">
              Total Revenue
            </span>
          </div>
          <div className="flex items-end gap-2">
            <span className="font-bold text-2xl text-black dark:text-white font-sora">
              ${totalRevenue.toFixed(2)}
            </span>
            <span className="text-green-600 text-sm font-medium">+12.5%</span>
          </div>
        </div>

        <div className="bg-white dark:bg-[#1E1E1E] rounded-xl border border-[#E6E6E6] dark:border-[#333333] p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <ShoppingBag className="w-5 h-5 text-blue-700" />
            </div>
            <span className="font-semibold text-gray-700 dark:text-gray-300 font-inter">
              Orders
            </span>
          </div>
          <div className="flex items-end gap-2">
            <span className="font-bold text-2xl text-black dark:text-white font-sora">
              {totalOrders}
            </span>
            <span className="text-green-600 text-sm font-medium">+8.2%</span>
          </div>
        </div>

        <div className="bg-white dark:bg-[#1E1E1E] rounded-xl border border-[#E6E6E6] dark:border-[#333333] p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <Users className="w-5 h-5 text-purple-700" />
            </div>
            <span className="font-semibold text-gray-700 dark:text-gray-300 font-inter">
              Customers
            </span>
          </div>
          <div className="flex items-end gap-2">
            <span className="font-bold text-2xl text-black dark:text-white font-sora">
              {totalCustomers}
            </span>
            <span className="text-green-600 text-sm font-medium">+15.1%</span>
          </div>
        </div>

        <div className="bg-white dark:bg-[#1E1E1E] rounded-xl border border-[#E6E6E6] dark:border-[#333333] p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
              <Package className="w-5 h-5 text-orange-700" />
            </div>
            <span className="font-semibold text-gray-700 dark:text-gray-300 font-inter">
              Products
            </span>
          </div>
          <div className="flex items-end gap-2">
            <span className="font-bold text-2xl text-black dark:text-white font-sora">
              {totalProducts}
            </span>
            <span className="text-green-600 text-sm font-medium">+5.3%</span>
          </div>
        </div>
      </div>

      {/* Recent Orders */}
      <div className="bg-white dark:bg-[#1E1E1E] rounded-xl border border-[#E6E6E6] dark:border-[#333333] p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-black dark:text-white font-sora">
            Recent Orders
          </h2>
          <button className="text-green-700 hover:text-green-800 font-medium font-inter">
            View All
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <th className="text-left py-3 px-4 font-semibold text-gray-700 dark:text-gray-300 font-inter">
                  Order ID
                </th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700 dark:text-gray-300 font-inter">
                  Customer
                </th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700 dark:text-gray-300 font-inter">
                  Total
                </th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700 dark:text-gray-300 font-inter">
                  Status
                </th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700 dark:text-gray-300 font-inter">
                  Date
                </th>
              </tr>
            </thead>
            <tbody>
              {orders.slice(0, 5).map((order) => (
                <tr
                  key={order.id}
                  className="border-b border-gray-100 dark:border-gray-800"
                >
                  <td className="py-3 px-4 font-medium text-black dark:text-white font-inter">
                    #{order.id}
                  </td>
                  <td className="py-3 px-4 text-gray-700 dark:text-gray-300 font-inter">
                    {order.first_name} {order.last_name}
                  </td>
                  <td className="py-3 px-4 font-semibold text-black dark:text-white font-sora">
                    ${order.total_amount}
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        order.status === "completed"
                          ? "bg-green-100 text-green-700"
                          : order.status === "pending"
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {order.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-gray-700 dark:text-gray-300 font-inter">
                    {new Date(order.created_at).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const ProductsManagement = () => (
    <div className="p-4 md:p-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-black dark:text-white font-sora">
          Product Management
        </h2>
        <button className="bg-green-700 text-white px-4 py-2 rounded-lg font-semibold hover:bg-green-800 transition-colors duration-200 flex items-center gap-2 font-inter">
          <Plus className="w-4 h-4" />
          Add Product
        </button>
      </div>

      <div className="bg-white dark:bg-[#1E1E1E] rounded-xl border border-[#E6E6E6] dark:border-[#333333] p-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product) => (
            <div
              key={product.id}
              className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:border-green-500 transition-all duration-200"
            >
              <div className="aspect-square rounded-lg overflow-hidden mb-3">
                <img
                  src={product.image_url}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="font-semibold text-black dark:text-white mb-1 font-inter">
                {product.name}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2 font-inter">
                {product.brand}
              </p>
              <div className="flex justify-between items-center mb-3">
                <span className="font-bold text-green-700 font-sora">
                  ${product.price}
                </span>
                <span className="text-sm text-gray-500 font-inter">
                  Stock: {product.stock_quantity}
                </span>
              </div>
              <div className="flex gap-2">
                <button className="flex-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-3 py-1.5 rounded text-sm hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-200 flex items-center justify-center gap-1">
                  <Eye className="w-3 h-3" />
                  View
                </button>
                <button className="flex-1 bg-green-100 text-green-700 px-3 py-1.5 rounded text-sm hover:bg-green-200 transition-colors duration-200 flex items-center justify-center gap-1">
                  <Edit className="w-3 h-3" />
                  Edit
                </button>
                <button className="bg-red-100 text-red-700 px-3 py-1.5 rounded text-sm hover:bg-red-200 transition-colors duration-200 flex items-center justify-center">
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case "Dashboard":
        return <DashboardOverview />;
      case "Products":
        return <ProductsManagement />;
      default:
        return <DashboardOverview />;
    }
  };

  return (
    <div className="flex h-screen bg-[#F3F3F3] dark:bg-[#0A0A0A]">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 dark:bg-black dark:bg-opacity-70 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`
        fixed lg:static inset-y-0 left-0 z-50 lg:z-auto
        transform ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
        lg:translate-x-0 transition-transform duration-300 ease-in-out
      `}
      >
        <Sidebar />
      </div>

      {/* Main content area */}
      <div className="flex-1 flex flex-col min-w-0">
        <Header />
        <div className="flex-1 overflow-y-auto">{renderContent()}</div>
      </div>
    </div>
  );
}
