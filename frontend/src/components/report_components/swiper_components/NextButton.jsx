import React from "react";
import { Button } from "@/components/ui/button";
import { IoIosArrowForward } from "react-icons/io";

const NextButton = ({ swiperRef }) => {
  return (
    <Button
      onClick={() => swiperRef?.current?.slideNext()}
    >
      <IoIosArrowForward/>
    </Button>
  );
};

export default NextButton;
