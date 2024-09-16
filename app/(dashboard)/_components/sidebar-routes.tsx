"use client";

import {
  BookMarked,
  BookmarkIcon,
  Compass,
  Home,
  List,
  UserIcon,
} from "lucide-react";
import { usePathname } from "next/navigation";
import React from "react";
import { SideBarRouteItem } from "./sidebar-route-item";

const adminRoutes = [
  {
    icon: List,
    label: "Jobs",
    href: "/admin/jobs",
  },
  {
    icon: List,
    label: "Companies",
    href: "/admin/companies",
  },
  {
    icon: Compass,
    label: "Analytics",
    href: "/admin/analytics",
  },
];
const guestRoutes = [
  {
    icon: Home,
    label: "Home",
    href: "/",
  },
  {
    icon: UserIcon,
    label: "Profile",
    href: "/user",
  },
  {
    icon: Compass,
    label: "Search",
    href: "/search",
  },
  {
    icon: BookMarked,
    label: "Saved jobs",
    href: "/savedjobs",
  },
];
const SidebarRoutes = () => {
  const pathname = usePathname();
  // const router = useRouter();

  const isAdminPage = pathname?.startsWith("/admin");
  const routes = isAdminPage ? adminRoutes : guestRoutes;

  return (
    <div className="flex flex-col w-full">
      {routes.map((route, index) => (
        <SideBarRouteItem
          key="/"
          icon={route.icon}
          label={route.label}
          href={route.href}
        />
      ))}
    </div>
  );
};

export default SidebarRoutes;
