// layout.jsx in src/app
"use client";
import { UserProvider } from "@/context/UserContext";
import { DecisionProvider } from "@/context/DecisionContext";
import { JudgmentProvider } from "@/context/JudgementContext";
import { MainSidebar } from "@/components/sidebar-components/MainSidebar";
import { usePathname } from "next/navigation";
import "@/styles/global.css";

export default function RootLayout({ children }) {
  const pathname = usePathname();
  const noSidebarRoutes = ["/", "/register"];
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
          <DecisionProvider>
            <JudgmentProvider>
          {isNoSidebarRoute ? (
            <main className="min-h-screen flex flex-col justify-center items-center ">
              {children}
            </main>
          ) : (
            <MainSidebar>{children}</MainSidebar>
          )}
            </JudgmentProvider>
          </DecisionProvider>
        </UserProvider>
      </body>
    </html>
  );
}
