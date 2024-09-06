"use client";

import { Button } from "@/components/ui/button";
import { UserButton } from "@clerk/nextjs";
import { LogOut } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const NavbarRoutes = () => {
  const pathname = usePathname();
  const isAdminPage = pathname.startsWith("/admin");
  const isPlayerPage = pathname.startsWith("/jobs");
  return (
    <div className="flex gap-x-3 ml-auto">
      <div className="flex gap-x-2 ml-auto">
        {isAdminPage || isPlayerPage ? (
          <Link href="/">
            <Button
              variant={"outline"}
              size={"sm"}
              className="border-purple-700/20"
            >
              <LogOut />
              Exit
            </Button>
          </Link>
        ) : (
          <Link href="/admin/jobs">
            <Button
              variant={"outline"}
              size={"sm"}
              className="border-purple-700/20"
            >
              Admin Module
            </Button>
          </Link>
        )}

        <UserButton afterSwitchSessionUrl="/"/>
      </div>
    </div>
  );
};

export default NavbarRoutes;
