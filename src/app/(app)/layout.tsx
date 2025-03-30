"use client"
import { Toaster } from "@/components/ui/sonner";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export default function AppLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" className={inter.className}>
            <body suppressHydrationWarning>
                <main>
                    {children}
                </main>
                <Toaster />
            </body>
        </html>
    );
}