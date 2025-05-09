"use client"
import { PiHandWavingFill } from "react-icons/pi";
import { AppSidebar } from "./AppSidebar";
import { useUser } from "@/context/UserContext";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"


export function MainSidebar( { children }){
    const { user } = useUser();

    return(
    <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block font-urbanist">
                  Welcome {user?.name || 'Guest'}!
                </BreadcrumbItem>
                <PiHandWavingFill className="text-PRIMARY"/>
              </BreadcrumbList>
            </Breadcrumb>
          </header>
          <main className="flex flex-1 flex-col ">{children}</main>
          </SidebarInset>
          </SidebarProvider>
    )
}