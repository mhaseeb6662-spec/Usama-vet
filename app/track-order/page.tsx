import TrackOrderForm from "@/components/orders/TrackOrderForm";

export const metadata = {
  title: "Track Order",
  robots: { index: false, follow: false },
};

export default function TrackOrderPage() {
  return (
    <div className="bg-slate-50 min-h-screen pb-16">
      <div className="max-w-xl mx-auto px-4 pt-8">
        <h1 className="text-2xl font-bold text-slate-900 mb-6">Track Your Order</h1>
        <TrackOrderForm />
      </div>
    </div>
  );
}
