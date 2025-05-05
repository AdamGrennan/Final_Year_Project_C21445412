"use client";
import { usePathname } from "next/navigation";
import { MainSidebar } from "@/components/sidebar-components/MainSidebar";

export default function ClientLayout({ children }) {
  const pathname = usePathname();
  const noSidebarRoutes = ["/", "/register"];
  const isNoSidebarRoute = noSidebarRoutes.includes(pathname);

  return isNoSidebarRoute ? (
    <main className="min-h-screen flex flex-col justify-center items-center">
      {children}
    </main>
  ) : (
    <MainSidebar>{children}</MainSidebar>
  );
}
