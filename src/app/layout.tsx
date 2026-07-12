import type { Metadata } from "next";
import "./globals.css";
import SmoothScroll from "@/components/SmoothScroll";
import Navbar from "@/components/shared/Navbar";
import { Toaster } from "sonner";
import Footer from "@/components/shared/Footer";

export const metadata: Metadata = {
  title: "Kairo",
  description:
    "Kairo Events is a full-stack event ticketing platform where users can discover events, purchase tickets securely, and manage their bookings",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Toaster position="top-center" richColors />
        <SmoothScroll>
          <Navbar />
          <main>{children}</main>
          <Footer />
        </SmoothScroll>
      </body>
    </html>
  );
}
