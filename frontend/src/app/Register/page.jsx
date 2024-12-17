import { RegisterForm } from "@/components/RegisterForm";

export default function Page(){
    
    return(
      <div className="grid grid-cols-2 h-screen w-full">
      <div className="bg-white flex items-center justify-center">
      <RegisterForm />
       </div>
       <div className="bg-gradient-to-br from-PRIMARY via-MERGE to-SECONDARY from-30% via-50% to-70%">
    </div>
    </div>
      );
}
