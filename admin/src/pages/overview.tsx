import React, { useEffect, useState } from 'react'
import { 
  Package, 
  AlertTriangle, 
  XCircle, 
  DollarSign,
  TrendingUp,
  TrendingDown,
  RefreshCw,
  MoreVertical,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface StatsData {
  totalProducts: number;
  lowStockCount: number;
  outOfStockCount: number;
  totalStockValue: number;
  avgPrice: number;
  totalTransactions?: number;
  lastUpdated: string;
}

interface TrendData {
  totalProducts: { current: number; previous: number; trend: 'up' | 'down' | 'stable' };
  lowStockCount: { current: number; previous: number; trend: 'up' | 'down' | 'stable' };
  outOfStockCount: { current: number; previous: number; trend: 'up' | 'down' | 'stable' };
  totalStockValue: { current: number; previous: number; trend: 'up' | 'down' | 'stable' };
}

const Overview = () => {
  const [stats, setStats] = useState<StatsData>({
    totalProducts: 0,
    lowStockCount: 0,
    outOfStockCount: 0,
    totalStockValue: 0,
    avgPrice: 0,
    totalTransactions: 0,
    lastUpdated: new Date().toISOString()
  });
  
  const [trends, setTrends] = useState<TrendData>({
    totalProducts: { current: 0, previous: 0, trend: 'stable' },
    lowStockCount: { current: 0, previous: 0, trend: 'stable' },
    outOfStockCount: { current: 0, previous: 0, trend: 'stable' },
    totalStockValue: { current: 0, previous: 0, trend: 'stable' }
  });
  
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const calculateTrend = (current: number, previous: number): 'up' | 'down' | 'stable' => {
    if (current > previous) return 'up';
    if (current < previous) return 'down';
    return 'stable';
  };

  const fetchStats = async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else setLoading(true);
    
    try {
      // Fetch products to calculate stats
      const productsResponse = await fetch('https://localhost:7192/api/products');
      if (!productsResponse.ok) throw new Error('Failed to fetch products');
      const products = await productsResponse.json();
      
      // Calculate statistics from products
      const totalProducts = products.length;
      const lowStockCount = products.filter((p: any) => p.currentStock > 0 && p.currentStock <= 10).length;
      const outOfStockCount = products.filter((p: any) => p.currentStock === 0).length;
      const totalStockValue = products.reduce((sum: number, p: any) => 
        sum + (p.currentStock * p.price), 0);
      const avgPrice = products.length > 0 
        ? products.reduce((sum: number, p: any) => sum + p.price, 0) / products.length 
        : 0;
      
      // Update trends
      setTrends(prev => ({
        totalProducts: { 
          current: totalProducts, 
          previous: prev.totalProducts.current || totalProducts,
          trend: calculateTrend(totalProducts, prev.totalProducts.current || totalProducts)
        },
        lowStockCount: { 
          current: lowStockCount, 
          previous: prev.lowStockCount.current || lowStockCount,
          trend: calculateTrend(lowStockCount, prev.lowStockCount.current || lowStockCount)
        },
        outOfStockCount: { 
          current: outOfStockCount, 
          previous: prev.outOfStockCount.current || outOfStockCount,
          trend: calculateTrend(outOfStockCount, prev.outOfStockCount.current || outOfStockCount)
        },
        totalStockValue: { 
          current: totalStockValue, 
          previous: prev.totalStockValue.current || totalStockValue,
          trend: calculateTrend(totalStockValue, prev.totalStockValue.current || totalStockValue)
        }
      }));
      
      setStats({
        totalProducts,
        lowStockCount,
        outOfStockCount,
        totalStockValue,
        avgPrice,
        lastUpdated: new Date().toISOString()
      });
    } catch (error) {
      console.error('Error fetching statistics:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchStats();
    
    // Refresh data every 30 seconds
    const interval = setInterval(() => fetchStats(true), 30000);
    return () => clearInterval(interval);
  }, []);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount);
  };

  const TrendIndicator = ({ trend, value }: { trend: 'up' | 'down' | 'stable', value: number }) => {
    const isPositive = trend === 'up';
    const isNegative = trend === 'down';
    
    if (trend === 'stable') return null;
    
    return (
      <Badge 
        variant="outline" 
        className={`ml-2 text-xs ${isPositive ? 'bg-green-50 text-green-700 border-green-200' : 'bg-red-50 text-red-700 border-red-200'}`}
      >
        {isPositive ? <ArrowUpRight className="h-3 w-3 mr-1" /> : <ArrowDownRight className="h-3 w-3 mr-1" />}
        {value.toFixed(1)}%
      </Badge>
    );
  };

  const calculatePercentageChange = (current: number, previous: number) => {
    if (previous === 0) return 0;
    return ((current - previous) / previous) * 100;
  };

  const StatCard = ({ 
    title, 
    value, 
    icon: Icon, 
    trend,
    previousValue,
    loading,
    className = '',
    description = ''
  }: any) => {
    const percentageChange = calculatePercentageChange(value, previousValue);
    
    return (
      <Card className={`relative overflow-hidden group hover:shadow-lg transition-all duration-300 ${className}`}>
        {/* Gradient background overlay on hover */}
        <div className="absolute inset-0 bg-gradient-to-br from-transparent to-transparent group-hover:to-primary/5 transition-all duration-300"></div>
        
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            {title}
          </CardTitle>
          <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors duration-300">
            <Icon className="h-4 w-4 text-primary" />
          </div>
        </CardHeader>
        
        <CardContent>
          {loading ? (
            <div className="space-y-2">
              <Skeleton className="h-7 w-24" />
              <Skeleton className="h-4 w-16" />
            </div>
          ) : (
            <>
              <div className="text-2xl font-bold">
                {title.includes('Value') ? formatCurrency(value) : value}
              </div>
              <div className="flex items-center mt-1">
                <p className="text-xs text-muted-foreground">
                  {description}
                </p>
                {trend !== 'stable' && previousValue > 0 && (
                  <TrendIndicator 
                    trend={trend} 
                    value={Math.abs(percentageChange)}
                  />
                )}
              </div>
            </>
          )}
          
          {/* Trend indicator line */}
          {trend !== 'stable' && !loading && (
            <div className={`absolute bottom-0 left-0 right-0 h-1 ${
              trend === 'up' ? 'bg-gradient-to-r from-green-400 to-green-300' : 
              trend === 'down' ? 'bg-gradient-to-r from-red-400 to-red-300' : 
              'bg-gray-300'
            }`}></div>
          )}
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header with refresh button */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Dashboard Overview</h2>
          <p className="text-muted-foreground">
            Real-time insights into your inventory
            {!loading && (
              <span className="ml-2 text-xs">
                • Updated {new Date(stats.lastUpdated).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            )}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => fetchStats(true)}
            disabled={refreshing}
            className="gap-2"
          >
            <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
            {refreshing ? 'Refreshing...' : 'Refresh'}
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>Export Report</DropdownMenuItem>
              <DropdownMenuItem>View Detailed Analytics</DropdownMenuItem>
              <DropdownMenuItem>Set Alerts</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Main Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Products"
          value={stats.totalProducts}
          icon={Package}
          trend={trends.totalProducts.trend}
          previousValue={trends.totalProducts.previous}
          loading={loading}
          description="Active items in inventory"
        />
        
        <StatCard
          title="Low Stock"
          value={stats.lowStockCount}
          icon={AlertTriangle}
          trend={trends.lowStockCount.trend}
          previousValue={trends.lowStockCount.previous}
          loading={loading}
          description="Items with ≤ 10 units"
          className="border-amber-200"
        />
        
        <StatCard
          title="Out of Stock"
          value={stats.outOfStockCount}
          icon={XCircle}
          trend={trends.outOfStockCount.trend}
          previousValue={trends.outOfStockCount.previous}
          loading={loading}
          description="Items requiring restock"
          className="border-red-200"
        />
        
        <StatCard
          title="Stock Value"
          value={stats.totalStockValue}
          icon={DollarSign}
          trend={trends.totalStockValue.trend}
          previousValue={trends.totalStockValue.previous}
          loading={loading}
          description="Total inventory worth"
          className="border-green-200"
        />
      </div>

      {/* Additional Insights */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-green-500" />
              Average Product Price
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-7 w-24" />
            ) : (
              <div className="text-2xl font-bold">
                {formatCurrency(stats.avgPrice)}
              </div>
            )}
            <p className="text-xs text-muted-foreground mt-2">
              Mean price across all products
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Package className="h-4 w-4 text-blue-500" />
              Stock Health
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-3 w-full" />
            ) : (
              <>
                <div className="flex items-center justify-between text-sm mb-1">
                  <span>In Stock</span>
                  <span>{stats.totalProducts - stats.outOfStockCount}/{stats.totalProducts}</span>
                </div>
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-green-400 to-emerald-500 rounded-full transition-all duration-500"
                    style={{ 
                      width: `${stats.totalProducts > 0 ? ((stats.totalProducts - stats.outOfStockCount) / stats.totalProducts) * 100 : 0}%` 
                    }}
                  ></div>
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  {stats.outOfStockCount === 0 ? 'All products are in stock' : `${stats.outOfStockCount} products need restocking`}
                </p>
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <TrendingDown className="h-4 w-4 text-amber-500" />
              Low Stock Alert
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-7 w-24" />
            ) : (
              <div className={`text-2xl font-bold ${stats.lowStockCount > 0 ? 'text-amber-600' : 'text-green-600'}`}>
                {stats.lowStockCount > 0 ? `${stats.lowStockCount} items` : 'All Good'}
              </div>
            )}
            <p className="text-xs text-muted-foreground mt-2">
              {stats.lowStockCount > 0 
                ? 'Consider restocking these items soon'
                : 'No items are running low on stock'
              }
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium">Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <Button variant="outline" className="flex flex-col h-auto py-3 gap-2 hover:bg-primary/5">
              <Package className="h-5 w-5" />
              <span className="text-xs">Add Product</span>
            </Button>
            <Button variant="outline" className="flex flex-col h-auto py-3 gap-2 hover:bg-amber-50">
              <AlertTriangle className="h-5 w-5 text-amber-500" />
              <span className="text-xs">View Low Stock</span>
            </Button>
            <Button variant="outline" className="flex flex-col h-auto py-3 gap-2 hover:bg-green-50">
              <DollarSign className="h-5 w-5 text-green-500" />
              <span className="text-xs">Generate Report</span>
            </Button>
            <Button variant="outline" className="flex flex-col h-auto py-3 gap-2 hover:bg-blue-50">
              <RefreshCw className="h-5 w-5 text-blue-500" />
              <span className="text-xs">Restock Items</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default Overview