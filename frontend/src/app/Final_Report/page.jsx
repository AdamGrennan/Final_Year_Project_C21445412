"use client"
import Breakdown from "@/components/Breakdown";
import { useRouter } from 'next/navigation';
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
      }

    return (
        <div>
            <h2>Bias Counts</h2>
            {Object.entries(biasCount).map(([bias, count]) => (
                <p key={bias}>{`${bias}: ${count}`}</p>
            ))}

            <div className="flex flex-1 flex-col gap-4 p-4">
                <div className="flex gap-4">
                    <div className="flex flex-col w-full md:w-1/2">
                        <Label htmlFor="terms" className="font-urbanist text-PRIMARY text-2xl font-bold mb-2 ">Summary</Label>
                            <FeedSideBar bias={detectedBias}/>
                            <Snapshot/>
                    </div>
                    <div className="flex items-end flex-col w-full md:w-1/2">
                    <div className="flex flex-col space-y-[50px]">
                        <Breakdown/>
                        <Trends/>
                        </div>
                    </div>

                    <div className="flex items-end flex-col w-full md:w-1/2">
                        <Label htmlFor="terms" className="font-urbanist text-PRIMARY text-2xl font-bold mb-2 ">Feedback</Label>
                        <div className="flex flex-col space-y-[50px]">
                            <SummarySideBar/>
                             <Button onClick={openHome} className="bg-PRIMARY text-white font-urbanist">Finish</Button>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}