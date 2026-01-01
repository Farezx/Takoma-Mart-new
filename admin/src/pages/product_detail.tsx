// src/pages/ProductDetail.tsx
import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { 
  ArrowLeft, Edit, Trash2, Package, Calendar, 
  ChevronRight, Clock, DollarSign, ShieldCheck,
  CheckCircle2, AlertCircle, Loader2, ArrowUpRight,
  AlertTriangle
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";


interface Product {
  id: number;
  name: string;
  price: number;
  imageUrl: string;
  imageFullUrl: string;
  createdDate: string;
  updatedDate: string;
  currentStock: number;
}

const API_BASE = "https://localhost:7192";

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`${API_BASE}/api/Products/${id}`);
        if (!response.ok) throw new Error("Product not found");
        const data = await response.json();
        setProduct(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  if (loading) return <DetailSkeleton />;
  if (!product) return <ErrorState />;

  const isLowStock = product.currentStock > 0 && product.currentStock <= 5;
  const isOutOfStock = product.currentStock === 0;

  const handleDelete = async () => {
  try {
    const res = await fetch(`${API_BASE}/api/Products/${id}`, { method: "DELETE" });
    if (res.ok) navigate("/products");
  } catch (err) {
    alert("Delete failed");
  }
};


  return (
    <div className="max-w-7xl mx-auto p-4 md:p-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Breadcrumbs & Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <nav className="flex items-center gap-2 text-sm text-slate-500">
          <Link to="/products" className="hover:text-indigo-600 transition-colors">Inventory</Link>
          <ChevronRight className="h-4 w-4" />
          <span className="text-slate-900 font-medium truncate">{product.name}</span>
        </nav>
        
        <div className="flex items-center gap-2">
          {/* <Button variant="outline" size="sm" onClick={() => navigate(`/products/edit/${id}`)}>
            <Edit className="mr-2 h-4 w-4" /> Edit
          </Button> */}
          <Button variant="outline" onClick={() => navigate(`/products/edit/${product.id}`)}>
            <Edit className="mr-2 h-4 w-4" /> Edit
          </Button>
          
 <AlertDialog>
  <AlertDialogTrigger asChild>
    <Button 
      variant="outline" 
      className="group text-red-600 border-red-100 hover:bg-red-50 hover:border-red-200 transition-all duration-200"
    >
      <Trash2 className="mr-2 h-4 w-4 transition-transform group-hover:scale-110" /> 
      Delete Product
    </Button>
  </AlertDialogTrigger>
  
  <AlertDialogContent className="max-w-[400px] bg-slate-100 rounded-3xl border-none shadow-2xl p-8">
    <div className="flex flex-col items-center text-center space-y-4">
      {/* Visual Warning Icon */}
      <div className="h-16 w-16 bg-red-50 rounded-full flex items-center justify-center animate-pulse">
        <AlertTriangle className="h-8 w-8 text-red-500" />
      </div>

      <AlertDialogHeader>
        <AlertDialogTitle className="text-2xl font-bold text-slate-900">
          Confirm Deletion
        </AlertDialogTitle>
        <AlertDialogDescription className="text-slate-500 text-base leading-relaxed">
          You are about to permanently remove <span className="font-bold text-slate-900">"{product?.name}"</span>. 
          This will erase all associated inventory data.
        </AlertDialogDescription>
      </AlertDialogHeader>

      <AlertDialogFooter className="flex flex-col sm:flex-row gap-3 w-full pt-4">
        <AlertDialogCancel className="flex-1 h-12 rounded-xl border-slate-200 hover:bg-slate-50 font-semibold transition-all">
          No, keep it
        </AlertDialogCancel>
        <AlertDialogAction 
          onClick={handleDelete} 
          className="flex-1 h-12 rounded-xl bg-red-600 hover:bg-red-700 text-white font-semibold shadow-lg shadow-red-200 transition-all active:scale-95"
        >
          Yes, delete it
        </AlertDialogAction>
      </AlertDialogFooter>
    </div>
  </AlertDialogContent>
</AlertDialog>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Gallery Section */}
        <div className="lg:col-span-7">
          <Card className="overflow-hidden border-none shadow-2xl shadow-slate-200/50 rounded-3xl bg-slate-50">
            <div className="aspect-square md:aspect-video relative group">
              <img 
                src={`${API_BASE}${product.imageFullUrl}`} 
                alt={product.name}
                className="w-full h-full object-contain p-8 mix-blend-multiply transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute top-6 left-6 flex gap-2">
                <Badge className={isOutOfStock ? "bg-red-500" : isLowStock ? "bg-amber-500" : "bg-emerald-500"}>
                  {isOutOfStock ? "Out of Stock" : isLowStock ? "Low Stock" : "In Stock"}
                </Badge>
              </div>
            </div>
          </Card>
        </div>

        {/* Right Info Section */}
        <div className="lg:col-span-5 space-y-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-indigo-600 font-bold text-sm uppercase tracking-widest">
              <Package className="h-4 w-4" /> SKU-00{product.id}
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight">
              {product.name}
            </h1>
          </div>

          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-bold text-slate-900">${product.price.toLocaleString()}</span>
            <span className="text-slate-400 font-medium">USD / unit</span>
          </div>

          <Separator className="bg-slate-100" />

          {/* Stock Metrics */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-tighter mb-1">Available Inventory</p>
              <p className="text-2xl font-black text-slate-900">{product.currentStock} <span className="text-sm font-normal text-slate-400">units</span></p>
            </div>
            <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-tighter mb-1">Total Value</p>
              <p className="text-2xl font-black text-indigo-600">${(product.price * product.currentStock).toLocaleString()}</p>
            </div>
          </div>

          {/* Product Lifecycle */}
          <Card className="border-slate-100 bg-slate-50/50">
            <CardContent className="p-6 space-y-4">
              <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Clock className="h-4 w-4 text-indigo-500" /> History & Metadata
              </h4>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">System ID</span>
                  <span className="font-mono text-slate-900">#PROD_{product.id}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Date Created</span>
                  <span className="text-slate-900">{new Date(product.createdDate).toLocaleDateString(undefined, { dateStyle: 'long' })}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Last Modified</span>
                  <span className="text-slate-900 font-medium">{new Date(product.updatedDate).toLocaleTimeString()}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Button className="w-full h-14 bg-slate-900 hover:bg-slate-800 text-white rounded-2xl text-lg font-bold transition-all shadow-xl shadow-slate-200">
            Create Purchase Order <ArrowUpRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  );
}

/* --- Helpers --- */

const DetailSkeleton = () => (
  <div className="max-w-7xl mx-auto p-8 space-y-8 animate-pulse">
    <div className="h-4 w-48 bg-slate-200 rounded" />
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
      <div className="lg:col-span-7 aspect-square bg-slate-200 rounded-3xl" />
      <div className="lg:col-span-5 space-y-6">
        <div className="h-10 w-3/4 bg-slate-200 rounded" />
        <div className="h-8 w-1/4 bg-slate-200 rounded" />
        <div className="h-32 w-full bg-slate-200 rounded-2xl" />
        <div className="h-14 w-full bg-slate-200 rounded-2xl" />
      </div>
    </div>
  </div>
);

const ErrorState = () => (
  <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
    <div className="h-20 w-20 bg-red-50 rounded-full flex items-center justify-center mb-6">
      <AlertCircle className="h-10 w-10 text-red-500" />
    </div>
    <h2 className="text-2xl font-bold text-slate-900 mb-2">Product not found</h2>
    <p className="text-slate-500 mb-8 max-w-sm">The item you're looking for might have been deleted or the link is incorrect.</p>
    <Button asChild>
      <Link to="/products"><ArrowLeft className="mr-2 h-4 w-4" /> Return to Inventory</Link>
    </Button>
  </div>
);