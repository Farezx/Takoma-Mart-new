import React, { useEffect, useState } from 'react'
import { 
  Package, 
  AlertTriangle, 
  XCircle, 
  DollarSign,
  TrendingUp,
  RefreshCw,
  MoreHorizontal,
  ArrowUpRight,
  ArrowDownRight,
  Plus,
  FileText,
  Boxes
} from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"


// --- Types ---
interface StatsData {
  totalProducts: number;
  lowStockCount: number;
  outOfStockCount: number;
  totalStockValue: number;
  avgPrice: number;
  lastUpdated: string;
}

const Overview = () => {
  const [stats, setStats] = useState<StatsData>({
    totalProducts: 0,
    lowStockCount: 0,
    outOfStockCount: 0,
    totalStockValue: 0,
    avgPrice: 0,
    lastUpdated: new Date().toISOString()
  });
  
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchStats = async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else setLoading(true);
    
    try {
      const response = await fetch('https://localhost:7192/api/products');
      const products = await response.json();
      
      setStats({
        totalProducts: products.length,
        lowStockCount: products.filter((p: any) => p.currentStock > 0 && p.currentStock <= 10).length,
        outOfStockCount: products.filter((p: any) => p.currentStock === 0).length,
        totalStockValue: products.reduce((sum: number, p: any) => sum + (p.currentStock * p.price), 0),
        avgPrice: products.length > 0 ? products.reduce((sum: number, p: any) => sum + p.price, 0) / products.length : 0,
        lastUpdated: new Date().toISOString()
      });
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchStats();
    const interval = setInterval(() => fetchStats(true), 30000);
    return () => clearInterval(interval);
  }, []);

  const formatCurrency = (val: number) => 
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(val);

  return (
    <div className="max-w-[1400px] mx-auto space-y-8 p-2">
      
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Inventory Insights</h1>
          <p className="text-slate-500 text-sm mt-1">
            Real-time monitoring of your stock levels and valuation.
            {stats.lastUpdated && (
              <span className="ml-2 font-medium text-primary/80 italic">
                Updated {new Date(stats.lastUpdated).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            )}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => fetchStats(true)} 
            disabled={refreshing}
            className="rounded-full px-4 shadow-sm border-slate-200"
          >
            <RefreshCw className={`h-3.5 w-3.5 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
            Sync Data
          </Button>
          <Button size="sm" className="rounded-full px-4 shadow-md bg-slate-900 hover:bg-slate-800">
            <Plus className="h-4 w-4 mr-2" />
            Add Product
          </Button>
        </div>
      </div>

      {/* Primary Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          label="Total Inventory" 
          value={stats.totalProducts} 
          icon={<Package className="w-5 h-5 text-blue-600" />}
          loading={loading}
          subtitle="Unique SKUs"
          color="blue"
        />
        <StatCard 
          label="Stock Valuation" 
          value={formatCurrency(stats.totalStockValue)} 
          icon={<DollarSign className="w-5 h-5 text-emerald-600" />}
          loading={loading}
          subtitle="Current assets"
          color="emerald"
        />
        <StatCard 
          label="Low Stock" 
          value={stats.lowStockCount} 
          icon={<AlertTriangle className="w-5 h-5 text-amber-600" />}
          loading={loading}
          subtitle="Needs attention"
          color="amber"
          warning={stats.lowStockCount > 0}
        />
        <StatCard 
          label="Out of Stock" 
          value={stats.outOfStockCount} 
          icon={<XCircle className="w-5 h-5 text-rose-600" />}
          loading={loading}
          subtitle="Immediate action"
          color="rose"
          warning={stats.outOfStockCount > 0}
        />
        
      </div>

      {/* Secondary Insights & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Stock Health Progress */}
        <Card className="lg:col-span-2 overflow-hidden border-slate-100 shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-semibold text-slate-800">Operational Health</h3>
              <Badge variant="secondary" className="bg-slate-100 text-slate-600 border-none font-medium">
                Live Status
              </Badge>
            </div>
            
            <div className="space-y-6">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-slate-500 font-medium">Stock Availability</span>
                  <span className="text-slate-900 font-bold">
                    {Math.round(((stats.totalProducts - stats.outOfStockCount) / stats.totalProducts) * 100) || 0}%
                  </span>
                </div>
                <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-slate-900 transition-all duration-1000 ease-out"
                    style={{ width: `${((stats.totalProducts - stats.outOfStockCount) / stats.totalProducts) * 100}%` }}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-50">
                <div>
                  <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Avg. Unit Price</p>
                  <p className="text-xl font-bold text-slate-900 mt-1">{formatCurrency(stats.avgPrice)}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Stock Coverage</p>
                  <p className="text-xl font-bold text-slate-900 mt-1">Excellent</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions List */}
        <Card className="border-slate-100 shadow-sm bg-slate-50/50">
          <CardContent className="p-6">
            <h3 className="font-semibold text-slate-800 mb-4">Management Tasks</h3>
            <div className="space-y-3">
              <ActionButton icon={<FileText className="w-4 h-4" />} label="Generate Stock Report" />
              <ActionButton icon={<Boxes className="w-4 h-4" />} label="Bulk Restock Items" />
              <ActionButton icon={<TrendingUp className="w-4 h-4" />} label="Price Analysis" />
              <ActionButton icon={<MoreHorizontal className="w-4 h-4" />} label="System Settings" />
            </div>
          </CardContent>
        </Card>

      </div>
    </div>
  )
}

// --- Sub-Components for Cleanliness ---

const StatCard = ({ label, value, icon, loading, subtitle, color, warning }: any) => (
  <Card className="border-slate-100 shadow-sm hover:shadow-md transition-shadow group overflow-hidden relative">
    {warning && value > 0 && (
      <div className={`absolute top-0 right-0 w-16 h-16 -mr-8 -mt-8 bg-${color}-500/10 rounded-full blur-2xl group-hover:bg-${color}-500/20 transition-all`} />
    )}
    <CardContent className="p-2">
      <div className="flex items-center gap-4">
        <div className={`p-3 rounded-2xl bg-slate-50 group-hover:scale-110 transition-transform duration-300`}>
          {icon}
        </div>
        <div>
          <p className="text-sm font-medium text-slate-500">{label}</p>
          {loading ? (
            <Skeleton className="h-8 w-20 mt-1" />
          ) : (
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight">{value}</h2>
          )}
          {/* <p className="text-[11px] font-medium text-slate-400 uppercase tracking-tight mt-1">{subtitle}</p> */}
        </div>
      </div>
    </CardContent>
  </Card>
)

const ActionButton = ({ icon, label }: { icon: React.ReactNode, label: string }) => (
  <button className="w-full flex items-center justify-between p-3 rounded-xl bg-white border border-slate-200 hover:border-slate-300 hover:shadow-sm transition-all text-left group">
    <div className="flex items-center gap-3">
      <div className="text-slate-400 group-hover:text-slate-900 transition-colors">
        {icon}
      </div>
      <span className="text-sm font-medium text-slate-600 group-hover:text-slate-900">{label}</span>
    </div>
    <ArrowUpRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-slate-900 transition-colors" />
  </button>
)

export default Overview