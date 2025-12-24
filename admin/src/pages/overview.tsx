import React, { useEffect, useState } from 'react'

interface StatsData {
  totalProducts: number;
  lowStockCount: number;
  outOfStockCount: number;
  totalStockValue: number;
}

const Overview = () => {

      const [stats, setStats] = useState<StatsData>({
        totalProducts: 0,
        lowStockCount: 0,
        outOfStockCount: 0,
        totalStockValue: 0
      });
      const [loading, setLoading] = useState(true);

        useEffect(() => {
          const fetchStats = async () => {
            try {
              setLoading(true);
              
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
              
              setStats({
                totalProducts,
                lowStockCount,
                outOfStockCount,
                totalStockValue
              });
            } catch (error) {
              console.error('Error fetching statistics:', error);
            } finally {
              setLoading(false);
            }
          };
      
          fetchStats();
        }, []);
        
    
  return (
         <div className="flex flex-1 flex-col gap-6 p-6 pt-0">
          {/* Header Section */}
          <div className="flex flex-col gap-2">
            <h1 className="text-3xl font-bold tracking-tight">Takuma Mart</h1>
            <p className="text-muted-foreground">
              Manage your product inventory, stock levels, and pricing.
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid gap-4 md:grid-cols-4">
            <div className="rounded-xl border bg-card p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Products</p>
                  {loading ? (
                    <div className="h-8 w-16 animate-pulse rounded bg-gray-200"></div>
                  ) : (
                    <p className="text-2xl font-bold">{stats.totalProducts}</p>
                  )}
                </div>
                <div className="rounded-full bg-primary/10 p-3">
                  <svg className="h-6 w-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                </div>
              </div>
            </div>
            
            <div className="rounded-xl border bg-card p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Low Stock</p>
                  {loading ? (
                    <div className="h-8 w-16 animate-pulse rounded bg-gray-200"></div>
                  ) : (
                    <p className="text-2xl font-bold text-amber-600">{stats.lowStockCount}</p>
                  )}
                  <p className="text-xs text-muted-foreground">≤ 10 units</p>
                </div>
                <div className="rounded-full bg-amber-100 p-3">
                  <svg className="h-6 w-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.73 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                </div>
              </div>
            </div>
            
            <div className="rounded-xl border bg-card p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Out of Stock</p>
                  {loading ? (
                    <div className="h-8 w-16 animate-pulse rounded bg-gray-200"></div>
                  ) : (
                    <p className="text-2xl font-bold text-red-600">{stats.outOfStockCount}</p>
                  )}
                  <p className="text-xs text-muted-foreground">0 units</p>
                </div>
                <div className="rounded-full bg-red-100 p-3">
                  <svg className="h-6 w-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="rounded-xl border bg-card p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Stock Value</p>
                  {loading ? (
                    <div className="h-8 w-24 animate-pulse rounded bg-gray-200"></div>
                  ) : (
                    <p className="text-2xl font-bold text-green-600">
                      ${stats.totalStockValue.toFixed(2)}
                    </p>
                  )}
                  <p className="text-xs text-muted-foreground">Total inventory value</p>
                </div>
                <div className="rounded-full bg-green-100 p-3">
                  <svg className="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
          </div>
  )
}

export default Overview