// "use client"

// import { Button } from "../components/ui/button"
// import Image from "next/image"
// import { useUser } from "@clerk/nextjs"
// import { useRouter } from "next/navigation"
// import { useEffect } from "react"

// export default function Home() {
//   const { isSignedIn } = useUser()
//   const router = useRouter()

//   useEffect(() => {
//     if (isSignedIn) {
//       router.push("/dashboard")
//     }
//   }, [isSignedIn, router])

//   if (isSignedIn) return null

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
//       <div className="text-center space-y-6 bg-white shadow-lg rounded-lg p-8 max-w-md w-full">
//         <h2 className="text-3xl font-bold text-gray-800">Welcome to tradego</h2>
//         <p className="text-gray-600">Your journey to smarter trading starts here.</p>
//         <Button
//           className=" text-white font-semibold py-2 px-6 rounded-lg "
//           onClick={()=> router.push("/dashboard")}
//         >
//           Sign in
//         </Button>
//       </div>
//     </div>
//   )
// }

"use client";
// import { Button } from "../components/ui/button";
// import Image from "next/image";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

// Landing page components
import { Hero } from "../components/hero";
import { ProblemSolution } from "../components/problem-solution";
import { Differentiation } from "../components/differentiation";
import { KeyFeatures } from "../components/key-features";
import { NationalImpact } from "../components/national-impact";
import { Statistics } from "../components/statistics";
import { CallToAction } from "../components/call-to-action";
import { Header } from "../components/header";
import { Footer } from "../components/footer";
import { TradingBackground } from "../components/trading-background";

export default function Home() {
  const { isSignedIn } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (isSignedIn) {
      router.push("/dashboard");
    }
  }, [isSignedIn, router]);

  if (isSignedIn) return null;

  // Show landing page for non-signed-in users
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 relative overflow-hidden">
      <TradingBackground />
      <Header />
      <Hero />
      <ProblemSolution />
      <Differentiation />
      <KeyFeatures />
      <NationalImpact />
      <Statistics />
      <CallToAction />
      <Footer />
    </div>
  );
}
