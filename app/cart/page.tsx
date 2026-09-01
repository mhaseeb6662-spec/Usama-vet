import CartView from "@/components/cart/CartView";

export const metadata = {
  title: "Cart",
  robots: { index: false, follow: false },
};

export default function CartPage() {
  return (
    <div className="bg-slate-50 min-h-screen pb-16">
      <div className="max-w-6xl mx-auto px-4 pt-8">
        <h1 className="text-2xl md:text-3xl font-bold text-slate-900 mb-6">Your Cart</h1>
        <CartView />
      </div>
    </div>
  );
}
