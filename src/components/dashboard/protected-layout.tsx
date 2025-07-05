"use client";
import { useCurrentUser } from "@/hooks/use-current-user";
import { Link as LinkIcon, Loader2, LockIcon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../ui/card";
import { Button } from "../ui/button";
import Link from "next/link";
import { useModalStore } from "@/store/zustand";

export function ProtectedLayout({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useCurrentUser();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-white">
        <div className="flex items-center justify-center gap-2">
          <Loader2 className="size-6 text-indigo-600 animate-spin" />
          <span className="text-indigo-600 font-medium text-lg">Loading...</span>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-white px-4">
        <AuthCard />
      </div>
    );
  }

  return <>{children}</>;
}

export default function AuthCard() {
  const {openModal}=useModalStore();
  return (
    <Card className="w-full max-w-md sm:max-w-lg md:max-w-2xl bg-white/90 backdrop-blur-lg border border-indigo-100/50 shadow-xl rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-2xl">
      <div className="flex flex-col sm:flex-row items-center sm:items-stretch">
        {/* Icon Section */}
        <div className="sm:w-1/3 bg-indigo-50/50 flex items-center justify-center p-6 sm:p-8">
          <div className="relative">
            <LockIcon className="size-12 sm:size-16 text-indigo-600 animate-pulse" />
            <div className="absolute inset-0 bg-indigo-200/30 rounded-full blur-xl" />
          </div>
        </div>
        {/* Content Section */}
        <div className="sm:w-2/3 p-6 sm:p-8 flex flex-col justify-center">
          <CardHeader className="space-y-2 px-0 pb-4 text-center sm:text-left">
            <CardTitle className="text-2xl sm:text-3xl font-extrabold tracking-tight text-indigo-900">
              Authentication Required
            </CardTitle>
            <CardDescription className="text-indigo-600/80 text-sm sm:text-base">
              You need to be logged in to access this page.
            </CardDescription>
          </CardHeader>
          <CardContent className="px-0 py-2 w-full">
            <div className="flex flex-col sm:flex-row gap-3 w-full">
              <Button onClick={()=>openModal("connectAccountModal")}
                className="flex-1 bg-gradient-to-r from-indigo-500 to-blue-500 hover:from-indigo-600 hover:to-blue-600 text-white font-semibold py-3 rounded-lg transition-all duration-300 shadow-md hover:shadow-lg text-sm sm:text-base"
              >
                Continue With Google
              </Button>
              <Button
                asChild
                className="flex-1 bg-white border border-indigo-200/50 hover:bg-indigo-50 text-indigo-700 font-semibold py-3 rounded-lg transition-all duration-300 text-sm sm:text-base"
              >
                <Link href="/">
                  Back to Home
                </Link>
              </Button>
            </div>
          </CardContent>
        </div>
      </div>
    </Card>
  );
}