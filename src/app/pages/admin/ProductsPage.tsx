import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";
import { motion } from "motion/react";
import { Plus, Edit2, Trash2, Upload, Star, Trophy } from "lucide-react";

const GENDERS = ["Women", "Men", "Unisex"];

const SIZES = [
  { value: 30, label: "30 ml" },
  { value: 50, label: "50 ml" },
  { value: 75, label: "75 ml" },
  { value: 100, label: "100 ml" },
  { value: 150, label: "150 ml" },
  { value: 200, label: "200 ml" },
];

const STOCK_STATUSES = ["In Stock", "Low Stock", "Out of Stock"];

export function AdminProductsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [form, setForm] = useState({
    name: "",
    name_ar: "",
    description: "",
    description_ar: "",
    short_description: "",
    short_description_ar: "",
    price: "",
    old_price: "",
    category: "",
    category_id: "",
    gender: "",
    size_ml: "",
    stock: "",
    stock_status: "In Stock",
    is_featured: false,
    is_best_seller: false,
    is_active: true,
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      const [productsResult, categoriesResult] = await Promise.all([
        supabase.from("products").select("*").order("created_at", { ascending: false }),
        supabase.from("categories").select("*").order("sort_order", { ascending: true }),
      ]);
      setProducts(productsResult.data || []);
      setCategories(categoriesResult.data || []);
    } catch (error) {
      console.error("Error loading data:", error);
    } finally {
      setLoading(false);
    }
  }

  async function loadProducts() {
    try {
      const { data } = await supabase.from("products").select("*").order("created_at", { ascending: false });
      setProducts(data || []);
    } catch (error) {
      console.error("Error loading products:", error);
    }
  }

  async function handleImageUpload(file: File) {
    setUploading(true);
    setErrorMessage(null);

    try {
      const fileExt = file.name.split(".").pop()?.toLowerCase();
      const allowedTypes = ["image/jpeg", "image/png", "image/webp"];

      if (!allowedTypes.includes(file.type)) {
        throw new Error("Only JPG, PNG and WEBP images are allowed.");
      }

      if (file.size > 5 * 1024 * 1024) {
        throw new Error("Image size must be under 5MB.");
      }

      const fileName = `${Date.now()}-${crypto.randomUUID()}.${fileExt}`;
      const filePath = `products/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("product-images")
        .upload(filePath, file, {
          cacheControl: "3600",
          upsert: false,
          contentType: file.type,
        });

      if (uploadError) {
        console.error("Supabase upload error:", uploadError);
        throw uploadError;
      }

      const { data: publicUrlData } = supabase.storage
        .from("product-images")
        .getPublicUrl(filePath);

      if (!publicUrlData?.publicUrl) {
        throw new Error("Public URL could not be generated.");
      }

      return publicUrlData.publicUrl;
    } catch (error: any) {
      console.error("Error uploading image:", error);
      setErrorMessage(error.message || "Error uploading image");
      return null;
    } finally {
      setUploading(false);
    }
  }

  function handleImageFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrorMessage(null);
    setSaving(true);

    try {
      if (!form.name || !form.price || !form.category || !form.gender || !form.size_ml || !form.stock) {
        throw new Error("Please fill in all required fields");
      }

      if (!imageFile && !editingProduct?.image_url) {
        throw new Error("Please upload a product image");
      }

      let imageUrl = editingProduct?.image_url || "";
      if (imageFile) {
        const uploadedUrl = await handleImageUpload(imageFile);
        if (uploadedUrl) {
          imageUrl = uploadedUrl;
        } else {
          throw new Error("Failed to upload image");
        }
      }

      const slug = form.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

      const productData = {
        ...form,
        slug,
        price: Number(form.price),
        old_price: form.old_price ? Number(form.old_price) : null,
        stock: Number(form.stock),
        size_ml: form.size_ml ? Number(form.size_ml) : null,
        image_url: imageUrl,
        updated_at: new Date().toISOString(),
      };

      let result;
      if (editingProduct) {
        result = await supabase.from("products").update(productData).eq("id", editingProduct.id);
      } else {
        result = await supabase.from("products").insert([productData]);
      }

      if (result.error) {
        console.error("Product save error:", {
          message: result.error.message,
          details: result.error.details,
          hint: result.error.hint,
          code: result.error.code,
        });
        throw new Error(result.error.message || "Error saving product");
      }

      loadProducts();
      setShowForm(false);
      setEditingProduct(null);
      resetForm();
    } catch (error: any) {
      console.error("Error saving product:", error);
      setErrorMessage(error.message || "Error saving product");
    } finally {
      setSaving(false);
    }
  }

  function resetForm() {
    setForm({
      name: "",
      name_ar: "",
      description: "",
      description_ar: "",
      short_description: "",
      short_description_ar: "",
      price: "",
      old_price: "",
      category: "",
      category_id: "",
      gender: "",
      size_ml: "",
      stock: "",
      stock_status: "In Stock",
      is_featured: false,
      is_best_seller: false,
      is_active: true,
    });
    setImageFile(null);
    setImagePreview(null);
    setErrorMessage(null);
  }

  async function handleDelete(id: string) {
    if (!confirm("Are you sure you want to delete this product?")) return;
    try {
      // Check if there are order items linked to this product
      const { count, error: countError } = await supabase
        .from("order_items")
        .select("*", { count: "exact", head: true })
        .eq("product_id", id);
      
      if (countError) throw countError;
      
      if (count && count > 0) {
        alert(`Cannot delete: this product is in ${count} order(s). Please delete those orders first.`);
        return;
      }
      
      await supabase.from("products").delete().eq("id", id);
      loadProducts();
    } catch (error: any) {
      console.error("Error deleting product:", error);
      if (error.code === "23503") {
        alert("Cannot delete: this product is linked to existing orders. Please delete those orders first.");
      } else {
        alert("Error deleting product: " + (error.message || "Unknown error"));
      }
    }
  }

  async function toggleFeatured(product: any) {
    try {
      if (!product.is_featured) {
        const { data: featuredProducts } = await supabase.from("products").select("*").eq("is_featured", true);
        if (featuredProducts && featuredProducts.length >= 3) {
          alert("You can select maximum 3 featured products.");
          return;
        }
      }
      await supabase.from("products").update({ is_featured: !product.is_featured }).eq("id", product.id);
      loadProducts();
    } catch (error) {
      console.error("Error toggling featured:", error);
    }
  }

  async function toggleBestSeller(product: any) {
    try {
      await supabase.from("products").update({ is_best_seller: !product.is_best_seller }).eq("id", product.id);
      loadProducts();
    } catch (error) {
      console.error("Error toggling best seller:", error);
    }
  }

  function handleEdit(product: any) {
    setEditingProduct(product);
    setForm({
      name: product.name || "",
      name_ar: product.name_ar || "",
      description: product.description || "",
      description_ar: product.description_ar || "",
      short_description: product.short_description || "",
      short_description_ar: product.short_description_ar || "",
      price: product.price?.toString() || "",
      old_price: product.old_price?.toString() || "",
      category: product.category || "",
      category_id: product.category_id || "",
      gender: product.gender || "",
      size_ml: product.size_ml?.toString() || "",
      stock: product.stock?.toString() || "",
      stock_status: product.stock_status || "In Stock",
      is_featured: product.is_featured || false,
      is_best_seller: product.is_best_seller || false,
      is_active: product.is_active !== false,
    });
    setImagePreview(product.image_url || null);
    setShowForm(true);
  }

  if (loading) return <div className="min-h-screen flex items-center justify-center text-foreground">Loading...</div>;

  return (
    <div className="min-h-screen bg-[var(--background)] pt-20 md:pt-24 pb-12 px-4 md:px-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <motion.h1
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-2xl md:text-4xl text-foreground"
            style={{ fontFamily: "Playfair Display, serif" }}
          >
            Products Management
          </motion.h1>
          <motion.button
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            onClick={() => { setShowForm(true); setEditingProduct(null); resetForm(); }}
            className="flex items-center gap-2 px-4 md:px-6 py-2.5 md:py-3 bg-[var(--gold)] text-[var(--black)] tracking-wider uppercase text-xs md:text-sm hover:bg-[var(--gold-light)] transition-colors w-full sm:w-auto justify-center"
          >
            <Plus className="w-4 h-4" /> Add Product
          </motion.button>
        </div>

        {showForm && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-br from-[var(--black-soft)] to-[var(--burgundy-dark)] border border-[var(--border)] p-5 md:p-8 rounded-lg mb-8"
          >
            <h2 className="text-xl md:text-2xl text-foreground mb-6" style={{ fontFamily: "Playfair Display, serif" }}>
              {editingProduct ? "Edit Product" : "Add New Product"}
            </h2>

            {errorMessage && (
              <div className="mb-6 p-4 bg-red-500/20 border border-red-500 text-red-400">
                {errorMessage}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-[var(--muted-foreground)] text-xs md:text-sm tracking-wider uppercase mb-2">Product Name</label>
                  <input
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full px-4 md:px-5 py-3 bg-[var(--input-background)] border border-[var(--border)] text-foreground focus:outline-none focus:border-[var(--gold)]"
                  />
                </div>
                <div>
                  <label className="block text-[var(--muted-foreground)] text-xs md:text-sm tracking-wider uppercase mb-2">Product Name Arabic</label>
                  <input
                    dir="rtl"
                    value={form.name_ar}
                    onChange={(e) => setForm({ ...form, name_ar: e.target.value })}
                    className="w-full px-4 md:px-5 py-3 bg-[var(--input-background)] border border-[var(--border)] text-foreground focus:outline-none focus:border-[var(--gold)]"
                  />
                </div>
                <div>
                  <label className="block text-[var(--muted-foreground)] text-xs md:text-sm tracking-wider uppercase mb-2">Category</label>
                  <select
                    required
                    value={form.category_id}
                    onChange={(e) => {
                      const selectedCat = categories.find(cat => cat.id === e.target.value);
                      setForm({ ...form, category_id: e.target.value, category: selectedCat?.name || "" });
                    }}
                    className="w-full px-4 md:px-5 py-3 bg-[var(--input-background)] border border-[var(--border)] text-foreground focus:outline-none focus:border-[var(--gold)]"
                  >
                    <option value="">Select Category</option>
                    {categories.filter(cat => cat.is_active).map((cat) => (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-[var(--muted-foreground)] text-xs md:text-sm tracking-wider uppercase mb-2">Price ($)</label>
                  <input
                    required
                    type="number"
                    value={form.price}
                    onChange={(e) => setForm({ ...form, price: e.target.value })}
                    className="w-full px-4 md:px-5 py-3 bg-[var(--input-background)] border border-[var(--border)] text-foreground focus:outline-none focus:border-[var(--gold)]"
                  />
                </div>
                <div>
                  <label className="block text-[var(--muted-foreground)] text-xs md:text-sm tracking-wider uppercase mb-2">Old Price ($)</label>
                  <input
                    type="number"
                    value={form.old_price}
                    onChange={(e) => setForm({ ...form, old_price: e.target.value })}
                    className="w-full px-4 md:px-5 py-3 bg-[var(--input-background)] border border-[var(--border)] text-foreground focus:outline-none focus:border-[var(--gold)]"
                  />
                </div>
                <div>
                  <label className="block text-[var(--muted-foreground)] text-xs md:text-sm tracking-wider uppercase mb-2">Stock</label>
                  <input
                    required
                    type="number"
                    value={form.stock}
                    onChange={(e) => setForm({ ...form, stock: e.target.value })}
                    className="w-full px-4 md:px-5 py-3 bg-[var(--input-background)] border border-[var(--border)] text-foreground focus:outline-none focus:border-[var(--gold)]"
                  />
                </div>
                <div>
                  <label className="block text-[var(--muted-foreground)] text-xs md:text-sm tracking-wider uppercase mb-2">Stock Status</label>
                  <select
                    value={form.stock_status}
                    onChange={(e) => setForm({ ...form, stock_status: e.target.value })}
                    className="w-full px-4 md:px-5 py-3 bg-[var(--input-background)] border border-[var(--border)] text-foreground focus:outline-none focus:border-[var(--gold)]"
                  >
                    {STOCK_STATUSES.map((status) => (
                      <option key={status} value={status}>{status}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-[var(--muted-foreground)] text-xs md:text-sm tracking-wider uppercase mb-2">Size</label>
                  <select
                    required
                    value={form.size_ml}
                    onChange={(e) => setForm({ ...form, size_ml: e.target.value })}
                    className="w-full px-4 md:px-5 py-3 bg-[var(--input-background)] border border-[var(--border)] text-foreground focus:outline-none focus:border-[var(--gold)]"
                  >
                    <option value="">Select Size</option>
                    {SIZES.map((size) => (
                      <option key={size.value} value={size.value}>{size.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-[var(--muted-foreground)] text-xs md:text-sm tracking-wider uppercase mb-2">Gender</label>
                  <select
                    required
                    value={form.gender}
                    onChange={(e) => setForm({ ...form, gender: e.target.value })}
                    className="w-full px-4 md:px-5 py-3 bg-[var(--input-background)] border border-[var(--border)] text-foreground focus:outline-none focus:border-[var(--gold)]"
                  >
                    <option value="">Select Gender</option>
                    {GENDERS.map((gender) => (
                      <option key={gender} value={gender}>{gender}</option>
                    ))}
                  </select>
                </div>
                <div className="flex flex-wrap items-center gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={form.is_featured}
                      onChange={(e) => setForm({ ...form, is_featured: e.target.checked })}
                      className="w-4 h-4"
                    />
                    <span className="text-[var(--muted-foreground)] text-xs md:text-sm">{form.is_featured ? "Featured" : "Not Featured"}</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={form.is_best_seller}
                      onChange={(e) => setForm({ ...form, is_best_seller: e.target.checked })}
                      className="w-4 h-4"
                    />
                    <span className="text-[var(--muted-foreground)] text-xs md:text-sm">{form.is_best_seller ? "Best Seller" : "Not Best Seller"}</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={form.is_active}
                      onChange={(e) => setForm({ ...form, is_active: e.target.checked })}
                      className="w-4 h-4"
                    />
                    <span className="text-[var(--muted-foreground)] text-xs md:text-sm">{form.is_active ? "Active" : "Passive"}</span>
                  </label>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-[var(--muted-foreground)] text-xs md:text-sm tracking-wider uppercase mb-2">Short Description</label>
                  <textarea
                    value={form.short_description}
                    onChange={(e) => setForm({ ...form, short_description: e.target.value })}
                    rows={2}
                    className="w-full px-4 md:px-5 py-3 bg-[var(--input-background)] border border-[var(--border)] text-foreground focus:outline-none focus:border-[var(--gold)] resize-none"
                  />
                </div>
                <div>
                  <label className="block text-[var(--muted-foreground)] text-xs md:text-sm tracking-wider uppercase mb-2">Short Description Arabic</label>
                  <textarea
                    dir="rtl"
                    value={form.short_description_ar}
                    onChange={(e) => setForm({ ...form, short_description_ar: e.target.value })}
                    rows={2}
                    className="w-full px-4 md:px-5 py-3 bg-[var(--input-background)] border border-[var(--border)] text-foreground focus:outline-none focus:border-[var(--gold)] resize-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-[var(--muted-foreground)] text-xs md:text-sm tracking-wider uppercase mb-2">Description</label>
                  <textarea
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                    rows={4}
                    className="w-full px-4 md:px-5 py-3 bg-[var(--input-background)] border border-[var(--border)] text-foreground focus:outline-none focus:border-[var(--gold)] resize-none"
                  />
                </div>
                <div>
                  <label className="block text-[var(--muted-foreground)] text-xs md:text-sm tracking-wider uppercase mb-2">Description Arabic</label>
                  <textarea
                    dir="rtl"
                    value={form.description_ar}
                    onChange={(e) => setForm({ ...form, description_ar: e.target.value })}
                    rows={4}
                    className="w-full px-4 md:px-5 py-3 bg-[var(--input-background)] border border-[var(--border)] text-foreground focus:outline-none focus:border-[var(--gold)] resize-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[var(--muted-foreground)] text-xs md:text-sm tracking-wider uppercase mb-2">Product Image</label>
                <div className="flex flex-wrap items-center gap-4">
                  <label className="flex items-center gap-2 px-4 md:px-6 py-2.5 md:py-3 border border-[var(--gold)] text-[var(--gold)] hover:bg-[var(--gold)] hover:text-[var(--black)] transition-colors cursor-pointer">
                    <Upload className="w-4 h-4" />
                    {uploading ? "Uploading..." : "Upload Image"}
                    <input
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      onChange={handleImageFileChange}
                      className="hidden"
                      disabled={uploading}
                    />
                  </label>
                  {(imageFile || imagePreview) && (
                    <div className="flex items-center gap-3">
                      {imagePreview && (
                        <img src={imagePreview} alt="Preview" className="w-20 h-20 md:w-24 md:h-24 object-cover rounded border border-[var(--border)]" />
                      )}
                      <span className="text-foreground text-xs md:text-sm">{imageFile?.name || "Current image"}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <button type="submit" className="px-6 md:px-8 py-2.5 md:py-3 bg-[var(--gold)] text-[var(--black)] tracking-wider uppercase text-xs md:text-sm hover:bg-[var(--gold-light)] transition-colors w-full sm:w-auto" disabled={uploading || saving}>
                  {saving ? "Saving..." : (editingProduct ? "Update Product" : "Add Product")}
                </button>
                <button type="button" onClick={() => { setShowForm(false); setEditingProduct(null); resetForm(); }} className="px-6 md:px-8 py-2.5 md:py-3 border border-[var(--border)] text-[var(--muted-foreground)] tracking-wider uppercase text-xs md:text-sm hover:text-foreground transition-colors w-full sm:w-auto">
                  Cancel
                </button>
              </div>
            </form>
          </motion.div>
        )}

        <div className="bg-gradient-to-br from-[var(--black-soft)] to-[var(--burgundy-dark)] border border-[var(--border)] rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[var(--border)]">
                  <th className="text-left py-3 md:py-4 px-2 md:px-6 text-[var(--muted-foreground)] text-xs md:text-sm tracking-wider uppercase">Product</th>
                  <th className="text-left py-3 md:py-4 px-2 md:px-6 text-[var(--muted-foreground)] text-xs md:text-sm tracking-wider uppercase">Price</th>
                  <th className="text-left py-3 md:py-4 px-2 md:px-6 text-[var(--muted-foreground)] text-xs md:text-sm tracking-wider uppercase">Stock</th>
                  <th className="text-center py-3 md:py-4 px-2 md:px-6 text-[var(--muted-foreground)] text-xs md:text-sm tracking-wider uppercase">Featured</th>
                  <th className="text-center py-3 md:py-4 px-2 md:px-6 text-[var(--muted-foreground)] text-xs md:text-sm tracking-wider uppercase">Best</th>
                  <th className="text-left py-3 md:py-4 px-2 md:px-6 text-[var(--muted-foreground)] text-xs md:text-sm tracking-wider uppercase">Status</th>
                  <th className="text-right py-3 md:py-4 px-2 md:px-6 text-[var(--muted-foreground)] text-xs md:text-sm tracking-wider uppercase">Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product.id} className="border-b border-[var(--border)]/50">
                    <td className="py-3 md:py-4 px-2 md:px-6">
                      <div className="flex items-center gap-3">
                        {product.image_url && (
                          <img src={product.image_url} alt={product.name} className="w-10 h-10 md:w-16 md:h-16 object-cover rounded border border-[var(--border)]" />
                        )}
                        <div>
                          <p className="text-foreground text-sm md:text-base">{product.name}</p>
                          <p className="text-[var(--muted-foreground)] text-xs">{product.category}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 md:py-4 px-2 md:px-6 text-[var(--gold)] text-sm md:text-base">${Number(product.price).toLocaleString()}</td>
                    <td className="py-3 md:py-4 px-2 md:px-6 text-foreground text-sm md:text-base">{product.stock} ({product.stock_status})</td>
                    <td className="py-3 md:py-4 px-2 md:px-6 text-center">
                      <button
                        onClick={() => toggleFeatured(product)}
                        className={`p-1.5 md:p-2 rounded transition-colors ${
                          product.is_featured ? "text-[var(--gold)] bg-[var(--gold)]/10" : "text-[var(--muted-foreground)] hover:text-[var(--gold)]"
                        }`}
                      >
                        <Star className="w-4 h-4" />
                      </button>
                    </td>
                    <td className="py-3 md:py-4 px-2 md:px-6 text-center">
                      <button
                        onClick={() => toggleBestSeller(product)}
                        className={`p-1.5 md:p-2 rounded transition-colors ${
                          product.is_best_seller ? "text-[var(--gold)] bg-[var(--gold)]/10" : "text-[var(--muted-foreground)] hover:text-[var(--gold)]"
                        }`}
                      >
                        <Trophy className="w-4 h-4" />
                      </button>
                    </td>
                    <td className="py-3 md:py-4 px-2 md:px-6">
                      <span className={`px-2 py-1 md:px-3 md:py-1 rounded-full text-xs tracking-wider uppercase ${
                        product.is_active ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"
                      }`}>
                        {product.is_active ? "Active" : "Passive"}
                      </span>
                    </td>
                    <td className="py-3 md:py-4 px-2 md:px-6 text-right">
                      <div className="flex justify-end gap-1 md:gap-2">
                        <button onClick={() => handleEdit(product)} className="p-1.5 md:p-2 text-[var(--gold)] hover:bg-[var(--gold)]/10 rounded">
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button onClick={() => handleDelete(product.id)} className="p-1.5 md:p-2 text-red-400 hover:bg-red-500/10 rounded">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
