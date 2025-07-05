// "use client"
// import { useModalStore } from "@/store/zustand";
// import { Dialog, DialogDescription, DialogTitle ,DialogContent} from "@radix-ui/react-dialog";
// import { useMutation } from "@tanstack/react-query";
// import { useState } from "react";
// import { toast } from "sonner";
// import { DialogHeader } from "../ui/dialog";
// import { Button } from "../ui/button";
// import { Loader2 } from "lucide-react";
// import { Checkbox } from "@radix-ui/react-checkbox";
// import { Label } from "recharts";

// function googleSignIn():Promise<void>{
//     return new Promise((resolve)=>{
//         window.location.href=`${process.env.NEXT_PUBLIC_API_URL}/auth/google`;
//         resolve();
//     });
// }
// export function ConnectAccountModal(){
//     const [isAgreed,setIsAgreed]=useState(false);
//     const modalKey="connectAccountModal";
//     const {isOpen,closeModal}=useModalStore();
//     const mutation=useMutation({
//         mutationFn:googleSignIn,
//         onSuccess:()=>{
//             closeModal(modalKey);

//         },
//         onError:(error:Error)=>{
//             toast.error(error.message)
//         }
//     });
//     const handleGoogleSignIn=async()=>{
//         if(!isAgreed){
//         mutation.mutate();
//         }else{
//             toast.error("Please agree to the terms and conditions")
//         }
//     }
//     return (
//         <Dialog open={isOpen(modalKey)} onOpenChange={()=>closeModal(modalKey)} key={modalKey}>
//             <DialogContent>
//             <DialogHeader>
//                 <DialogTitle>Connect Google Account</DialogTitle>
//                 <DialogDescription>Please Connect your Google account to continue.</DialogDescription>
//             </DialogHeader>
//             <div className="grid gap-4 py-4">
//                 <Button onClick={handleGoogleSignIn} disabled={!isAgreed || mutation.isPending} className="w-full">
//                     {mutation.isPending?(
//                         <Loader2 className="mr-2 size-4 animate-spin"/>
//                     ):(
//                         <>Sign In with Google</>
//                     )}
//                 </Button>
//                 <div className="flex items-center space-x-2">
//                     <Checkbox id="terms" checked={isAgreed} onCheckedChange={(checked)=>setIsAgreed(checked as boolean)}/>
//                    <Label htmlFor="terms" className="text-sm text-gray-500 leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
//                     I agree to the terms and conditions
//                    </Label>
//                 </div>
//             </div>
//             </DialogContent>
//         </Dialog>
//     )
// }

"use client";

import { useModalStore } from "@/store/zustand";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog"; // Adjust path to your UI library
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { DialogHeader } from "@/components/ui/dialog"; // Adjust path
import { Button } from "@/components/ui/button"; // Adjust path
import { Loader2 } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox"; // Adjust path
import { Label } from "@/components/ui/label"; // Adjust path

// Define types for the Zustand store (if not already defined)
interface ModalStore {
  isOpen: (key: string) => boolean;
  closeModal: (key: string) => void;
}

// Function to handle Google Sign-In redirect
function googleSignIn(): Promise<void> {
  return new Promise((resolve) => {
    const apiUrl = process.env.NEXT_PUBLIC_CLIENT_URL;
    if (!apiUrl) {
      throw new Error("API URL is not configured");
    }
    window.location.href = `${apiUrl}/auth/google`;
    // Note: resolve() may not be called due to page unload
    resolve();
  });
}

export function ConnectAccountModal() {
  const [isAgreed, setIsAgreed] = useState(false);
  const modalKey = "connectAccountModal";
  const { isOpen, closeModal } = useModalStore() as ModalStore;

  const mutation = useMutation({
    mutationFn: googleSignIn,
    onSuccess: () => {
      // This may not execute due to page redirect
      closeModal(modalKey);
    },
    onError: (error: unknown) => {
      const errorMessage = error instanceof Error ? error.message : "Failed to initiate Google Sign-In";
      toast.error(errorMessage);
    },
  });

  const handleGoogleSignIn = () => {
    if (isAgreed) {
      mutation.mutate();
    } else {
      toast.error("Please agree to the terms and conditions");
    }
  };

  return (
    <Dialog open={isOpen(modalKey)} onOpenChange={() => closeModal(modalKey)} key={modalKey}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Connect Google Account</DialogTitle>
          <DialogDescription>
            Please connect your Google account to continue.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <Button
            onClick={handleGoogleSignIn}
            disabled={!isAgreed || mutation.isPending}
            className="w-full"
          >
            {mutation.isPending ? (
              <>
                <Loader2 className="mr-2 size-4 animate-spin" />
                Signing In...
              </>
            ) : (
              <>Sign In with Google</>
            )}
          </Button>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="terms"
              checked={isAgreed}
              onCheckedChange={(checked) => setIsAgreed(checked === true)}
            />
            <Label
              htmlFor="terms"
              className="text-sm text-gray-500 leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              I agree to the terms and conditions
            </Label>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}