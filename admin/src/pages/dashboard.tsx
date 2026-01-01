
import { AppSidebar } from "@/components/app-sidebar"
import { 
  Breadcrumb, 
  BreadcrumbItem, 
  BreadcrumbLink, 
  BreadcrumbList, 
  BreadcrumbPage 
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
  Database,
  Clock,
  Command
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

export default function Page() {
  const location = useLocation()
  const [breadcrumbItems, setBreadcrumbItems] = useState<Array<{title: string, href: string}>>([])
  
  useEffect(() => {
    const pathSegments = location.pathname.split('/').filter(Boolean)
    const items = [{ title: "Home", href: "/" }]
    pathSegments.forEach((segment, index) => {
      const href = `/${pathSegments.slice(0, index + 1).join('/')}`
      items.push({ title: segment.charAt(0).toUpperCase() + segment.slice(1), href })
    })
    setBreadcrumbItems(items)
  }, [location.pathname])

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className="bg-[#fcfcfd]">
        {/* Modern Floating Header */}
        <header className="sticky top-0 z-40 flex h-16 shrink-0 items-center justify-between px-6 bg-white/60 backdrop-blur-xl border-b border-slate-200/60">
          <div className="flex items-center gap-4">
            <SidebarTrigger className="hover:bg-slate-100 transition-colors" />
            <Separator orientation="vertical" className="h-4 bg-slate-200" />
            
            <Breadcrumb className="hidden md:block">
              <BreadcrumbList className="gap-0.5 text-[13px] font-medium">
                {breadcrumbItems.map((item, index) => (
                  <BreadcrumbItem key={item.href}>
                    {index !== 0 && <ChevronRight className="h-3.5 w-3.5 text-slate-400 mx-1" />}
                    {index === breadcrumbItems.length - 1 ? (
                      <BreadcrumbPage className="text-slate-900 font-semibold">{item.title}</BreadcrumbPage>
                    ) : (
                      <BreadcrumbLink href={item.href} className="text-slate-500 hover:text-slate-900 transition-colors">
                        {item.title}
                      </BreadcrumbLink>
                    )}
                  </BreadcrumbItem>
                ))}
              </BreadcrumbList>
            </Breadcrumb>
          </div>

          <div className="flex items-center gap-4">
            {/* Search Command Bar */}
            <div className="relative hidden lg:flex items-center group">
              <Search className="absolute left-3 h-4 w-4 text-slate-400 group-focus-within:text-slate-900 transition-colors" />
              <Input
                placeholder="Search..."
                className="pl-9 w-[260px] bg-slate-100/50 border-none focus-visible:ring-1 focus-visible:ring-slate-300 transition-all rounded-lg text-sm"
              />
              <kbd className="absolute right-3 hidden lg:inline-flex h-5 select-none items-center gap-1 rounded border bg-white px-1.5 font-mono text-[10px] font-medium text-slate-400 opacity-100">
                <span className="text-xs">⌘</span>K
              </kbd>
            </div>

            <div className="flex items-center gap-1.5">
              <HeaderAction icon={<Bell className="h-4 w-4" />} badge={3} />
              <HeaderAction icon={<HelpCircle className="h-4 w-4" />} />
              <HeaderAction icon={<Settings className="h-4 w-4" />} />
            </div>

            <Separator orientation="vertical" className="h-6 mx-2" />

            {/* Profile Section */}
            <div className="flex items-center gap-3 pl-2 cursor-pointer hover:opacity-80 transition-opacity">
              <div className="text-right hidden sm:block">
                <p className="text-[13px] font-semibold text-slate-900 leading-none">Admin User</p>
                <p className="text-[11px] text-slate-500 mt-1 font-medium">Administrator</p>
              </div>
              <div className="h-9 w-9 rounded-xl bg-slate-900 flex items-center justify-center text-white text-xs font-bold shadow-lg shadow-slate-200">
                AU
              </div>
            </div>
          </div>
        </header>

        {/* Dynamic Content Body */}
        <main className="relative flex-1 p-6 space-y-6">
          {/* Subtle Background Mesh */}
          <div className="absolute inset-0 -z-10 overflow-hidden">
            <div className="absolute -top-[10%] -right-[10%] h-[500px] w-[500px] rounded-full bg-slate-100/50 blur-[120px]" />
            <div className="absolute top-[40%] -left-[5%] h-[400px] w-[400px] rounded-full bg-blue-50/30 blur-[100px]" />
          </div>

          <div className="rounded-3xl border border-slate-200/60 bg-white/50 backdrop-blur-sm shadow-sm min-h-[calc(100vh-10rem)]">
            <div className="p-8">
              <Outlet />
            </div>
          </div>

          {/* Premium Footer Stats */}
          <footer className="flex items-center justify-between px-4 py-2 bg-slate-900 rounded-2xl text-white shadow-2xl">
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-[11px] font-medium uppercase tracking-wider text-slate-400">Database Live</span>
              </div>
              <div className="h-4 w-[1px] bg-slate-700" />
              <span className="text-xs text-slate-300 font-medium flex items-center gap-2">
                <Database className="h-3 w-3" /> 1,234 SKUs
              </span>
            </div>
            <div className="flex items-center gap-2">
               <Badge className="bg-slate-800 text-slate-400 border-none text-[10px]">v2.1.0-PRO</Badge>
            </div>
          </footer>
        </main>

        {/* Premium FAB */}
        <button className="fixed bottom-10 right-10 h-14 w-14 rounded-2xl bg-slate-900 text-white shadow-[0_20px_40px_rgba(0,0,0,0.2)] hover:scale-110 active:scale-95 transition-all flex items-center justify-center group z-50">
          <Plus className="h-6 w-6 group-hover:rotate-90 transition-transform duration-300" />
        </button>
      </SidebarInset>
    </SidebarProvider>
  )
}

function HeaderAction({ icon, badge }: { icon: React.ReactNode, badge?: number }) {
  return (
    <Button variant="ghost" size="icon" className="relative rounded-xl hover:bg-slate-100 text-slate-500 hover:text-slate-900 transition-all">
      {icon}
      {badge && (
        <span className="absolute top-2 right-2 h-2 w-2 bg-rose-500 rounded-full border-2 border-white" />
      )}
    </Button>
  )
}