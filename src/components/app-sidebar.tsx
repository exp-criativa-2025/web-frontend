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
import api, { getAvatarUrl } from "@/lib/api";

const navMainItems = [
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
    title: "Usuários",
    url: "/users",
    icon: User,
  },
  {
    title: "Doações",
    url: "/donations",
    icon: DollarSign,
  },
];

const navSecondaryItems = [
  {
    title: "Configurações",
    url: "#",
    icon: IconSettings,
  },
];

const navCollapsableItems = [
  {
    title: "Entidades",
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
];

interface User {
  name: string;
  email: string;
  avatar?: string;
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const [user, setUser] = React.useState<User | null>(null);
  const [loadingUser, setLoadingUser] = React.useState(true);

  React.useEffect(() => {
    async function fetchUser() {
      try {
        // Ajuste a URL para seu endpoint real de usuário atual
        const res = await api.get("/me");
        const data = await res.data;
        setUser({
          name: data.name,
          email: data.email,
          avatar: getAvatarUrl(data.avatar) ?? "/avatars/default.jpg",
        });
      } catch {
        setUser({
          name: "Usuário",
          email: "usuario@exemplo.com",
          avatar: "/avatars/default.jpg",
        });
      } finally {
        setLoadingUser(false);
      }
    }
    fetchUser();
  }, []);

  // Pode colocar um loading aqui ou placeholder caso queira
  if (loadingUser) {
    return (
      <Sidebar collapsible="offcanvas" {...props}>
        <SidebarHeader>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild className="p-1.5 hover:bg-transparent focus:bg-transparent">
                <a href="/modules/base/dashboards">
                  <Image
                    src={TrekoLogo}
                    width={120}
                    height={50}
                    alt="Treko"
                    className="dark:invert"
                  />
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarHeader>
        <SidebarContent>
          {/* aqui pode ter algum spinner se quiser */}
        </SidebarContent>
        <SidebarFooter className="flex flex-row items-center justify-center gap-1">
          <ModeToggle />
          {/* placeholder user loading */}
          <NavUser user={{ name: "Carregando...", email: "", avatar: "/avatars/default.jpg" }} />
        </SidebarFooter>
      </Sidebar>
    );
  }

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
                />
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={navMainItems} />
        <NavCollapsable items={navCollapsableItems} />
        <NavSecondary items={navSecondaryItems} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter className="flex flex-row items-center justify-center gap-1">
        <ModeToggle />
        {user && <NavUser user={user} />}
      </SidebarFooter>
    </Sidebar>
  );
}
