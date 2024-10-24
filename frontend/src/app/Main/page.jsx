"use client";
import { AppSidebar } from "@/components/app-sidebar"
import { useUser } from "@/context/UserContext";
import { Label } from "@/components/ui/label"
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

export default function Page() {
  const { user } = useUser();
  return (
    (<SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem className="hidden md:block font-urbanist">
                  Welcome {user.name || 'Guest'}!
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4">
         <div className="flex gap-4">
           <div className="flex flex-col w-full md:w-1/2">
             <Label htmlFor="terms" className="font-urbanist text-PRIMARY text-2xl font-bold mb-2 ">Recent Activity</Label>
               <button className="bg-blue-500 text-white text-lg p-6 rounded-lg hover:bg-blue-600">
                  Large Button
                   </button>
                     </div>

            <div className="flex flex-col gap-4 w-full md:w-1/2">
            <Label htmlFor="terms" className="font-urbanist text-PRIMARY text-2xl font-bold mb-2 ">Tools</Label>
              <button className="bg-green-500 text-white text-lg p-4 rounded-lg hover:bg-green-600">
               Create New
              </button>
              <button className="bg-red-500 text-white text-lg p-4 rounded-lg hover:bg-red-600">
                Small Button 2
              </button>
            </div>
          </div>

          <div className="min-h-[100vh] flex-1 rounded-xl bg-muted/50 md:min-h-min" />
        </div>

      </SidebarInset>
    </SidebarProvider>)
  );
}
