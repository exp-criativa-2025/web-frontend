"use client";

import { ChevronRight } from "lucide-react";
import Link from "next/link";
import React from "react";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
} from "@/components/ui/sidebar";

export function NavCollapsable({
  items,
}: {
  items: {
    title: string;
    url: string;
    icon?: React.ElementType;
    isActive?: boolean;
    items?: {
      title: string;
      url: string;
    }[];
  }[];
}) {
  return (
    <SidebarGroup>
      <SidebarGroupLabel>Business</SidebarGroupLabel>
      <SidebarMenu>
        {items.map((item) => (
          <Collapsible
            key={item.title}
            defaultOpen={item.isActive}
          >
            <SidebarMenuItem>
              <SidebarMenuButton tooltip={item.title} className="flex items-center">
                {item.icon && <item.icon className="mr-2" />}

                  <span>{item.title}</span>

                {item.items && (
                  <CollapsibleTrigger asChild>
                    <div aria-label="Toggle submenu" className="ml-2">
                      <ChevronRight
                        className="transition-transform duration-200 data-[state=open]:rotate-90"
                      />
                    </div>
                  </CollapsibleTrigger>
                )}
              </SidebarMenuButton>

              {/* submenu */}
              {item.items && (
                <CollapsibleContent>
                  <SidebarMenuSub>
                    {item.items.map((sub) => (
                      <SidebarMenuSubItem key={sub.title}>
                        <SidebarMenuSubButton asChild>
                          <Link href={sub.url}>
                            <span>{sub.title}</span>
                          </Link>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    ))}
                  </SidebarMenuSub>
                </CollapsibleContent>
              )}
            </SidebarMenuItem>
          </Collapsible>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}
