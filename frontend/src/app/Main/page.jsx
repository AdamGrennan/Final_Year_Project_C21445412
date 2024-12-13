"use client";
import { useRouter } from 'next/navigation';
import JudgementButton from '@/components/judgement-button';
import DashboardButton from '@/components/dashboard-button';
import { Label } from "@/components/ui/label"
import JudgementList from "@/components/JudgementList";
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
import { useEffect, useState } from "react";

export default function Page() {
  const router = useRouter();

  const [judgement, setJudgements] = useState([]);

  const newJudgement = () => {
    router.push('/Judgement_Form');
  }

  return (
    <div className="flex flex-1 flex-col gap-4 p-4">
      <div className="flex gap-4">
        <div className="flex flex-col w-full md:w-1/2">
          <Label htmlFor="terms" className="font-urbanist text-PRIMARY text-2xl font-bold mb-2 ">Recent Activity</Label>
            <JudgementList/>
        </div>

        <div className="flex items-end flex-col w-full md:w-1/2">
          <Label htmlFor="terms" className="font-urbanist text-PRIMARY text-2xl font-bold mb-2 ">Tools</Label>
          <div className="flex flex-col space-y-[50px]">
        <JudgementButton onClick={newJudgement} />
        <DashboardButton />
    </div>
        </div>
      </div>

      <div className="min-h-[100vh] flex-1 rounded-xl bg-muted/50 md:min-h-min" />
    </div>
  );
}
