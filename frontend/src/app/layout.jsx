import { UserProvider } from "@/context/UserContext";
import { DecisionProvider } from "@/context/DecisionContext";
import { JudgmentProvider } from "@/context/JudgementContext";
import ClientLayout from "@/components/ClientLayout";
import "@/styles/global.css";
import { Toaster } from "@/components/ui/toaster"

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Urbanist:ital,wght@0,100..900;1,100..900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <UserProvider>
          <DecisionProvider>
            <JudgmentProvider>
              <ClientLayout>{children}</ClientLayout>
              <Toaster />
            </JudgmentProvider>
          </DecisionProvider>
        </UserProvider>
      </body>
    </html>
  );
}
