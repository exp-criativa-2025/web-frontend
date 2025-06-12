import type { Metadata } from "next";
import "@/app/globals.css";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { SiteHeader } from "@/components/site-header";

import { OrgProvider } from "@/app/providers/OrgProvider";
import { ThemeProvider } from "@/components/theme-provider";
import { NewEntryProvider } from "@/app/providers/NewEntryProvider";


export const metadata: Metadata = {
  title: "Treko",
  description: "Your best donation history",
};

export default function BaseLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  return (
    <html>
      <link rel="icon" href="/favicon.svg" />
      <body className="w-screen h-screen">
        <ThemeProvider>
          <SidebarProvider>
            <AppSidebar variant="inset" />
            <SidebarInset>
            <NewEntryProvider>
              <SiteHeader />
            </NewEntryProvider>
              <div className="flex flex-1 flex-col">
                <div className="@container/main flex flex-1 flex-col gap-2">
                  <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
                    <OrgProvider>
                      {children}
                    </OrgProvider>
                  </div>
                </div>
              </div>
            </SidebarInset>
          </SidebarProvider>
        </ThemeProvider>

      </body>
    </html>
  );
}
