import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import NavBar from "./Components/NavBar/NavBar";
import { CartProvider } from "./order/CartContext";
import AuthContext from "./Components/Auth/AuthContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Chia's Economic Rice",
  description: "Order Economic rice for pick up in advance",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-green-50`}
      >
        <NavBar/>
        <AuthContext>
          <CartProvider>
            {children}
          </CartProvider>
        </AuthContext>
      </body>
    </html>
  );
}
