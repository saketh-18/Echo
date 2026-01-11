import type { Metadata } from "next";
import "./globals.css";
import SocketProvider from "@/providers/SocketProvider";
import AuthInitializer from "@/providers/authInitializer";
import RefreshWarning from "@/providers/RefreshWarning";
import StoreProvider from "@/providers/StoreProvider";

export const metadata: Metadata = {
  title: "Echo",
  description: "Conversations that return",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <StoreProvider>
          <AuthInitializer />
          <SocketProvider />
          <RefreshWarning />
          {children}
        </StoreProvider>
      </body>
    </html>
  );
}
