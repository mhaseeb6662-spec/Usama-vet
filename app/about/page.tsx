import { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Us | Usama Vet",
  description: "Learn about Usama Vet Care, your trusted destination for veterinary medicines, livestock products, poultry supplements, and pet care essentials in Pakistan.",
  alternates: {
    canonical: "/about",
  },
};

export default function AboutPage() {
  return (
    <div className="flex min-h-screen flex-col bg-slate-50">
      <div className="bg-emerald-800 text-white py-16 sm:py-24 text-center">
        <h1 className="text-3xl sm:text-5xl font-bold mb-4">About Usama Vet</h1>
        <p className="text-emerald-100 max-w-2xl mx-auto px-4 text-lg">
          Your trusted partner in veterinary medicine, livestock care, and pet health across Pakistan.
        </p>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-16 space-y-12 text-slate-700">
        <section>
          <h2 className="text-2xl font-bold text-emerald-800 mb-4">Our Story</h2>
          <p className="leading-relaxed">
            Founded with a vision to revolutionize animal healthcare in Pakistan, Usama Vet has grown to become a leading provider of high-quality veterinary medicines, supplements, and farm essentials. We understand the critical role that healthy livestock and pets play in our lives and economy.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-emerald-800 mb-4">Our Mission</h2>
          <p className="leading-relaxed">
            To provide accessible, affordable, and authentic veterinary products to farmers, pet owners, and veterinarians. We strive to ensure the well-being of animals through quality products and expert guidance.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-emerald-800 mb-4">Why Choose Us?</h2>
          <ul className="list-disc pl-5 space-y-2">
            <li>100% Authentic and verified products.</li>
            <li>Nationwide delivery across Pakistan.</li>
            <li>Expert veterinary consultation and advice.</li>
            <li>Comprehensive range of livestock, poultry, and pet care essentials.</li>
          </ul>
        </section>
      </div>
    </div>
  );
}
