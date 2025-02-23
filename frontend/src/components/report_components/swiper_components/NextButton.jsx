import React from "react";
import { Button } from "@/components/ui/button";
import { IoIosArrowForward } from "react-icons/io";

const NextButton = ({ swiperRef }) => {
  return (
    <Button
      onClick={() => swiperRef?.current?.slideNext()}
      className="p-2 w-8 h-8 rounded-full bg-PRIMARY hover:bg-opacity-80 flex items-center justify-center"
    >
      <IoIosArrowForward className="w-5 h-5 text-white" />
    </Button>
  );
};

export default NextButton;
