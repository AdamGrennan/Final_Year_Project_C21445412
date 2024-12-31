"use client";
import Breakdown from "@/components/Breakdown";
import { useRouter } from "next/navigation";
import FeedSideBar from "@/components/FeedSidebar";
import Snapshot from "@/components/Snapshot";
import SummarySideBar from "@/components/SummarySidebar";
import Trends from "@/components/Trends";
import { useBias } from "@/context/BiasContext";
import { Label } from "@radix-ui/react-dropdown-menu";
import { Button } from "@/components/ui/button";

export default function Page() {
    const { biasCount, detectedBias } = useBias();
    const router = useRouter();

    const openHome = () => {
        router.push('/Main');
    };

    return (
        <div className="min-h-screen p-6">

            {Object.entries(biasCount).map(([bias, count]) => (
                <p key={bias} className="text-gray-700 font-urbanist">{`${bias}: ${count}`}</p>
            ))}

            <div className="flex flex-1 flex-col gap-8">
                <div className="flex gap-8">
   
                    <div className="flex flex-col w-full md:w-1/2 space-y-6">
                        <Label htmlFor="terms" className="font-urbanist text-PRIMARY text-2xl font-bold">
                            Summary
                        </Label>
                        <FeedSideBar bias={detectedBias} />
                        <Snapshot />
                    </div>

                    <div className="flex flex-col w-full md:w-1/2 space-y-6">
                        <Label htmlFor="terms" className="font-urbanist text-PRIMARY text-2xl font-bold">
                            Analysis
                        </Label>
                        <Breakdown />
                        <Trends />
                    </div>

                    <div className="flex flex-col w-full md:w-1/2 space-y-6">
                        <Label htmlFor="terms" className="font-urbanist text-PRIMARY text-2xl font-bold">
                            Feedback
                        </Label>
                        <SummarySideBar />
                        <Button onClick={openHome} className="bg-PRIMARY text-white font-urbanist mt-4">
                            Finish
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
