import { Suspense } from "react";
import RegisterForm from "@/components/account/RegisterForm";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Create Account",
  robots: { index: false, follow: false },
};

export default function AccountRegisterPage() {
  return (
    <div className="bg-slate-50 min-h-screen pb-16">
      <div className="max-w-md mx-auto px-4 pt-10">
        <Suspense fallback={<p className="text-center text-slate-500">Loading registration...</p>}>
          <RegisterForm />
        </Suspense>
      </div>
    </div>
  );
}
