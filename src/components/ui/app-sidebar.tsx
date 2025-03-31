import {
  DollarSignIcon,
  HouseIcon,
  LayoutDashboardIcon,
  Settings,
  User,
} from "lucide-react";
import TrekoLogo from "@/app/assets/treko_logo.svg";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import Image from "next/image";

// Menu items.
const items = [
  {
    title: "Dashboard",
    url: "#",
    icon: LayoutDashboardIcon,
  },
  {
    title: "Entidades",
    url: "#",
    icon: HouseIcon,
  },
  {
    title: "Representantes",
    url: "#",
    icon: User,
  },
  {
    title: "Doações",
    url: "#",
    icon: DollarSignIcon,
  },
  {
    title: "Configurações",
    url: "#",
    icon: Settings,
  },
];

const entities = [
  {
    title: "Centros Acadêmicos",
    url: "#",
  },
  {
    title: "Atléticas",
    url: "#",
  },
  {
    title: "Diretório Central",
    url: "#",
  }
]

export function AppSidebar() {
  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>
            <div className="my-4 flex items-center justify-center">
              <Image
                src={TrekoLogo}
                alt="Treko SVG"
                width={120}
                height={15}
              ></Image>
            </div>
          </SidebarGroupLabel>
          <SidebarGroupContent className="my-4">
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
