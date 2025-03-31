import type { Metadata } from "next";
import "./globals.css";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "../components/ui/app-sidebar";

export const metadata: Metadata = {
  title: "Treko",
  description: "Your best donation history",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html>
      <link rel="icon" href="/favicon.svg" />

      <body>
        <SidebarProvider>
          <AppSidebar />
          <main>
            <SidebarTrigger />
            {children}
          </main>
        </SidebarProvider>
      </body>
    </html>
  );
}
