import React from "react";
import Link from "next/link";
import { 
  LayoutDashboard, 
  Package, 
  Tags, 
  MessageSquare, 
  Settings, 
  LogOut,
  ShoppingCart,
  Users,
  MonitorPlay,
  LayoutTemplate
} from "lucide-react";
import { logout } from "@/lib/session";
import { redirect } from "next/navigation";

export const metadata = {
  title: "Admin Dashboard",
};

export const dynamic = 'force-dynamic';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  async function handleLogout() {
    "use server";
    await logout();
    redirect("/admin/login");
  }

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col hidden md:flex shrink-0 h-screen sticky top-0">
        <div className="p-6 border-b border-slate-800">
          <h2 className="text-xl font-bold text-white tracking-tight">Usama Vet Admin</h2>
        </div>
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 mt-4 px-3">Dashboard</div>
          <Link href="/admin" className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-slate-800 hover:text-white transition-colors">
            <LayoutDashboard className="w-5 h-5 text-slate-400" /> Dashboard
          </Link>
          
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 mt-6 px-3">Catalog</div>
          <Link href="/admin/products" className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-slate-800 hover:text-white transition-colors">
            <Package className="w-5 h-5 text-slate-400" /> Products
          </Link>
          <Link href="/admin/categories" className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-slate-800 hover:text-white transition-colors">
            <Tags className="w-5 h-5 text-slate-400" /> Categories
          </Link>

          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 mt-6 px-3">Homepage CMS</div>
          <Link href="/admin/hero" className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-slate-800 hover:text-white transition-colors">
            <MonitorPlay className="w-5 h-5 text-slate-400" /> Hero Slider
          </Link>
          <Link href="/admin/banners" className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-slate-800 hover:text-white transition-colors">
            <LayoutTemplate className="w-5 h-5 text-slate-400" /> Promotional Banners
          </Link>

          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 mt-6 px-3">Sales & Customers</div>
          <Link href="/admin/orders" className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-slate-800 hover:text-white transition-colors">
            <ShoppingCart className="w-5 h-5 text-slate-400" /> Orders
          </Link>
          <Link href="/admin/customers" className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-slate-800 hover:text-white transition-colors">
            <Users className="w-5 h-5 text-slate-400" /> Customers
          </Link>
          <Link href="/admin/reviews" className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-slate-800 hover:text-white transition-colors">
            <MessageSquare className="w-5 h-5 text-slate-400" /> Reviews
          </Link>

          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 mt-6 px-3">System</div>
          <Link href="/admin/settings" className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-slate-800 hover:text-white transition-colors">
            <Settings className="w-5 h-5 text-slate-400" /> Settings
          </Link>
        </nav>
        <div className="p-4 border-t border-slate-800">
          <form action={handleLogout}>
            <button type="submit" className="flex w-full items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-red-500/10 text-red-400 hover:text-red-300 transition-colors">
              <LogOut className="w-5 h-5" /> Logout
            </button>
          </form>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-h-screen">
        {/* Mobile Header (basic) */}
        <header className="md:hidden bg-slate-900 text-white p-4 flex justify-between items-center">
          <h2 className="font-bold">Usama Vet Admin</h2>
          <button className="p-2 bg-slate-800 rounded">Menu</button>
        </header>
        
        <div className="p-6 md:p-8 flex-1 overflow-x-hidden">
          {children}
        </div>
      </main>
    </div>
  );
}
