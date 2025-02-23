"use client"
import PrevButton from "@/components/report_components/swiper_components/PreviousButton";
import NextButton from "@/components/report_components/swiper_components/NextButton";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { IoIosArrowForward } from "react-icons/io";

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';

const SwiperNavigation = ({ swiperRef, isLastSlide }) => {
    const router = useRouter();

    const openHome = () => {
        setTimeout(async () => {
            router.push('/Main');
        }, 700);
    };

    return(
        <div className="w-full flex justify-between items-center absolute top-20 px-4 z-10">
        <PrevButton swiperRef={swiperRef} />
        {!isLastSlide ? (
            <NextButton swiperRef={swiperRef} />
        ) : (
            <Button
                onClick={openHome}
                className="bg-PRIMARY text-white font-urbanist rounded-3xl transform transition-transform duration-300 active:scale-[1.1] hover:bg-opacity-80"
            >
                Finish
                <IoIosArrowForward className="h-5 text-white" />
            </Button>
        )}
    </div>
    );
};

export default SwiperNavigation;