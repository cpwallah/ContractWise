import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { UploadModal } from "../modals/upload-modal";
import { UploadCloud } from "lucide-react";

interface IEmptyStateProps {
  title: string;
  description: string;
}

export default function EmptyState({ title, description }: IEmptyStateProps) {
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

  return (
    <>
      <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8 flex justify-center items-center min-h-[50vh]">
        <Card className="w-full max-w-sm sm:max-w-md border border-gray-200/50 bg-white/95 backdrop-blur-sm shadow-lg rounded-xl transition-all duration-300 hover:shadow-xl hover:-translate-y-0.5">
          <CardHeader className="bg-gray-50/90 rounded-t-xl px-4 sm:px-5 py-3">
            <CardTitle className="text-lg sm:text-xl font-semibold text-gray-800">
              {title}
            </CardTitle>
            <CardDescription className="text-gray-600 text-sm">
              {description}
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-3 sm:pt-4 px-4 sm:px-5 space-y-3">
            <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
              To receive your analysis, please upload a PDF.
            </p>
          </CardContent>
          <CardFooter className="px-4 sm:px-5 pb-4">
            <Button
              onClick={() => setIsUploadModalOpen(true)}
              className="w-full bg-gradient-to-r from-teal-500 to-teal-400 text-white hover:from-teal-600 hover:to-teal-500 transition-all duration-200 rounded-lg text-sm font-semibold py-2 focus-visible:ring-2 focus-visible:ring-teal-400 focus-visible:ring-offset-2"
              aria-label="Open upload modal for PDF analysis"
            >
              <UploadCloud className="h-4 w-4 mr-2" />
              Upload PDF
            </Button>
          </CardFooter>
        </Card>
      </div>
      <UploadModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        onUploadComplete={() => setIsUploadModalOpen(false)}
      />
    </>
  );
}