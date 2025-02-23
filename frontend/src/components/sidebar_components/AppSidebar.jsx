"use client"
import * as React from "react";
import { useRouter } from 'next/navigation';
import { signOut } from "firebase/auth";
import { auth } from "@/config/firebase";
import { useUser } from "@/context/UserContext";
import { useDecision } from "@/context/DecisionContext";
import { IoExitOutline } from "react-icons/io5";
import { MdDashboard } from "react-icons/md";
import { MdBubbleChart } from "react-icons/md";
import { FaUser } from "react-icons/fa";
import { RiHomeFill } from "react-icons/ri";
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
import Image from "next/image";

const data = {
  navMain: [
    {
      url: "#",
      items: [
        { title: "Account", url: "#" },
        { title: "Home", url: "#" },
        { title: "New", url: "#" },
        { title: "Dashboard", url: "#" },
        { title: "Log Out", url: "#" },
      ],
    },
  ],
};

export function AppSidebar({ ...props }) {
  const { setUser } = useUser();
  const { setDetectedBias, setDetectedNoise } = useDecision();
  const router = useRouter();

  const logOut = async (e) => {
    e.preventDefault();
    try {
      await signOut(auth);
      setUser(null);
      setDetectedBias([]);
      setDetectedNoise([]);
      router.replace("/");
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  return (
    <Sidebar {...props} className="w-64 bg-gradient-to-br from-PRIMARY via-MERGE to-SECONDARY from-30% via-50% to-70% text-white">
      <SidebarHeader className="flex flex-col items-center justify-center py-2">
        <Image
          src="/images/SONUS_LOGO_NO_TEXT.png"
          alt="Sonus Logo"
          width={40}
          height={40}
          className="mb-2"
        />
        <span className="font-urbanist text-lg font-semibold">SONUS</span>
      </SidebarHeader>

      <SidebarContent >
        {data.navMain.map((item) => (
          <SidebarGroup key={item.title}>
            <SidebarGroupLabel className="text-white">{item.title}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {item.items.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    {item.title === "Home" ? (
                      <SidebarMenuButton asChild isActive={item.isActive} className="font-urbanist text-white flex items-center gap-2 hover:bg-MERGE hover:no-underline">
                        <a href="#" onClick={(e) => { e.preventDefault(); router.push("/Main"); }}>
                          <RiHomeFill className="text-white mr-2" />
                          {item.title}
                        </a>
                      </SidebarMenuButton>
                    ) : item.title === "Log Out" ? (
                      <SidebarMenuButton asChild isActive={item.isActive} className="font-urbanist text-white hover:bg-MERGE hover:no-underline">
                        <a href="#" onClick={logOut}>
                          <IoExitOutline className="text-white mr-2" />
                          {item.title}
                        </a>
                      </SidebarMenuButton>
                    ) : item.title === "New" ? (
                      <SidebarMenuButton asChild isActive={item.isActive} className="font-urbanist text-white hover:bg-MERGE hover:no-underline">
                        <a href="#" onClick={(e) => { e.preventDefault(); router.push("/Judgement_Form"); }}>
                          <MdBubbleChart className="text-white mr-2" />
                          {item.title}
                        </a>
                      </SidebarMenuButton>
                    ) : item.title === "Dashboard" ? (
                      <SidebarMenuButton asChild isActive={item.isActive} className="font-urbanist text-white hover:bg-MERGE hover:no-underline">
                        <a href="#">
                          <MdDashboard className="text-white mr-2" />
                          {item.title}
                        </a>
                      </SidebarMenuButton>
                    ) : item.title === "Account" ? (
                      <SidebarMenuButton asChild isActive={item.isActive} className="font-urbanist text-white hover:bg-MERGE hover:no-underline">
                        <a href="#" onClick={(e) => { e.preventDefault(); router.push("/Profile"); }}>
                          <FaUser className="text-white mr-2" />
                          {item.title}
                        </a>
                      </SidebarMenuButton>
                    ) : (
                      <SidebarMenuButton asChild isActive={item.isActive} className="text-white">
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
