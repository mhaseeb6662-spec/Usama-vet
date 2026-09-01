import CheckoutForm from "@/components/checkout/CheckoutForm";

export const metadata = {
  title: "Checkout",
  robots: { index: false, follow: false },
};

export default function CheckoutPage() {
  return (
    <div className="bg-slate-50 min-h-screen pb-16">
      <div className="max-w-6xl mx-auto px-4 pt-8">
        <h1 className="sr-only">Checkout</h1>
        <CheckoutForm />
      </div>
    </div>
  );
}
