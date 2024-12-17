import { LoginForm } from "@/components/LoginForm";
import Link from "next/link";


export default function Page() {
  return (
    <div className="grid grid-cols-2 h-screen w-full">
      <div className="bg-white flex items-center justify-center">
        <LoginForm />
      </div>
      <div className="bg-gradient-to-br from-PRIMARY via-MERGE to-SECONDARY from-30% via-50% to-70%">
      </div>
      <Link href="/Main" className="underline font-semibold font-urbanist text-PRIMARY">
        HOME PAGE
      </Link>
      <Link href="/Final_Report" className="underline font-semibold font-urbanist text-PRIMARY">
        FINAL PAGE
      </Link>
      <Link href="/Chat_Page" className="underline font-semibold font-urbanist text-PRIMARY">
        CHAT PAGE
      </Link>
    </div>
  );
}
