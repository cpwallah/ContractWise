// components/upload-modal.tsx
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { api } from "@/lib/api";
import { useContractStore, IContractAnalysis } from "@/store/zustand";
import { useMutation } from "@tanstack/react-query";
import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { AnimatePresence, motion } from "framer-motion";
import { Brain, FileText, Loader2, Sparkles, Trash } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";
import { useRouter } from "next/navigation";

interface IUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUploadComplete: () => void;
}

interface DetectTypeResponse {
  detectedType: string;
}

// Use IContractAnalysis for AnalyzeResponse
type AnalyzeResponse = IContractAnalysis;

export function UploadModal({ isOpen, onClose, onUploadComplete }: IUploadModalProps) {
  const { setAnalysisResults, clearAnalysisResults } = useContractStore();
  const router = useRouter();
  const [detectedType, setDetectedType] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [files, setFiles] = useState<File[]>([]);
  const [step, setStep] = useState<"upload" | "detecting" | "confirm" | "processing" | "done">(
    "upload"
  );

  const { mutate: detectContractType, isPending: isDetecting } = useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append("contract", file);
      const response = await api.post<DetectTypeResponse>("/contracts/detect-type", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      console.log("detectContractType response:", response.data);
      return response.data.detectedType;
    },
    onSuccess: (data: string) => {
      setDetectedType(data);
      setStep("confirm");
    },
    onError: (error: any) => {
      console.error("Detect contract type error:", error);
      setError("Failed to detect contract type");
      setStep("upload");
    },
  });

  const { mutate: uploadFile, isPending: isProcessing } = useMutation({
    mutationFn: async ({ file, contractType }: { file: File; contractType: string }) => {
      const formData = new FormData();
      formData.append("contract", file);
      formData.append("contractType", contractType);
      console.log("FormData - contract:", file.name, file.size, file.type);
      console.log("FormData - contractType:", contractType);
      const response = await api.post<AnalyzeResponse>("/contracts/analyze", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      console.log("uploadFile response.data:", JSON.stringify(response.data, null, 2));
      return response.data;
    },
    onSuccess: (data) => {
      console.log("Calling setAnalysisResults with:", JSON.stringify(data, null, 2));
      clearAnalysisResults();
      setAnalysisResults(data);
      console.log("Store state after setAnalysisResults:", JSON.stringify(useContractStore.getState(), null, 2));
      setStep("done");
      onUploadComplete();
    },
    onError: (error: any) => {
      console.error("Analysis error:", JSON.stringify(error, null, 2));
      clearAnalysisResults();
      const errorMessage =
        error.response?.data?.error || "Failed to upload contract";
      const validationErrors = error.response?.data?.details
        ? error.response.data.details.join("; ")
        : "";
      setError(validationErrors ? `${errorMessage}: ${validationErrors}` : errorMessage);
      setStep("upload");
    },
  });

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      setFiles(acceptedFiles);
      setError(null);
      setStep("upload");
    } else {
      setError("No valid PDF file selected");
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "application/pdf": [".pdf"],
    },
    maxFiles: 1,
    multiple: false,
  });

  const handleFilesUpload = () => {
    if (files.length > 0) {
      setStep("detecting");
      detectContractType(files[0]);
    }
  };

  const handleAnalyzeContract = () => {
    if (files.length > 0 && detectedType) {
      setStep("processing");
      uploadFile({ file: files[0], contractType: detectedType });
    }
  };

  const handleRemoveFile = () => {
    setFiles([]);
    setError(null);
    setStep("upload");
  };

  const handleClose = () => {
    onClose();
    setFiles([]);
    setDetectedType(null);
    setError(null);
    setStep("upload");
  };

  const renderContent = () => {
    switch (step) {
      case "upload":
        return (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <DialogHeader>
              <DialogTitle>Upload Contract</DialogTitle>
              <DialogDescription>
                Upload a PDF contract to analyze its type and content.
              </DialogDescription>
            </DialogHeader>
            {error && (
              <Alert variant="destructive" className="mb-4">
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            <div
              {...getRootProps()}
              className={cn(
                "border-2 border-dashed rounded-lg p-8 mt-4 mb-4 text-center transition-colors",
                isDragActive ? "border-primary bg-primary/10" : "border-gray-300 hover:border-gray-400"
              )}
            >
              <input {...getInputProps()} />
              <FileText className="mx-auto size-16 text-primary" />
              <p className="mt-4 text-sm text-gray-600">
                Drag 'n' drop a PDF file here, or click to select one
              </p>
              <p className="bg-yellow-500/30 border border-yellow-500 border-dashed text-yellow-700 p-2 rounded mt-2">
                Note: Only PDF files are accepted
              </p>
            </div>
            {files.length > 0 && (
              <div className="mt-4 bg-green-500/30 border-green-500 border-dashed text-green-700 p-2 rounded flex items-center justify-between">
                <span>
                  {files[0].name}{" "}
                  <span className="text-sm text-gray-600">({files[0].size} bytes)</span>
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleRemoveFile}
                  aria-label="Remove file"
                  className="hover:bg-green-500"
                >
                  <Trash className="size-5 hover:text-green-900" />
                </Button>
              </div>
            )}
            {files.length > 0 && (
              <Button
                className="mt-4 w-full"
                onClick={handleFilesUpload}
                disabled={isProcessing || isDetecting}
              >
                {isDetecting ? (
                  <Loader2 className="mr-2 size-4 animate-spin" />
                ) : (
                  <Sparkles className="mr-2 size-4" />
                )}
                Analyze Contract With AI
              </Button>
            )}
          </motion.div>
        );
      case "detecting":
        return (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center justify-center py-8"
          >
            <Loader2 className="size-16 animate-spin text-primary" />
            <p className="mt-4 text-lg font-semibold">Detecting contract type...</p>
          </motion.div>
        );
      case "confirm":
        return (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <DialogHeader>
              <DialogTitle>Confirm Contract Type</DialogTitle>
              <DialogDescription>
                We detected a contract type. Please confirm to proceed with analysis.
              </DialogDescription>
            </DialogHeader>
            <div className="flex flex-col space-y-4 mb-4">
              <p>
                We have detected the following contract type:{" "}
                <span className="font-semibold">{detectedType}</span>
              </p>
              <p>Would you like to analyze this contract with our AI?</p>
            </div>
            <div className="flex space-x-4">
              <Button onClick={handleAnalyzeContract} disabled={isProcessing}>
                Yes, I want to analyze it
              </Button>
              <Button onClick={() => setStep("upload")} variant="outline" className="flex-1">
                No, Try Another file
              </Button>
            </div>
          </motion.div>
        );
      case "processing":
        return (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="flex flex-col items-center justify-center py-8"
          >
            <motion.div
              animate={{ scale: [1, 1.2, 1], rotate: [0, 360] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            >
              <Brain className="size-20 text-primary" />
            </motion.div>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mt-6 text-lg font-semibold text-gray-700"
            >
              AI is analyzing your contract...
            </motion.p>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
              className="mt-2 text-sm text-gray-700"
            >
              This may take some time.
            </motion.p>
            <motion.div
              className="w-64 h-2 bg-gray-200 rounded-full mt-6 overflow-hidden"
              initial={{ width: 0 }}
              animate={{ width: "100%" }}
              transition={{ duration: 10, ease: "linear" }}
            >
              <motion.div
                className="h-full bg-primary"
                initial={{ width: "0%" }}
                animate={{ width: "100%" }}
                transition={{ duration: 10, ease: "linear" }}
              />
            </motion.div>
          </motion.div>
        );
      case "done":
        return (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <DialogHeader>
              <DialogTitle>Analysis Complete</DialogTitle>
              <DialogDescription>
                Your contract has been analyzed. You can now view the results.
              </DialogDescription>
            </DialogHeader>
            <Alert className="mt-4">
              <AlertTitle>Analysis Completed</AlertTitle>
              <AlertDescription>
                Your contract has been analyzed. You can now view the results.
              </AlertDescription>
            </Alert>
            <div className="mt-6 flex flex-col space-y-3">
              <Button
                onClick={() => {
                  console.log("Navigating to /dashboard/results");
                  console.log("Store state before navigation:", JSON.stringify(useContractStore.getState(), null, 2));
                  router.push("/dashboard/results");
                }}
              >
                View Results
              </Button>
              <Button variant="outline" onClick={handleClose}>
                Close
              </Button>
            </div>
          </motion.div>
        );
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent>{renderContent()}</DialogContent>
    </Dialog>
  );
}