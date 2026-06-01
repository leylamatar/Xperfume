import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";
import { motion } from "motion/react";
import { Plus, Edit, Trash2, Save, X, Check } from "lucide-react";

function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .trim();
}

export function AdminCategoriesPage() {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState<any>(null);
  const [form, setForm] = useState({
    name: "",
    name_ar: "",
    slug: "",
    description: "",
    description_ar: "",
    is_active: true,
    sort_order: 0,
  });

  useEffect(() => {
    loadCategories();
  }, []);

  async function loadCategories() {
    try {
      const { data } = await supabase
        .from("categories")
        .select("*")
        .order("sort_order", { ascending: true });
      setCategories(data || []);
    } catch (error) {
      console.error("Error loading categories:", error);
    } finally {
      setLoading(false);
    }
  }

  function handleNew() {
    setEditingCategory(null);
    setForm({
      name: "",
      name_ar: "",
      slug: "",
      description: "",
      description_ar: "",
      is_active: true,
      sort_order: categories.length + 1,
    });
    setShowForm(true);
  }

  function handleEdit(category: any) {
    setEditingCategory(category);
    setForm({
      name: category.name,
      name_ar: category.name_ar || "",
      slug: category.slug,
      description: category.description || "",
      description_ar: category.description_ar || "",
      is_active: category.is_active !== false,
      sort_order: category.sort_order || 0,
    });
    setShowForm(true);
  }

  async function handleDelete(id: string) {
    if (!confirm("Are you sure you want to delete this category?")) return;
    try {
      // First check if there are products in this category
      const { count, error: countError } = await supabase
        .from("products")
        .select("*", { count: "exact", head: true })
        .eq("category_id", id);
      
      if (countError) throw countError;
      
      if (count && count > 0) {
        alert(`Cannot delete: this category has ${count} product(s) linked to it. Please reassign or delete those products first.`);
        return;
      }
      
      const { error } = await supabase.from("categories").delete().eq("id", id);
      if (error) throw error;
      loadCategories();
    } catch (error: any) {
      console.error("Error deleting category:", error);
      if (error.code === "23503") {
        alert("Cannot delete: this category has products linked to it. Please reassign or delete those products first.");
      } else {
        alert("Error deleting category: " + (error.message || "Unknown error"));
      }
    }
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    try {
      const dataToSave = {
        ...form,
        updated_at: new Date().toISOString(),
      };

      let error;
      if (editingCategory) {
        const result = await supabase
          .from("categories")
          .update(dataToSave)
          .eq("id", editingCategory.id);
        error = result.error;
      } else {
        const result = await supabase.from("categories").insert([dataToSave]);
        error = result.error;
      }

      if (error) throw error;
      setShowForm(false);
      loadCategories();
    } catch (error) {
      console.error("Error saving category:", error);
      alert("Error saving category");
    }
  }

  if (loading) return <div className="min-h-screen flex items-center justify-center text-foreground">Loading...</div>;

  return (
    <div className="min-h-screen bg-[var(--background)] pt-24 pb-12 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl text-foreground"
            style={{ fontFamily: "Playfair Display, serif" }}
          >
            Categories
          </motion.h1>
          <motion.button
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            onClick={handleNew}
            className="flex items-center gap-2 px-6 py-3 bg-[var(--gold)] text-[var(--black)] tracking-wider uppercase hover:bg-[var(--gold-light)] transition-colors"
          >
            <Plus className="w-4 h-4" /> Add Category
          </motion.button>
        </div>

        {showForm && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-br from-[var(--black-soft)] to-[var(--burgundy-dark)] border border-[var(--border)] p-8 rounded-lg mb-8"
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl text-foreground" style={{ fontFamily: "Playfair Display, serif" }}>
                {editingCategory ? "Edit Category" : "New Category"}
              </h2>
              <button onClick={() => setShowForm(false)} className="text-[var(--muted-foreground)] hover:text-foreground">
                <X className="w-6 h-6" />
              </button>
            </div>
            <form onSubmit={handleSave} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-[var(--muted-foreground)] text-sm tracking-wider uppercase mb-2">Name *</label>
                  <input
                    type="text"
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value, slug: slugify(e.target.value) })}
                    className="w-full px-5 py-3 bg-[var(--input-background)] border border-[var(--border)] text-foreground focus:outline-none focus:border-[var(--gold)]"
                  />
                </div>
                <div>
                  <label className="block text-[var(--muted-foreground)] text-sm tracking-wider uppercase mb-2">Name Arabic</label>
                  <input
                    type="text"
                    dir="rtl"
                    value={form.name_ar}
                    onChange={(e) => setForm({ ...form, name_ar: e.target.value })}
                    className="w-full px-5 py-3 bg-[var(--input-background)] border border-[var(--border)] text-foreground focus:outline-none focus:border-[var(--gold)]"
                  />
                </div>
                <div>
                  <label className="block text-[var(--muted-foreground)] text-sm tracking-wider uppercase mb-2">Slug *</label>
                  <input
                    type="text"
                    required
                    value={form.slug}
                    onChange={(e) => setForm({ ...form, slug: e.target.value })}
                    className="w-full px-5 py-3 bg-[var(--input-background)] border border-[var(--border)] text-foreground focus:outline-none focus:border-[var(--gold)]"
                  />
                </div>
                <div>
                  <label className="block text-[var(--muted-foreground)] text-sm tracking-wider uppercase mb-2">Sort Order</label>
                  <input
                    type="number"
                    value={form.sort_order}
                    onChange={(e) => setForm({ ...form, sort_order: Number(e.target.value) })}
                    className="w-full px-5 py-3 bg-[var(--input-background)] border border-[var(--border)] text-foreground focus:outline-none focus:border-[var(--gold)]"
                  />
                </div>
                <div className="flex items-end">
                  <label className="flex items-center gap-3 px-5 py-3 border border-[var(--border)] text-foreground cursor-pointer hover:border-[var(--gold)]">
                    <input
                      type="checkbox"
                      checked={form.is_active}
                      onChange={(e) => setForm({ ...form, is_active: e.target.checked })}
                      className="w-4 h-4"
                    />
                    <span className="text-sm tracking-wider uppercase">Active</span>
                  </label>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-[var(--muted-foreground)] text-sm tracking-wider uppercase mb-2">Description</label>
                  <textarea
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                    rows={4}
                    className="w-full px-5 py-3 bg-[var(--input-background)] border border-[var(--border)] text-foreground focus:outline-none focus:border-[var(--gold)] resize-none"
                  />
                </div>
                <div>
                  <label className="block text-[var(--muted-foreground)] text-sm tracking-wider uppercase mb-2">Description Arabic</label>
                  <textarea
                    dir="rtl"
                    value={form.description_ar}
                    onChange={(e) => setForm({ ...form, description_ar: e.target.value })}
                    rows={4}
                    className="w-full px-5 py-3 bg-[var(--input-background)] border border-[var(--border)] text-foreground focus:outline-none focus:border-[var(--gold)] resize-none"
                  />
                </div>
              </div>
              <div className="flex gap-4">
                <button
                  type="submit"
                  className="flex items-center gap-2 px-6 py-3 bg-[var(--gold)] text-[var(--black)] tracking-wider uppercase hover:bg-[var(--gold-light)] transition-colors"
                >
                  <Save className="w-4 h-4" /> Save
                </button>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="px-6 py-3 border border-[var(--border)] text-[var(--muted-foreground)] tracking-wider uppercase hover:border-[var(--gold)] hover:text-[var(--gold)] transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </motion.div>
        )}

        <div className="bg-gradient-to-br from-[var(--black-soft)] to-[var(--burgundy-dark)] border border-[var(--border)] rounded-lg overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[var(--border)]">
                <th className="text-left px-6 py-4 text-[var(--muted-foreground)] text-sm tracking-wider uppercase">Name</th>
                <th className="text-left px-6 py-4 text-[var(--muted-foreground)] text-sm tracking-wider uppercase">Slug</th>
                <th className="text-center px-6 py-4 text-[var(--muted-foreground)] text-sm tracking-wider uppercase">Active</th>
                <th className="text-center px-6 py-4 text-[var(--muted-foreground)] text-sm tracking-wider uppercase">Sort</th>
                <th className="text-right px-6 py-4 text-[var(--muted-foreground)] text-sm tracking-wider uppercase">Actions</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((category) => (
                <tr key={category.id} className="border-b border-[var(--border)] hover:bg-[var(--black-soft)]">
                  <td className="px-6 py-4 text-foreground">{category.name}</td>
                  <td className="px-6 py-4 text-[var(--muted-foreground)] text-sm">{category.slug}</td>
                  <td className="px-6 py-4 text-center">
                    {category.is_active ? (
                      <Check className="w-5 h-5 text-[var(--gold)] mx-auto" />
                    ) : (
                      <X className="w-5 h-5 text-[var(--muted-foreground)] mx-auto" />
                    )}
                  </td>
                  <td className="px-6 py-4 text-center text-[var(--muted-foreground)]">{category.sort_order}</td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => handleEdit(category)}
                        className="p-2 text-[var(--muted-foreground)] hover:text-[var(--gold)] transition-colors"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(category.id)}
                        className="p-2 text-[var(--muted-foreground)] hover:text-red-400 transition-colors"
                      >
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
  );
}
