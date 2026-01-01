// src/pages/StockReport.tsx
import { useEffect, useState } from "react";
import { 
  BarChart3, 
  Search, 
  RefreshCcw, 
  Filter, 
  ChevronLeft, 
  ChevronRight,
  ArrowUpDown,
  FileDown
} from "lucide-react";
import { Link } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

const API_BASE = "https://localhost:7192";

interface Product {
  id: number;
  name: string;
  price: number;
  imageFullUrl: string;
  currentStock: number;
  updatedDate: string;
}

export default function StockReportPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [threshold, setThreshold] = useState<number>(5);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  
  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const fetchStockData = async () => {
    setLoading(true);
    try {
      // Fetching from the low-stock endpoint using the dynamic threshold
      const res = await fetch(`${API_BASE}/api/Products/low-stock?threshold=${threshold}`);
      const data = await res.json();
      setProducts(data);
    } catch (error) {
      console.error("Failed to fetch stock data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStockData();
  }, [threshold]); // Re-fetch whenever threshold changes

  // Filter Logic
  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination Calculation
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedItems = filteredProducts.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-8 animate-in fade-in duration-500">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-indigo-600 font-bold text-sm uppercase tracking-wider">
            <BarChart3 className="h-4 w-4" /> Inventory Reports
          </div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">Stock Analysis</h1>
        </div>
        
        <div className="flex items-center gap-2">
          <Button variant="outline" className="h-11 shadow-sm border-slate-200">
            <FileDown className="mr-2 h-4 w-4" /> Export CSV
          </Button>
          <Button onClick={fetchStockData} className="h-11 bg-slate-900 hover:bg-slate-800 shadow-lg">
            <RefreshCcw className={`mr-2 h-4 w-4 ${loading && 'animate-spin'}`} /> Sync Data
          </Button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex flex-col md:flex-row gap-4 items-center mb-6">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input 
            placeholder="Search by product name..." 
            className="pl-10 h-12 bg-slate-50 border-none rounded-xl focus-visible:ring-indigo-500/20"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="flex items-center gap-3 bg-slate-50 px-4 py-2 rounded-xl border border-slate-100 w-full md:w-auto">
          <Filter className="h-4 w-4 text-slate-400" />
          <label className="text-sm font-bold text-slate-500 whitespace-nowrap uppercase tracking-tighter">Threshold:</label>
          <Input 
            type="number" 
            className="w-20 h-8 border-slate-200 text-center font-bold"
            value={threshold}
            onChange={(e) => setThreshold(Number(e.target.value))}
          />
        </div>
      </div>

      {/* Main Table Container */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-xl shadow-slate-200/40 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100">
                <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Product Info</th>
                <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400 text-center">Current Stock</th>
                <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Status</th>
                <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Price</th>
                <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400 text-right">Inventory Value</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {loading ? (
                <tr><td colSpan={5} className="py-20 text-center text-slate-400">Loading inventory data...</td></tr>
              ) : paginatedItems.map((prod) => (
                <tr key={prod.id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      <div className="h-12 w-12 rounded-xl bg-slate-100 overflow-hidden border border-slate-100 shrink-0">
                        <img src={`${API_BASE}${prod.imageFullUrl}`} className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <Link to={`/products/${prod.id}`} className="font-bold text-slate-900 hover:text-indigo-600 transition-colors">
                          {prod.name}
                        </Link>
                        <p className="text-[10px] text-slate-400 font-mono">ID: PROD-{prod.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className={`inline-flex items-center justify-center h-10 w-10 rounded-full font-bold text-sm ${
                      prod.currentStock === 0 ? "bg-red-50 text-red-600" : "bg-slate-100 text-slate-900"
                    }`}>
                      {prod.currentStock}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <Badge variant="outline" className={`rounded-full border-none px-3 py-1 ${
                      prod.currentStock === 0 ? "bg-red-100 text-red-700" : "bg-amber-100 text-amber-700"
                    }`}>
                      {prod.currentStock === 0 ? "Out of Stock" : "Action Required"}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 font-medium text-slate-600">
                    ${prod.price.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <p className="font-black text-slate-900">${(prod.price * prod.currentStock).toLocaleString()}</p>
                    <p className="text-[10px] text-slate-400 uppercase font-bold tracking-tighter">Total Asset</p>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        <div className="bg-slate-50/50 px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-slate-100">
          <p className="text-xs font-bold text-slate-500 uppercase tracking-tighter">
            Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredProducts.length)} of {filteredProducts.length} entries
          </p>
          
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="h-8 w-8 p-0 rounded-lg border-slate-200"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            
            <div className="flex items-center gap-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <Button
                  key={page}
                  variant={currentPage === page ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setCurrentPage(page)}
                  className={`h-8 w-8 p-0 rounded-lg text-xs font-bold ${
                    currentPage === page ? "bg-indigo-600 text-white" : "text-slate-400"
                  }`}
                >
                  {page}
                </Button>
              ))}
            </div>

            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="h-8 w-8 p-0 rounded-lg border-slate-200"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      <div className="mt-8 p-6 rounded-3xl bg-indigo-50 border border-indigo-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h4 className="text-indigo-900 font-bold">Automatic Reorder Suggestion</h4>
          <p className="text-sm text-indigo-700/70">Based on your current threshold of <b>{threshold}</b>, we recommend replenishing these {filteredProducts.length} items.</p>
        </div>
        <Button className="bg-indigo-600 hover:bg-indigo-700 shadow-md shadow-indigo-200">
          Generate Purchase Order
        </Button>
      </div>
    </div>
  );
}