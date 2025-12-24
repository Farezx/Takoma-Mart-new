// layout.tsx or your main layout component
"use client"

import { AppSidebar } from "@/components/app-sidebar"
import { 
  Breadcrumb, 
  BreadcrumbItem, 
  BreadcrumbLink, 
  BreadcrumbList, 
  BreadcrumbPage, 
  BreadcrumbSeparator 
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import { 
  SidebarInset, 
  SidebarProvider, 
  SidebarTrigger 
} from "@/components/ui/sidebar"
import { Outlet, useLocation } from "react-router"
import { useEffect, useState } from "react"
import { 
  Bell, 
  Search, 
  HelpCircle, 
  Settings,
  ChevronRight,
  Package,
  ShoppingCart,
  AlertCircle,
  Plus,
  Download,
  Database,
  Clock
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

// Breadcrumb mapping based on route
const getBreadcrumbItems = (pathname: string) => {
  const pathSegments = pathname.split('/').filter(segment => segment)
  
  if (pathSegments.length === 0) {
    return [
      { title: "Dashboard", href: "/" },
    ]
  }

  const items = [{ title: "Dashboard", href: "/" }]
  
  pathSegments.forEach((segment, index) => {
    const href = `/${pathSegments.slice(0, index + 1).join('/')}`
    const title = segment.charAt(0).toUpperCase() + segment.slice(1).replace('-', ' ')
    items.push({ title, href })
  })

  return items
}

export default function Page() {
  const location = useLocation()
  const [breadcrumbItems, setBreadcrumbItems] = useState<Array<{title: string, href: string}>>([])
  const [pageTitle, setPageTitle] = useState("")
  const [notifications] = useState(3)

  useEffect(() => {
    const items = getBreadcrumbItems(location.pathname)
    setBreadcrumbItems(items)
    setPageTitle(items[items.length - 1]?.title || "Dashboard")
  }, [location.pathname])

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
        {/* Modern Header */}
        <header className="sticky top-0 z-50 flex h-16 shrink-0 items-center justify-between gap-2 border-b border-gray-200 bg-white/80 backdrop-blur-sm transition-all duration-300 group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 px-4 md:px-6">
          <div className="flex items-center gap-4">
            <SidebarTrigger className="-ml-1 transition-all duration-200 hover:bg-gray-100 hover:scale-105" />
            <Separator
              orientation="vertical"
              className="mr-2 data-[orientation=vertical]:h-6 hidden sm:block"
            />
            
            {/* Breadcrumb with animated chevrons */}
            <Breadcrumb className="hidden md:block">
              <BreadcrumbList className="flex items-center gap-1">
                {breadcrumbItems.map((item, index) => (
                  <BreadcrumbItem key={item.href} className="flex items-center">
                    {index > 0 && (
                      <ChevronRight className="h-3 w-3 text-gray-400 mx-1" />
                    )}
                    {index === breadcrumbItems.length - 1 ? (
                      <BreadcrumbPage className="text-sm font-semibold text-gray-900">
                        {item.title}
                      </BreadcrumbPage>
                    ) : (
                      <BreadcrumbLink 
                        href={item.href}
                        className="text-sm text-gray-600 hover:text-gray-900 transition-colors duration-200"
                      >
                        {item.title}
                      </BreadcrumbLink>
                    )}
                  </BreadcrumbItem>
                ))}
              </BreadcrumbList>
            </Breadcrumb>

            {/* Mobile breadcrumb */}
            <div className="md:hidden">
              <h1 className="text-sm font-semibold text-gray-900 truncate max-w-[150px]">
                {pageTitle}
              </h1>
            </div>
          </div>

          {/* Right side actions */}
          <div className="flex items-center gap-3">
            {/* Search */}
            <div className="relative hidden md:block">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <Input
                type="search"
                placeholder="Search products, orders..."
                className="pl-9 w-[200px] lg:w-[300px] border-gray-300 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200"
              />
            </div>

            {/* Help */}
            <Button
              variant="ghost"
              size="icon"
              className="hidden sm:flex rounded-full hover:bg-gray-100 transition-all duration-200"
              title="Help"
            >
              <HelpCircle className="h-5 w-5 text-gray-600" />
            </Button>

            {/* Notifications */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="relative rounded-full hover:bg-gray-100 transition-all duration-200"
                >
                  <Bell className="h-5 w-5 text-gray-600" />
                  {notifications > 0 && (
                    <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs border-2 border-white">
                      {notifications}
                    </Badge>
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-80">
                <DropdownMenuLabel>Notifications</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="cursor-pointer hover:bg-gray-50">
                  <div className="flex gap-3">
                    <div className="rounded-full bg-blue-100 p-2">
                      <Package className="h-4 w-4 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium text-sm">Low stock alert</p>
                      <p className="text-xs text-gray-500">5 products are running low</p>
                    </div>
                  </div>
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer hover:bg-gray-50">
                  <div className="flex gap-3">
                    <div className="rounded-full bg-green-100 p-2">
                      <ShoppingCart className="h-4 w-4 text-green-600" />
                    </div>
                    <div>
                      <p className="font-medium text-sm">New order received</p>
                      <p className="text-xs text-gray-500">Order #1234 from John Doe</p>
                    </div>
                  </div>
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer hover:bg-gray-50">
                  <div className="flex gap-3">
                    <div className="rounded-full bg-amber-100 p-2">
                      <AlertCircle className="h-4 w-4 text-amber-600" />
                    </div>
                    <div>
                      <p className="font-medium text-sm">System update</p>
                      <p className="text-xs text-gray-500">New features available</p>
                    </div>
                  </div>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Settings */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-full hover:bg-gray-100 transition-all duration-200"
                >
                  <Settings className="h-5 w-5 text-gray-600" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Settings</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Profile</DropdownMenuItem>
                <DropdownMenuItem>Billing</DropdownMenuItem>
                <DropdownMenuItem>Team</DropdownMenuItem>
                <DropdownMenuItem>Subscription</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-red-600">Log out</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* User Avatar */}
            <div className="hidden md:flex items-center gap-3">
              <Separator orientation="vertical" className="h-6" />
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-full bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center text-white font-semibold text-sm">
                  AU
                </div>
                <div className="hidden lg:block">
                  <p className="text-sm font-medium">Admin User</p>
                  <p className="text-xs text-gray-500">Administrator</p>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content Area with modern styling */}
        <main className="flex-1 overflow-auto p-4 md:p-6">
          {/* Animated background elements */}
          <div className="absolute inset-0 -z-10 h-full w-full bg-white bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] opacity-30"></div>
          
          {/* Content container with glass effect */}
          <div className="relative min-h-[calc(100vh-5rem)]">
            {/* Floating elements for visual interest */}
            <div className="absolute -top-10 -right-10 h-40 w-40 rounded-full bg-gradient-to-r from-primary/5 to-blue-500/5 blur-3xl"></div>
            <div className="absolute bottom-10 -left-10 h-60 w-60 rounded-full bg-gradient-to-r from-emerald-500/5 to-teal-500/5 blur-3xl"></div>
            
            {/* Main content card */}
            <div className="relative rounded-2xl bg-white/70 backdrop-blur-sm border border-gray-200/50 shadow-sm overflow-hidden">
              {/* Gradient top border */}
              <div className="h-1 w-full bg-gradient-to-r from-primary via-blue-500 to-emerald-500"></div>
              
              {/* Page header with gradient */}
              <div className="px-6 py-4 border-b border-gray-200/50 bg-gradient-to-r from-gray-50 to-white">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div>
                    <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                      {pageTitle}
                    </h1>
                    <p className="text-gray-600 mt-1">
                      {pageTitle === "Dashboard" 
                        ? "Welcome to your inventory management dashboard" 
                        : `Manage your ${pageTitle.toLowerCase()} efficiently`
                      }
                    </p>
                  </div>
                  
                  {/* Quick actions based on page */}
                  {pageTitle === "Products" && (
                    <Button className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 transition-all duration-300 shadow-md hover:shadow-lg">
                      <Plus className="mr-2 h-4 w-4" />
                      Add New Product
                    </Button>
                  )}
                  
                  {pageTitle === "Dashboard" && (
                    <div className="flex gap-2">
                      <Button variant="outline" className="border-gray-300 hover:bg-gray-50">
                        <Download className="mr-2 h-4 w-4" />
                        Export
                      </Button>
                      <Button className="bg-gradient-to-r from-primary to-primary/80">
                        Generate Report
                      </Button>
                    </div>
                  )}
                </div>
              </div>
              
              {/* Content area with subtle pattern */}
              <div className="relative bg-gradient-to-b from-white via-white to-gray-50/30 min-h-[calc(100vh-12rem)]">
                {/* Subtle grid pattern overlay */}
                <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0wIDBoNjB2NjBIMHoiLz48cGF0aCBkPSJNMzAgMzBoMzB2MzBIMzB6IiBmaWxsPSJyZ2JhKDAgMCAwIDAuMDIpIi8+PC9nPjwvc3ZnPg==')] opacity-20"></div>
                
                {/* Main content */}
                <div className="relative z-10 p-6">
                  <Outlet />
                </div>
              </div>
              
              {/* Bottom stats bar */}
              <div className="border-t border-gray-200/50 bg-white px-6 py-3">
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <div className="flex items-center gap-4">
                    <span className="flex items-center gap-1">
                      <Database className="h-3 w-3" />
                      <span>Total: <strong className="text-gray-700">1,234</strong> items</span>
                    </span>
                    <span className="hidden md:inline">•</span>
                    <span className="hidden md:flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      <span>Updated: <strong className="text-gray-700">Just now</strong></span>
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs">
                      v2.1.0
                    </Badge>
                    <span className="hidden sm:inline text-xs">
                      Inventory Management System
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>

        {/* Floating Action Button */}
        <button className="fixed bottom-6 right-6 h-14 w-14 rounded-full bg-gradient-to-r from-primary to-primary/80 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 flex items-center justify-center text-white z-40">
          <Plus className="h-6 w-6" />
        </button>
      </SidebarInset>
    </SidebarProvider>
  )
}