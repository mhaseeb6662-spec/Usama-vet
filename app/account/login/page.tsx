import { Suspense } from "react";
import LoginForm from "@/components/account/LoginForm";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Login",
  robots: { index: false, follow: false },
};

export default function AccountLoginPage() {
  return (
    <div className="bg-slate-50 min-h-screen pb-16">
      <div className="max-w-md mx-auto px-3 sm:px-4 pt-6 sm:pt-10">
        <Suspense fallback={<p className="text-center text-slate-500">Loading login...</p>}>
          <LoginForm />
        </Suspense>
      </div>
    </div>
  );
}
