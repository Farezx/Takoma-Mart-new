import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom"; 
import { 
  ArrowLeft, 
  Upload, 
  Loader2, 
  Image as ImageIcon, 
  DollarSign,
  CheckCircle2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

const API_BASE = "https://localhost:7192";

export default function AddProduct() {
  const navigate = useNavigate(); 
  const { id } = useParams(); 
  const isEditMode = Boolean(id);

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(isEditMode);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    price: ""
  });

    // 1. Fetch data if in Edit Mode
    useEffect(() => {
      if (isEditMode) {
        const fetchProduct = async () => {
          try {
            const res = await fetch(`${API_BASE}/api/Products/${id}`);
            if (!res.ok) throw new Error("Product not found");
            const data = await res.json();
            
            setFormData({
              name: data.name,
              price: data.price.toString()
            });
            
            // Set initial image preview if it exists
            if (data.imageFullUrl) {
              setPreviewUrl(`${API_BASE}${data.imageFullUrl}`);
            }
          } catch (error) {
            console.error("Error fetching product:", error);
          } finally {
            setFetching(false);
          }
        };
        fetchProduct();
      }
    }, [id, isEditMode]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      // Create local preview URL
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // 2. Choose Method and URL
      const url = isEditMode ? `${API_BASE}/api/Products/${id}` : `${API_BASE}/api/products`;
      const method = isEditMode ? "PUT" : "POST";

      const productRes = await fetch(url, {
        method: method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          price: parseFloat(formData.price),
          imageUrl: "" // Kept as placeholder
        }),
      });

      if (!productRes.ok) throw new Error("Failed to save product record");
      
      // Get the ID (from params if editing, from response if creating)
      const productId = isEditMode ? id : (await productRes.json()).id;

      // 3. Upload Image if a new file was selected
      if (imageFile && productId) {
        const imageFormData = new FormData();
        imageFormData.append("imageFile", imageFile);

        const uploadRes = await fetch(`${API_BASE}/api/Products/${productId}/upload-image`, {
          method: "POST",
          body: imageFormData,
        });

        if (!uploadRes.ok) throw new Error("Image upload failed");
      }

      navigate("/products");
    } catch (error) {
      console.error(error);
      alert("Error saving product.");
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-indigo-600" />
      </div>
    );
  }


  return (
    <div className="max-w-6xl mx-auto p-4 animate-in fade-in duration-500">
      {/* Top Navigation */}
      <div className="mb-8">
        <Button 
          variant="ghost" 
          onClick={() => navigate(-1)} 
          className="group text-slate-500 hover:text-slate-900 pl-0"
        >
          <ArrowLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" /> 
          Back to Inventory
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
        {/* Left Column: The Form */}
        <div className="lg:col-span-3">
          <Card className="border-none shadow-none bg-transparent">
            <CardHeader className="px-0 pt-0">
              <CardTitle className="text-3xl font-bold tracking-tight">
                  {isEditMode ? "Update Product" : "Create Product"}
                </CardTitle>
              <CardDescription className="text-base">
                {isEditMode ? "Modify existing product details." : "Add a new item to your store."}
              </CardDescription>
            </CardHeader>
            <CardContent className="px-0 py-6">
              <form onSubmit={handleSubmit} className="space-y-8">
                {/* Product Name */}
                <div className="space-y-3">
                  <Label htmlFor="name" className="text-sm font-semibold uppercase tracking-wider text-slate-500">
                    Product Details
                  </Label>
                  <div className="space-y-2">
                    <Label htmlFor="name">Name</Label>
                    <Input 
                      id="name" 
                      placeholder="e.g. Premium Wireless Headphones" 
                      required 
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className="h-12 border-slate-200 focus:ring-2 focus:ring-indigo-500/20"
                    />
                  </div>
                </div>

                {/* Price */}
                <div className="space-y-2">
                  <Label htmlFor="price">Pricing</Label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <Input 
                      id="price" 
                      type="number" 
                      step="0.01" 
                      placeholder="0.00" 
                      required 
                      value={formData.price}
                      onChange={(e) => setFormData({...formData, price: e.target.value})}
                      className="pl-9 h-12 border-slate-200"
                    />
                  </div>
                </div>

                {/* Image Upload Area */}
                <div className="space-y-2">
                  <Label>Product Media</Label>
                  <div className="relative group border-2 border-dashed border-slate-200 rounded-2xl p-10 flex flex-col items-center justify-center bg-slate-50/50 transition-all hover:bg-white hover:border-indigo-400">
                    <input
                      type="file"
                      id="image-upload"
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      accept="image/*"
                      onChange={handleImageChange}
                    />
                    <div className="h-14 w-14 rounded-2xl bg-white shadow-sm flex items-center justify-center mb-4 text-slate-400 group-hover:text-indigo-600 transition-colors">
                      <Upload className="h-6 w-6" />
                    </div>
                    <p className="text-sm font-medium text-slate-700">
                      <span className="text-indigo-600 underline">Upload a file</span> or drag and drop
                    </p>
                    <p className="text-xs text-slate-400 mt-2">Recommended size: 1080x1080px (PNG, JPG)</p>
                  </div>
                </div>

                <div className="pt-4 flex items-center gap-4">
                  <Button 
                    type="submit" 
                    disabled={loading} 
                    className="flex-1 h-12 bg-indigo-600 hover:bg-indigo-700 shadow-indigo-200 shadow-lg text-white font-semibold transition-all"
                  >
                    {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : "Publish Product"}
                  </Button>
                  <Button 
                    variant="outline" 
                    type="button" 
                    onClick={() => navigate("/products")}
                    className="h-12 px-8 border-slate-200"
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Preview Sticky Sidebar */}
        <div className="lg:col-span-2 relative">
          <div className="sticky top-10">
            <div className="mb-4 flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-widest text-slate-400">Preview Preview</span>
              <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                <CheckCircle2 className="h-3 w-3" /> Auto-Saving
              </span>
            </div>
            
            <Card className="overflow-hidden border-none shadow-2xl shadow-indigo-100/50 rounded-3xl transition-all duration-500">
              <div className="aspect-square bg-slate-100 relative group overflow-hidden">
                {previewUrl ? (
                  <img src={previewUrl} alt="Preview" className="object-cover w-full h-full animate-in zoom-in-95 duration-300" />
                ) : (
                  <div className="flex flex-col items-center justify-center h-full text-slate-300">
                    <ImageIcon className="h-20 w-20 stroke-[1px]" />
                    <p className="text-sm mt-2">No image selected</p>
                  </div>
                )}
                <div className="absolute top-4 left-4">
                  <span className="bg-white/90 backdrop-blur-md text-[10px] font-bold px-3 py-1 rounded-full shadow-sm uppercase tracking-tighter">
                    New Arrival
                  </span>
                </div>
              </div>
              
              <CardContent className="p-6 bg-white">
                <div className="space-y-4">
                  <div className="flex justify-between items-start gap-4">
                    <h3 className="text-xl font-bold text-slate-900 truncate">
                      {formData.name || "Untitled Product"}
                    </h3>
                    <p className="text-xl font-black text-indigo-600">
                      ${formData.price ? parseFloat(formData.price).toLocaleString() : "0.00"}
                    </p>
                  </div>
                  
                  <div className="flex gap-2">
                    <div className="h-8 w-24 bg-slate-100 rounded-lg animate-pulse" />
                    <div className="h-8 w-16 bg-slate-50 rounded-lg animate-pulse" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="mt-6 p-4 rounded-2xl bg-indigo-50 border border-indigo-100 flex gap-3">
              <div className="h-10 w-10 rounded-xl bg-white flex items-center justify-center text-indigo-600 shrink-0 shadow-sm">
                <PackagePlus className="h-5 w-5" />
              </div>
              <p className="text-xs text-indigo-900/70 leading-relaxed">
                Once published, this product will be immediately visible on your store and available for inventory tracking.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Minimal helper to match the UI icon in text
function PackagePlus({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );
}