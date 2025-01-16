import { RegisterForm } from "@/components/RegisterForm";
import Image from "next/image";
import SONUS_LOGO from "@/images/SONUS_LOGO.png";

export default function Page(){
    
    return(
      <div className="grid grid-cols-2 h-screen w-full">
      <div className="bg-white flex items-center justify-center">
      <RegisterForm />
       </div>
       <div className="bg-gradient-to-br from-PRIMARY via-MERGE to-SECONDARY from-30% via-50% to-70% flex items-center justify-center">
               <Image src={SONUS_LOGO} alt="Sonus Logo" width={250} height={250}/>
    </div>
    </div>
      );
}
