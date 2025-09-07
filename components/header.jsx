"use client";

import { useRouter } from "next/navigation";
import { Button } from "./ui/button";
import { ThemeToggle } from "./theme-toggle";
import { ChartNoAxesCombinedIcon } from "lucide-react";

export function Header() {
  const router = useRouter(); // initialize router

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/80 backdrop-blur-sm dark:bg-gray-900/80">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center space-x-3">
          <div className="p-2 rounded-lg bg-black">
            <ChartNoAxesCombinedIcon className="h-6 w-6 text-white" />
          </div>

          <div>
            <h1 className="text-xl font-semibold text-black dark:text-white">
              BharatlEarns
            </h1>
            <p className="text-xs text-gray-600 dark:text-gray-400">
              Analyse, Optimise, Grow
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <Button
            variant="outline"
            // size="lg"
            className=" px-6 py-3 bg-transparent border-blue-200 text-black hover:text-white hover:bg-gradient-to-r hover:from-blue-500 hover:to-purple-600 dark:text-white dark:hover:bg-gradient-to-r dark:hover:from-blue-500 dark:hover:to-purple-600"
            onClick={() => router.push("/dashboard")} // 🔥 here
          >
            LogIn / SignUp
          </Button>

          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
