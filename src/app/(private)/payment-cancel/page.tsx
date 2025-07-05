"use client"
import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { UploadModal } from "@/components/modals/upload-modal";
import { AlertCircle, UploadCloud } from "lucide-react";

export default function PaymentCancelled() {
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

  return (
    <>
      <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8 flex justify-center items-center min-h-[60vh]">
        <Card className="w-full max-w-xs sm:max-w-sm md:max-w-md border-2 border-teal-200/50 bg-white/95 backdrop-blur-sm shadow-lg rounded-xl transition-all duration-300 hover:shadow-xl hover:-translate-y-0.5">
          <CardHeader className="bg-gradient-to-r from-teal-50/90 to-white/95 rounded-t-xl px-4 sm:px-5 py-3 text-center">
            <div className="flex justify-center mb-2">
              <AlertCircle className="h-8 w-8 sm:h-10 sm:w-10 text-coral-500" aria-hidden="true" />
            </div>
            <CardTitle className="text-lg sm:text-xl font-semibold text-gray-800">
              Payment Not Completed
            </CardTitle>
            <CardDescription className="text-teal-600 text-sm">
              It looks like your payment didn’t go through.
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-3 sm:pt-4 px-4 sm:px-5 space-y-2.5">
            <p className="text-xs sm:text-sm text-gray-600 leading-relaxed text-center">
              Try our free tier analysis by uploading a PDF.
            </p>
          </CardContent>
          <CardFooter className="px-4 sm:px-5 pb-4">
            <Button
              onClick={() => setIsUploadModalOpen(true)}
              className="w-full bg-gradient-to-r from-teal-500 to-teal-400 text-white hover:from-teal-600 hover:to-teal-500 hover:scale-105 transition-all duration-200 rounded-lg text-sm font-semibold py-2 focus-visible:ring-2 focus-visible:ring-teal-400 focus-visible:ring-offset-2 animate-pulse-subtle"
              aria-label="Open upload modal for free tier PDF analysis"
            >
              <UploadCloud className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
              Upload PDF
            </Button>
          </CardFooter>
        </Card>
      </div>
      <UploadModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        onUploadComplete={() => setIsUploadModalOpen(true)}
      />
    </>
  );
}