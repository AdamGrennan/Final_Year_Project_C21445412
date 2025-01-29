import React from "react";
import { Button } from "@/components/ui/button"
import { IoIosArrowBack } from "react-icons/io";

const PrevButton = ({ swiperRef }) => {
  return (
    <Button
      onClick={() => swiperRef.current?.slidePrev()}
    >
      <IoIosArrowBack/>
    </Button>
  );
};

export default PrevButton;