"use client";

import PaymentSuccess from "@/components/payment/PaymentSuccess";
import { Suspense } from "react";

export default function PaymentSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a] text-white">
          Loading...
        </div>
      }
    >
      <PaymentSuccess />
    </Suspense>
  );
}
