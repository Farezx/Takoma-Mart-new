// app/products/products.tsx
import { useEffect, useState } from "react";
import { 
  Search, 
  Filter, 
  Plus, 
  MoreVertical, 
  Eye, 
  Edit, 
  Trash2,
  ShoppingCart,
  Package,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Calendar,
  Tag,
  Download,
  RefreshCw,
  Grid,
  List
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Skeleton } from "@/components/ui/skeleton"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface Product {
  id: number;
  name: string;
  price: number;
  currentStock: number;
  imageUrl?: string;
  imageFullUrl?: string;
  createdDate: string;
}

const Products = () => { 
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [stockFilter, setStockFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('newest');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetch('https://localhost:7192/api/products');
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('Fetched products:', data);
        setProducts(data);
        setFilteredProducts(data);
        setError(null);
      } catch (error) {
        console.error('Error fetching data:', error);
        setError('Failed to load products. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  // Filter and sort products
  useEffect(() => {
    let result = [...products];

    // Apply search filter
    if (searchQuery) {
      result = result.filter(product =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply stock filter
    if (stockFilter !== 'all') {
      switch(stockFilter) {
        case 'in-stock':
          result = result.filter(p => p.currentStock > 5);
          break;
        case 'low-stock':
          result = result.filter(p => p.currentStock > 0 && p.currentStock <= 5);
          break;
        case 'out-of-stock':
          result = result.filter(p => p.currentStock === 0);
          break;
      }
    }

    // Apply sorting
    switch(sortBy) {
      case 'name-asc':
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'name-desc':
        result.sort((a, b) => b.name.localeCompare(a.name));
        break;
      case 'price-asc':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'stock-asc':
        result.sort((a, b) => a.currentStock - b.currentStock);
        break;
      case 'stock-desc':
        result.sort((a, b) => b.currentStock - a.currentStock);
        break;
      case 'newest':
        result.sort((a, b) => new Date(b.createdDate).getTime() - new Date(a.createdDate).getTime());
        break;
      case 'oldest':
        result.sort((a, b) => new Date(a.createdDate).getTime() - new Date(b.createdDate).getTime());
        break;
    }

    setFilteredProducts(result);
  }, [products, searchQuery, stockFilter, sortBy]);

  const getStockBadgeVariant = (stock: number) => {
    if (stock === 0) return "destructive";
    if (stock <= 5) return "secondary";
    return "default";
  };

  const getStockIcon = (stock: number) => {
    if (stock === 0) return <XCircle className="h-3 w-3" />;
    if (stock <= 5) return <AlertTriangle className="h-3 w-3" />;
    return <CheckCircle className="h-3 w-3" />;
  };

  const getStockText = (stock: number) => {
    if (stock === 0) return "Out of Stock";
    if (stock <= 5) return "Low Stock";
    return "In Stock";
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getImageUrl = (product: Product) => {
    if (product.imageUrl && !product.imageUrl.startsWith('http')) {
      return `https://localhost:7192/Uploads/Products/${product.imageUrl}`;
    }
    return product.imageUrl;
  };

  const handleRefresh = () => {
    window.location.reload();
  };

  const calculateStockPercentage = (stock: number) => {
    const maxStock = 100; // You can adjust this based on your business logic
    return Math.min((stock / maxStock) * 100, 100);
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[...Array(8)].map((_, index) => (
            <Card key={index} className="overflow-hidden group">
              <Skeleton className="h-48 w-full" />
              <CardContent className="p-4">
                <Skeleton className="h-6 w-3/4 mb-2" />
                <Skeleton className="h-4 w-1/2 mb-4" />
                <div className="flex justify-between items-center">
                  <Skeleton className="h-8 w-20" />
                  <Skeleton className="h-8 w-8 rounded-full" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-2xl border border-dashed border-red-200 bg-gradient-to-br from-red-50 to-white p-8 text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-red-100 to-red-50">
          <XCircle className="h-8 w-8 text-red-600" />
        </div>
        <h3 className="mt-4 text-xl font-semibold text-gray-900">Unable to load products</h3>
        <p className="mt-2 text-gray-600 max-w-md mx-auto">{error}</p>
        <div className="mt-6 flex gap-3 justify-center">
          <Button 
            variant="outline" 
            className="gap-2"
            onClick={handleRefresh}
          >
            <RefreshCw className="h-4 w-4" />
            Try Again
          </Button>
          <Button className="gap-2 bg-gradient-to-r from-primary to-primary/80">
            <Plus className="h-4 w-4" />
            Add Product
          </Button>
        </div>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-gray-300 bg-gradient-to-br from-gray-50 to-white p-8 text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-gray-100 to-gray-50">
          <Package className="h-8 w-8 text-gray-400" />
        </div>
        <h3 className="mt-4 text-xl font-semibold text-gray-900">No products found</h3>
        <p className="mt-2 text-gray-600">Get started by adding your first product to your inventory.</p>
        <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
          <Button className="gap-2 bg-gradient-to-r from-primary to-primary/80 hover:shadow-lg transition-shadow">
            <Plus className="h-4 w-4" />
            Add Your First Product
          </Button>
          <Button variant="outline" className="gap-2">
            <Download className="h-4 w-4" />
            Import Products
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with search and filters */}
      <div className="rounded-2xl border bg-white p-6 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Products</h2>
            <p className="text-gray-600 mt-1">
              Manage your inventory of {products.length} products
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3">
            <Button className="gap-2 bg-gradient-to-r from-primary to-primary/80 hover:shadow-lg transition-all duration-300">
              <Plus className="h-4 w-4" />
              Add Product
            </Button>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="gap-2">
                  <Download className="h-4 w-4" />
                  Export
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>Export as CSV</DropdownMenuItem>
                <DropdownMenuItem>Export as Excel</DropdownMenuItem>
                <DropdownMenuItem>Export as PDF</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        
        {/* Search and Filter Bar */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative md:col-span-2">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="Search products by name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 border-gray-300 focus:border-primary"
            />
          </div>
          
          <Select value={stockFilter} onValueChange={setStockFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Stock Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Stock</SelectItem>
              <SelectItem value="in-stock">In Stock</SelectItem>
              <SelectItem value="low-stock">Low Stock</SelectItem>
              <SelectItem value="out-of-stock">Out of Stock</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger>
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest First</SelectItem>
              <SelectItem value="oldest">Oldest First</SelectItem>
              <SelectItem value="name-asc">Name (A-Z)</SelectItem>
              <SelectItem value="name-desc">Name (Z-A)</SelectItem>
              <SelectItem value="price-asc">Price (Low to High)</SelectItem>
              <SelectItem value="price-desc">Price (High to Low)</SelectItem>
              <SelectItem value="stock-asc">Stock (Low to High)</SelectItem>
              <SelectItem value="stock-desc">Stock (High to Low)</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        {/* View Toggle */}
        <div className="mt-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="gap-1">
              {filteredProducts.length} of {products.length}
            </Badge>
            {searchQuery && (
              <Badge variant="secondary" className="gap-1">
                Search: "{searchQuery}"
              </Badge>
            )}
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              variant={viewMode === 'grid' ? 'default' : 'outline'}
              size="icon"
              onClick={() => setViewMode('grid')}
              className="h-9 w-9"
            >
              <Grid className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'default' : 'outline'}
              size="icon"
              onClick={() => setViewMode('list')}
              className="h-9 w-9"
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Products Grid/List */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product) => {
            const imageUrl = getImageUrl(product);
            const stockPercentage = calculateStockPercentage(product.currentStock);
            
            return (
              <Card key={product.id} className="group overflow-hidden border-0 bg-gradient-to-b from-white to-gray-50 hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
                {/* Product Image */}
                <div className="relative aspect-square overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200">
                  {imageUrl ? (
                    <img
                      src={imageUrl}
                      alt={product.name}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = `https://via.placeholder.com/400x400/cccccc/969696?text=${encodeURIComponent(product.name.substring(0, 2).toUpperCase())}`;
                      }}
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-primary/5 to-primary/10">
                      <span className="text-3xl font-bold text-primary/30">
                        {product.name.substring(0, 2).toUpperCase()}
                      </span>
                    </div>
                  )}
                  
                  {/* Stock Indicator Overlay */}
                  <div className="absolute bottom-0 left-0 right-0 h-2 bg-gray-200">
                    <div 
                      className={`h-full transition-all duration-500 ${
                        product.currentStock === 0 ? 'bg-red-500' :
                        product.currentStock <= 5 ? 'bg-amber-500' : 'bg-green-500'
                      }`}
                      style={{ width: `${stockPercentage}%` }}
                    ></div>
                  </div>
                  
                  {/* Action Buttons */}
                  <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button size="icon" variant="secondary" className="h-8 w-8 rounded-full bg-white/90 backdrop-blur-sm shadow-sm hover:bg-white">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-48">
                        <DropdownMenuItem className="gap-2">
                          <Eye className="h-4 w-4" />
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem className="gap-2">
                          <Edit className="h-4 w-4" />
                          Edit Product
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="gap-2 text-red-600">
                          <Trash2 className="h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                  
                  {/* Stock Badge */}
                  <Badge 
                    variant={getStockBadgeVariant(product.currentStock)}
                    className="absolute top-3 left-3 gap-1 backdrop-blur-sm"
                  >
                    {getStockIcon(product.currentStock)}
                    {getStockText(product.currentStock)}
                  </Badge>
                </div>
                
                {/* Product Info */}
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 line-clamp-1 group-hover:text-primary transition-colors">
                        {product.name}
                      </h3>
                      <p className="text-sm text-gray-500 mt-1 flex items-center gap-1">
                        <Tag className="h-3 w-3" />
                        ID: {product.id}
                      </p>
                    </div>
                    <div className="text-right">
                      <span className="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                        ${product.price.toFixed(2)}
                      </span>
                      <p className="text-xs text-gray-500">per unit</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm">
                    <span className="flex items-center gap-1 text-gray-600">
                      <Package className="h-3 w-3" />
                      <span className="font-medium">{product.currentStock}</span> units
                    </span>
                    <span className="flex items-center gap-1 text-gray-500">
                      <Calendar className="h-3 w-3" />
                      {formatDate(product.createdDate)}
                    </span>
                  </div>
                </CardContent>
                
                {/* Actions */}
                <CardFooter className="p-4 pt-0">
                  <div className="flex w-full gap-2">
                    <Button 
                      variant="outline" 
                      className="flex-1 gap-2 border-gray-300 hover:border-primary hover:bg-primary/5"
                      size="sm"
                    >
                      <Edit className="h-3 w-3" />
                      Edit
                    </Button>
                    <Button 
                      className="flex-1 gap-2 bg-gradient-to-r from-primary to-primary/80 hover:shadow-md"
                      size="sm"
                      disabled={product.currentStock === 0}
                    >
                      <ShoppingCart className="h-3 w-3" />
                      {product.currentStock === 0 ? 'Out of Stock' : 'Order'}
                    </Button>
                  </div>
                </CardFooter>
              </Card>
            );
          })}
        </div>
      ) : (
        // List View
        <div className="space-y-3">
          {filteredProducts.map((product) => {
            const imageUrl = getImageUrl(product);
            
            return (
              <Card key={product.id} className="group hover:shadow-md transition-shadow">
                <div className="flex items-center p-4">
                  <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-lg">
                    {imageUrl ? (
                      <img
                        src={imageUrl}
                        alt={product.name}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-gray-100">
                        <Package className="h-6 w-6 text-gray-400" />
                      </div>
                    )}
                    <Badge 
                      variant={getStockBadgeVariant(product.currentStock)}
                      className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center"
                    >
                      {getStockIcon(product.currentStock)}
                    </Badge>
                  </div>
                  
                  <div className="ml-4 flex-1">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-medium text-gray-900">{product.name}</h3>
                        <p className="text-sm text-gray-500">ID: {product.id} • Added {formatDate(product.createdDate)}</p>
                      </div>
                      <div className="text-right">
                        <span className="text-lg font-bold text-gray-900">
                          ${product.price.toFixed(2)}
                        </span>
                        <p className="text-xs text-gray-500">per unit</p>
                      </div>
                    </div>
                    
                    <div className="mt-2 flex items-center gap-4">
                      <Badge variant="outline" className="gap-1">
                        <Package className="h-3 w-3" />
                        {product.currentStock} units
                      </Badge>
                      <span className="text-sm text-gray-600">
                        Stock value: ${(product.currentStock * product.price).toFixed(2)}
                      </span>
                    </div>
                  </div>
                  
                  <div className="ml-4 flex items-center gap-2">
                    <Button size="sm" variant="outline" className="gap-1">
                      <Edit className="h-3 w-3" />
                      Edit
                    </Button>
                    <Button size="sm" className="gap-1" disabled={product.currentStock === 0}>
                      <ShoppingCart className="h-3 w-3" />
                      Order
                    </Button>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button size="icon" variant="ghost" className="h-8 w-8">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>View Details</DropdownMenuItem>
                        <DropdownMenuItem>Duplicate</DropdownMenuItem>
                        <DropdownMenuItem className="text-red-600">Delete</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* Results Summary */}
      {filteredProducts.length > 0 && (
        <div className="rounded-xl border bg-gradient-to-r from-gray-50 to-white p-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="space-y-1">
              <p className="text-sm text-gray-600">
                Showing <span className="font-semibold text-gray-900">{filteredProducts.length}</span> of{" "}
                <span className="font-semibold text-gray-900">{products.length}</span> products
              </p>
              <p className="text-xs text-gray-500">
                Total inventory value:{" "}
                <span className="font-semibold text-green-600">
                  ${filteredProducts.reduce((sum, p) => sum + (p.currentStock * p.price), 0).toFixed(2)}
                </span>
              </p>
            </div>
            
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" disabled>
                Previous
              </Button>
              <Button variant="outline" size="sm">
                Next
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Empty Search Results */}
      {filteredProducts.length === 0 && products.length > 0 && (
        <div className="rounded-2xl border border-dashed border-gray-300 bg-gradient-to-br from-gray-50 to-white p-8 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-gray-100 to-gray-50">
            <Search className="h-8 w-8 text-gray-400" />
          </div>
          <h3 className="mt-4 text-xl font-semibold text-gray-900">No products found</h3>
          <p className="mt-2 text-gray-600">
            No products match your search criteria. Try adjusting your filters.
          </p>
          <Button 
            variant="outline" 
            className="mt-4"
            onClick={() => {
              setSearchQuery("");
              setStockFilter('all');
            }}
          >
            Clear Filters
          </Button>
        </div>
      )}
    </div>
  );
};

export default Products;