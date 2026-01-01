// components/app-sidebar.tsx
"use client"
import * as React from "react"
import {
  Package,
  ShoppingCart,
  TrendingUp,
  BarChart3,
  Settings,
  Home,
  Users,
  FileText,
  Command,
} from "lucide-react"
import { NavMain } from "@/components/nav-main"
import { NavUser } from "@/components/nav-user"
import { TeamSwitcher } from "@/components/team-switcher"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"

// Updated data for inventory management system
const data = {
  user: {
    name: "Admin User",
    email: "admin@inventory.com",
    avatar: "/avatars/admin.jpg",
  },
  teams: [
    {
      name: "Inventory Pro",
      logo: Package,
      plan: "Enterprise",
    },
    {
      name: "Store Front",
      logo: ShoppingCart,
      plan: "Business",
    },
    {
      name: "Warehouse",
      logo: Home,
      plan: "Free",
    },
  ],
  navMain: [
    {
      title: "Dashboard",
      url: "/",
      icon: BarChart3,
      isActive: false,
      items: [
        {
          title: "Overview",
          url: "/",
        },
        {
          title: "Analytics",
          url: "/analytics",
        },
        {
          title: "Reports",
          url: "/reports",
        },
      ],
    },
    {
      title: "Products",
      url: "/products",
      icon: Package,
      isActive: true,
      items: [
        {
          title: "All Products",
          url: "/products",
        },
        {
          title: "Add New Product",
          url: "/products/add",
        },
        {
          title: "Categories",
          url: "/products/categories",
        },
        {
          title: "Low Stock",
          url: "/products/low-stock",
        },
      ],
    },
    {
      title: "Transactions",
      url: "/transactions",
      icon: TrendingUp,
      items: [
        {
          title: "Purchases",
          url: "/transactions/purchases",
        },
        {
          title: "Sales",
          url: "/transactions/sales",
        },
        {
          title: "Returns",
          url: "/transactions/returns",
        },
        {
          title: "History",
          url: "/transactions/history",
        },
      ],
    },
    {
      title: "Inventory",
      url: "/inventory",
      icon: ShoppingCart,
      items: [
        {
          title: "Stock Levels",
          url: "/inventory/stock",
        },
        {
          title: "Stock Alerts",
          url: "/inventory/alerts",
        },
        {
          title: "Stock Report",
          url: "/inventory/report",
        },
        {
          title: "Inventory Audit",
          url: "/inventory/audit",
        },
      ],
    },
    {
      title: "Suppliers",
      url: "/suppliers",
      icon: Users,
      items: [
        {
          title: "All Suppliers",
          url: "/suppliers",
        },
        {
          title: "Add Supplier",
          url: "/suppliers/new",
        },
        {
          title: "Supplier Orders",
          url: "/suppliers/orders",
        },
      ],
    },
    {
      title: "Customers",
      url: "/customers",
      icon: Users,
      items: [
        {
          title: "All Customers",
          url: "/customers",
        },
        {
          title: "Add Customer",
          url: "/customers/new",
        },
        {
          title: "Orders",
          url: "/customers/orders",
        },
      ],
    },
    {
      title: "Reports",
      url: "/reports",
      icon: FileText,
      items: [
        {
          title: "Sales Report",
          url: "/reports/sales",
        },
        {
          title: "Stock Report",
          url: "/reports/stock",
        },
        {
          title: "Profit & Loss",
          url: "/reports/profit-loss",
        },
        {
          title: "Export Data",
          url: "/reports/export",
        },
      ],
    },
    {
      title: "Settings",
      url: "/settings",
      icon: Settings,
      items: [
        {
          title: "General",
          url: "/settings/general",
        },
        {
          title: "Users",
          url: "/settings/users",
        },
        {
          title: "Notifications",
          url: "/settings/notifications",
        },
        {
          title: "Billing",
          url: "/settings/billing",
        },
      ],
    },
  ],
 
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" className="border-r-0 shadow-xl" {...props}>
      <SidebarHeader className="p-4">
        {/* Replaced standard switcher with a branded feel */}
        <div className="flex items-center gap-3 px-2 py-3 mb-2 rounded-2xl bg-slate-50 border border-slate-100">
          <div className="h-8 w-8 rounded-lg bg-slate-900 flex items-center justify-center text-white shrink-0">
            <Command className="h-5 w-5" />
          </div>
          <div className="flex-1 overflow-hidden group-data-[collapsible=icon]:hidden">
            <h2 className="text-sm font-bold text-slate-900 truncate">InventoryPro</h2>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Enterprise</p>
          </div>
        </div>
      </SidebarHeader>
      
      <SidebarContent className="px-2">
        <NavMain items={data.navMain} />
      </SidebarContent>

      <SidebarFooter className="p-4 bg-slate-50/50">
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}