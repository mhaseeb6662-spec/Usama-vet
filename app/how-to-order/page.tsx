import Link from "next/link";
import { BreadcrumbsSchema, HowToOrderSchema } from "@/lib/seo/schema";
import HowToOrderGuide from "@/components/how-to-order/HowToOrderGuide";

export const metadata = {
  title: "How to Order",
  description:
    "Step-by-step guide to order veterinary medicines from Usamavet & Surgical. Guest checkout, Cash on Delivery, and order tracking across Pakistan.",
  alternates: {
    canonical: "/how-to-order",
  },
};

export default function HowToOrderPage() {
  const breadcrumbs = [
    { name: "Home", item: "/" },
    { name: "How to Order", item: "/how-to-order" },
  ];

  return (
    <div className="bg-slate-50 min-h-screen pb-16">
      <HowToOrderSchema />
      <BreadcrumbsSchema items={breadcrumbs} />
      <div className="max-w-4xl mx-auto px-4 pt-8">
        <p className="text-sm text-slate-500 mb-4">
          <Link href="/" className="hover:text-emerald-700">
            Home
          </Link>
          {" / "}
          How to Order
        </p>
        <HowToOrderGuide />
      </div>
    </div>
  );
}
