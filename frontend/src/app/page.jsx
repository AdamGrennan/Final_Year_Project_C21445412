import { LoginForm } from "@/components/login-components/LoginForm";
import Link from "next/link";
import Image from "next/image";

export default function Page() {
  return (
    <div className="grid grid-cols-2 h-screen w-full">
      <div className="bg-white flex items-center justify-center">
        <LoginForm />
      </div>
      <div className="bg-gradient-to-br from-PRIMARY via-MERGE to-SECONDARY from-30% via-50% to-70% flex items-center justify-center">
        <Image src="/images/SONUS_LOGO.png" alt="Sonus Logo" width={250} height={250}/>
      </div>
    </div>
  );
}
