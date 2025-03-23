import { Toaster } from "@/components/ui/sonner";

export default function AppLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body className="antialiased">
            {children}
            <Toaster />
            </body>
        </html>
    );
}