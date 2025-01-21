import { LoginForm } from "@/components/login_components/LoginForm";
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
      <Link href="/Main" className="underline font-semibold font-urbanist text-PRIMARY">
        HOME PAGE
      </Link>
      <Link href={`/Final_Report/${1}`} className="font-semibold font-urbanist text-PRIMARY">  
        FINAL PAGE
      </Link>
      <Link href={`/Chat_Page/${1}`}  className="underline font-semibold font-urbanist text-PRIMARY">
        CHAT PAGE
      </Link>
    </div>
  );
}
