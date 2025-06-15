"use client";

import * as React from "react";
import { IconDashboard, IconSettings } from "@tabler/icons-react";

import { NavMain } from "@/components/nav-main";
import { NavSecondary } from "@/components/nav-secondary";
import { NavUser } from "@/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Building, DollarSign, User } from "lucide-react";
import Image from "next/image";

import TrekoLogo from "@/app/assets/treko_logo.svg";
import { NavCollapsable } from "./nav-collapsable";
import { ModeToggle } from "./theme-switcher";
import { useUser } from "@/providers/UserProvider";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { user } = useUser();

  // Fallback user data when no user is logged in
  const userData = {
    name: user?.name || "Usuário",
    email: user?.email || "usuario@example.com",
    avatar: user?.avatar || "/avatars/shadcn.jpg",
  };

  const data = {
    user: userData,

    navMain: [
      {
        title: "Dashboard",
        url: "/dashboards",
        icon: IconDashboard,
      },
      {
        title: "Campanhas",
        url: "/campaigns",
        icon: IconDashboard,
      },
      {
        title: "Representantes",
        url: "/representatives",
        icon: User,
      },
      {
        title: "Doações",
        url: "/donations",
        icon: DollarSign,
      },
    ],

    navSecondary: [
      {
        title: "Configurações",
        url: "#",
        icon: IconSettings,
      },
    ],

    navCollapsable: [
      {
        title: "Entidades",
        url: "/orgs",
        icon: Building,
        items: [
          {
            title: "Todos",
            url: "/orgs/all",
          },
          {
            title: "Centro Acadêmico",
            url: "/orgs/academic_center",
          },
          {
            title: "Diretório Central",
            url: "/orgs/central_directory",
          },
        ],
      },
    ],
  };

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5 hover:bg-transparent focus:bg-transparent"
            >
              <a href="/modules/base/dashboards">
                <Image
                  src={TrekoLogo}
                  width={120}
                  height={50}
                  alt="Treko"
                  className="dark:invert"
                ></Image>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavCollapsable items={data.navCollapsable} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter className="flex flex-row items-center justify-center  gap-1">
        <ModeToggle />
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  );
}
