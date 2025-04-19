import React from "react";
import { Button } from "@/components/ui/button"
import { IoIosArrowBack } from "react-icons/io";

const PrevButton = ({ swiperRef }) => {
  return (
    <Button
      onClick={() => swiperRef.current?.slidePrev()}
       className="p-2 w-8 h-8 rounded-full bg-PRIMARY hover:bg-opacity-80 flex items-center justify-center"
    >
      <IoIosArrowBack className="w-5 h-5 text-white" />
    </Button>
  );
};

export default PrevButton;