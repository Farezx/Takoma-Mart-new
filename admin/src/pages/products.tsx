// app/products/products.tsx
"use client";

import { useEffect, useState, useMemo } from "react";
import { 
  Search, Plus, MoreVertical, Eye, Edit, Trash2, 
  ShoppingCart, Package, AlertCircle, CheckCircle2, 
  XCircle, Calendar, Tag, Download, Grid, List, FilterX
} from "lucide-react";

import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Link } from "react-router";

interface Product {
  id: number;
  name: string;
  price: number;
  currentStock: number;
  imageUrl?: string;
  createdDate: string;
}

const API_BASE = "https://localhost:7192";

const Products = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [stockFilter, setStockFilter] = useState('all');
  const [sortBy, setSortBy] = useState('newest');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${API_BASE}/api/products`);
        if (!response.ok) throw new Error("Failed to fetch products");
        const data = await response.json();
        setProducts(data);
      } catch (err) {
        setError("Unable to connect to the server.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const filteredProducts = useMemo(() => {
    let result = [...products];

    if (searchQuery) {
      result = result.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()));
    }

    if (stockFilter !== 'all') {
      if (stockFilter === 'low') result = result.filter(p => p.currentStock > 0 && p.currentStock <= 5);
      if (stockFilter === 'out') result = result.filter(p => p.currentStock === 0);
      if (stockFilter === 'in') result = result.filter(p => p.currentStock > 5);
    }

    const sortMap: Record<string, (a: Product, b: Product) => number> = {
      'newest': (a, b) => new Date(b.createdDate).getTime() - new Date(a.createdDate).getTime(),
      'price-asc': (a, b) => a.price - b.price,
      'price-desc': (a, b) => b.price - a.price,
      'name-asc': (a, b) => a.name.localeCompare(b.name),
    };

    return result.sort(sortMap[sortBy] || sortMap['newest']);
  }, [products, searchQuery, stockFilter, sortBy]);

  if (loading) return <LoadingGrid />;

  return (
    <div className="max-w-7xl mx-auto space-y-8 p-4">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Inventory</h1>
          <p className="text-slate-500 mt-1">Manage, track, and update your product catalog.</p>
        </div>
        <div className="flex items-center gap-2">
          {/* <Button variant="outline" size="sm" className="hidden sm:flex border-slate-200">
            <Download className="mr-2 h-4 w-4" /> Export
          </Button> */}
          <Link to="/products/new">
          <Button variant="outline" size="sm" className="hidden sm:flex border-slate-200">
            <Plus className="mr-2 h-4 w-4" /> Add Product
          </Button>
          </Link>
        </div>
      </div>

      {/* Modern Filter Bar */}
      <div className="bg-white p-2 border rounded-xl shadow-sm flex flex-col md:flex-row gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input 
            placeholder="Search products..." 
            className="pl-9 border-none bg-transparent focus-visible:ring-0"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Separator orientation="vertical" className="hidden md:block h-8 self-center" />
        <div className="flex items-center gap-2 p-1">
          <Select value={stockFilter} onValueChange={setStockFilter}>
            <SelectTrigger className="w-[140px] border-none shadow-none focus:ring-0">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="in">In Stock</SelectItem>
              <SelectItem value="low">Low Stock</SelectItem>
              <SelectItem value="out">Out of Stock</SelectItem>
            </SelectContent>
          </Select>

          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-[140px] border-none shadow-none focus:ring-0">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Latest</SelectItem>
              <SelectItem value="price-asc">Price: Low</SelectItem>
              <SelectItem value="price-desc">Price: High</SelectItem>
              <SelectItem value="name-asc">Alphabetical</SelectItem>
            </SelectContent>
          </Select>

          <div className="flex bg-slate-100 p-1 rounded-lg">
            <Button 
              variant="link" 
              size="icon" 
              className={`h-7 w-7 rounded-md ${viewMode === 'grid' ? 'shadow-sm' : ''}`}
              onClick={() => setViewMode('grid')}
            >
              <Grid className="h-4 w-4" />
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              className={`h-7 w-7 rounded-md ${viewMode === 'list' ? 'shadow-sm' : ''}`}
              onClick={() => setViewMode('list')}
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      {filteredProducts.length === 0 ? (
        <EmptyState isSearch={products.length > 0} reset={() => {setSearchQuery(""); setStockFilter("all");}} />
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((p) => <ProductCard key={p.id} product={p} />)}
        </div>
      ) : (
        <div className="border rounded-xl bg-white overflow-hidden shadow-sm">
          {filteredProducts.map((p) => <ProductRow key={p.id} product={p} />)}
        </div>
      )}
    </div>
  );
};

/* --- Sub-components for better organization --- */

const ProductCard = ({ product }: { product: Product }) => {
  const stockColor = product.currentStock === 0 ? 'text-red-500' : product.currentStock <= 5 ? 'text-amber-500' : 'text-emerald-500';
  
  return (
    <Card className="group overflow-hidden border-slate-200 hover:border-indigo-200 hover:shadow-md transition-all">
      <div className="relative aspect-[4/3] bg-slate-100 overflow-hidden">
        <img 
          src={product.imageUrl ? (product.imageUrl.startsWith('http') ? product.imageUrl : `${API_BASE}/Uploads/Products/${product.imageUrl}`) : '/api/placeholder/400/300'} 
          alt={product.name}
          className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute top-2 right-2 flex flex-col gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button size="icon" variant="secondary" className="h-8 w-8 rounded-full bg-white/90 backdrop-blur-sm shadow-sm">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem><Eye className="mr-2 h-4 w-4" /> Details</DropdownMenuItem>
                <DropdownMenuItem><Edit className="mr-2 h-4 w-4" /> Edit</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-red-600"><Trash2 className="mr-2 h-4 w-4" /> Delete</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
        </div>
      </div>
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-semibold text-slate-900 line-clamp-1">{product.name}</h3>
          <span className="font-bold text-slate-900">${product.price.toLocaleString()}</span>
        </div>
        <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wider">
          <span className={`flex items-center gap-1 ${stockColor}`}>
            <Package className="h-3 w-3" />
            {product.currentStock} in stock
          </span>
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Link to={`/product/${product.id}`} className="w-full">
        <Button className="w-full bg-slate-900 hover:bg-slate-800 text-white rounded-lg" size="sm">
          Manage Stock
        </Button>
        </Link>
      </CardFooter>
    </Card>
  );
};

const ProductRow = ({ product }: { product: Product }) => (
  <div className="flex items-center gap-4 p-4 hover:bg-slate-50 transition-colors border-b last:border-b-0">
    <div className="h-12 w-12 rounded-lg bg-slate-100 overflow-hidden shrink-0 border">
       <img src={product.imageUrl || '/api/placeholder/48/48'} alt="" className="object-cover w-full h-full" />
    </div>
    <div className="flex-1 min-w-0">
      <h4 className="text-sm font-semibold text-slate-900 truncate">{product.name}</h4>
      <p className="text-xs text-slate-500">ID: {product.id} • Added {new Date(product.createdDate).toLocaleDateString()}</p>
    </div>
    <div className="hidden sm:block text-right">
      <p className="text-sm font-medium text-slate-900">${product.price.toFixed(2)}</p>
      <Badge variant={product.currentStock <= 5 ? "secondary" : "outline"} className="text-[10px] h-5">
        {product.currentStock} Units
      </Badge>
    </div>
    <Button variant="ghost" size="icon" className="text-slate-400">
      <MoreVertical className="h-4 w-4" />
    </Button>
  </div>
);

const EmptyState = ({ isSearch, reset }: { isSearch: boolean, reset: () => void }) => (
  <div className="flex flex-col items-center justify-center py-20 text-center border-2 border-dashed rounded-3xl bg-slate-50/50">
    <div className="h-16 w-16 bg-white rounded-2xl shadow-sm flex items-center justify-center mb-4">
      {isSearch ? <FilterX className="h-8 w-8 text-slate-400" /> : <Package className="h-8 w-8 text-slate-400" />}
    </div>
    <h3 className="text-xl font-semibold text-slate-900">{isSearch ? "No matches found" : "No products yet"}</h3>
    <p className="text-slate-500 max-w-xs mx-auto mt-2">
      {isSearch ? "Try adjusting your filters or search terms to find what you're looking for." : "Start by adding your first product to the inventory."}
    </p>
    <Button onClick={reset} variant={isSearch ? "link" : "default"} className="mt-4">
      {isSearch ? "Clear all filters" : "Create Product"}
    </Button>
  </div>
);

const LoadingGrid = () => (
  <div className="max-w-7xl mx-auto p-6 space-y-8">
    <div className="flex justify-between items-end">
      <div className="space-y-2"><Skeleton className="h-8 w-48" /><Skeleton className="h-4 w-64" /></div>
      <Skeleton className="h-10 w-32" />
    </div>
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {[...Array(8)].map((_, i) => (
        <Card key={i} className="overflow-hidden border-slate-200">
          <Skeleton className="aspect-[4/3] w-full" />
          <div className="p-4 space-y-3">
            <Skeleton className="h-5 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-9 w-full mt-2" />
          </div>
        </Card>
      ))}
    </div>
  </div>
);

export default Products;