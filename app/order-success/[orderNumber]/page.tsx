import Link from "next/link";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import { CheckCircle2, Phone, MessageCircle } from "lucide-react";
import { BUSINESS_CONFIG } from "@/lib/constants/config";
import { getOrderForReceipt } from "@/lib/services/orders";

export const metadata = {
  title: "Order Placed",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

const PROCESS_STEPS = [
  {
    title: "1. Order Placed",
    en: "Your order has been successfully received.",
    ur: "Aap ka order successfully receive ho gaya hai.",
  },
  {
    title: "2. Confirmation Call",
    en: "Our support team may contact you to verify your order.",
    ur: "Hamari team order verify karne ke liye aap se rabta karegi.",
  },
  {
    title: "3. Order Verified",
    en: "Order details and delivery information are confirmed.",
    ur: "Product aur delivery details confirm ki jayengi.",
  },
  {
    title: "4. Dispatch",
    en: "Your order is prepared and dispatched.",
    ur: "Verification ke baad order dispatch kiya jayega.",
  },
  {
    title: "5. Delivery",
    en: "Your order is delivered to your address.",
    ur: "Order aap ke address par deliver kiya jayega.",
  },
];

export default async function OrderSuccessPage({
  params,
}: {
  params: Promise<{ orderNumber: string }>;
}) {
  const { orderNumber } = await params;
  const receipt = (await cookies()).get("order_receipt")?.value;
  if (receipt !== orderNumber) {
    notFound();
  }

  const order = await getOrderForReceipt(orderNumber);
  if (!order) {
    notFound();
  }

  return (
    <div className="bg-slate-50 min-h-screen pb-16">
      <div className="max-w-4xl mx-auto px-4 pt-8 space-y-6">
        <div className="bg-white border border-slate-200 rounded-2xl p-6 md:p-8 text-center">
          <CheckCircle2 className="w-14 h-14 text-emerald-600 mx-auto mb-3" />
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900">Order Placed Successfully</h1>
          <p className="text-slate-600 mt-3">
            Thank you for your order. Our team will contact you to confirm your order before dispatch.
          </p>
          <p className="mt-4 font-semibold text-emerald-700">Order Number: {order.orderNumber}</p>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-2 text-sm">
          <p><span className="font-semibold">Customer Name:</span> {order.customerName}</p>
          <p><span className="font-semibold">Phone:</span> {order.phone}</p>
          <p><span className="font-semibold">Delivery Address:</span> {order.address}, {order.city}</p>
          <p><span className="font-semibold">Payment:</span> Cash on Delivery</p>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-3">
          <h2 className="font-bold text-slate-900">Order Items</h2>
          {order.items.map((item) => (
            <div key={item.id} className="flex justify-between text-sm">
              <span>{item.productNameSnapshot} × {item.quantity}</span>
              <span>Rs. {Number(item.totalPrice).toLocaleString()}</span>
            </div>
          ))}
          <div className="border-t border-slate-100 pt-3 font-bold flex justify-between">
            <span>Grand Total</span>
            <span>Rs. {Number(order.total).toLocaleString()}</span>
          </div>
        </div>

        <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6">
          <h2 className="font-bold text-slate-900 mb-2">Need help with your order?</h2>
          <p className="text-sm text-slate-600 mb-3">Support:</p>
          <div className="flex flex-wrap gap-3">
            <a href={`tel:${BUSINESS_CONFIG.contact.phone}`} className="inline-flex items-center gap-2 bg-white border border-emerald-200 rounded-lg px-4 py-2 font-semibold text-emerald-700">
              <Phone className="w-4 h-4" /> {BUSINESS_CONFIG.contact.phoneDisplay}
            </a>
            <a href={BUSINESS_CONFIG.contact.whatsapp} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 bg-[#009473] text-white rounded-lg px-4 py-2 font-semibold">
              <MessageCircle className="w-4 h-4" /> WhatsApp
            </a>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-6">
          <h2 className="font-bold text-slate-900 mb-4">Order Process</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {PROCESS_STEPS.map((step) => (
              <div key={step.title} className="border border-slate-100 rounded-xl p-4">
                <h3 className="font-semibold text-slate-900">{step.title}</h3>
                <p className="text-sm text-slate-600 mt-1">{step.en}</p>
                <p className="text-sm text-slate-500 mt-1">{step.ur}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="text-center">
          <Link href="/track-order" className="text-emerald-700 font-semibold">Track Your Order</Link>
        </div>
      </div>
    </div>
  );
}
