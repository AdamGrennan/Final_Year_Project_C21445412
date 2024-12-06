// layout.jsx in src/app
"use client";
import { UserProvider } from "@/context/UserContext";
import { MainSidebar } from "@/components/main-sidebar";
import { usePathname } from "next/navigation";
import "@/styles/global.css";

export default function RootLayout({ children }) {
  const pathname = usePathname();
  const noSidebarRoutes = ["/", "/Register"];
  const isNoSidebarRoute = noSidebarRoutes.includes(pathname);

  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Urbanist:ital,wght@0,100..900;1,100..900&display=swap" rel="stylesheet" />
      </head>
      <body>
        <UserProvider>
          {isNoSidebarRoute ? (
            <main className="min-h-screen flex flex-col justify-center items-center">
              {children}
            </main>
          ) : (
            <MainSidebar>{children}</MainSidebar>
          )}
        </UserProvider>
      </body>
    </html>
  );
}
