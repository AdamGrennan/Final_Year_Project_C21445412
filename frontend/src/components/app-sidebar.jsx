"use client"
import * as React from "react";
import { useRouter } from 'next/navigation';// To handle redirection
import { signOut } from "firebase/auth";
import { auth } from "../config/firebase"; // Adjust the path as per your project structure
import { useUser } from "@/context/UserContext";
import { VersionSwitcher } from "@/components/version-switcher";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";

// Sample data
const data = {
  navMain: [
    {
      title: "Tools",
      url: "#",
      items: [
        { title: "Installation", url: "#" },
        { title: "Project Structure", url: "#" },
        { title: "Log Out", url: "#" }, // We will replace this with a logout function
      ],
    },
  ],
};

export function AppSidebar({ ...props }) {
  const { user } = useUser();
  const router = useRouter();

  const logOut = async (e) => {
    e.preventDefault(); // Prevent default link behavior
    try {
      await signOut(auth); // Sign the user out
      router.push("/"); // Redirect to the login page
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  return (
    <Sidebar {...props} className="bg-PRIMARY">
      <SidebarHeader>
        SONUS
      </SidebarHeader>
      <SidebarContent>
        {data.navMain.map((item) => (
          <SidebarGroup key={item.title}>
            <SidebarGroupLabel>{item.title}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {item.items.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    {item.title === "Log Out" ? (
                      <SidebarMenuButton asChild isActive={item.isActive}>
                        {/* Log out onClick instead of href */}
                        <a href="#" onClick={logOut}>
                          {item.title}
                        </a>
                      </SidebarMenuButton>
                    ) : (
                      <SidebarMenuButton asChild isActive={item.isActive}>
                        <a href={item.url}>{item.title}</a>
                      </SidebarMenuButton>
                    )}
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}
