"use client";

import ContractAnalysisResults from "@/components/analysis/contract-analysis-result";
import { useContractStore } from "@/store/zustand";
import { useEffect } from "react";
import { IContractAnalysis } from "@/interfaces/contract.interface";
import { useSubscription } from "@/hooks/use-subscription";
import { api } from "@/lib/api";
import stripePromise from "@/lib/stripe";
import { toast } from "sonner";
import EmptyState from "@/components/analysis/empty-state";

export default function ContractResultsPage() {
  const { analysisResults } = useContractStore() as { analysisResults: IContractAnalysis | null };
  const { subscriptionStatus, isSubscriptionLoading, isSubscriptionError, setLoading } = useSubscription();

  useEffect(() => {
    if (process.env.NODE_ENV === "development") {
      console.log("ContractResultsPage analysisResults:", JSON.stringify(analysisResults, null, 2));
    }
  }, [analysisResults]);

  if (isSubscriptionLoading) {
    return <div>Loading...</div>;
  }

  if (isSubscriptionError || !subscriptionStatus) {
    return <EmptyState title="Subscription Error" description="Please try again or log in with another account" />;
  }

  if (!analysisResults) {
    return (
      <div className="p-4">
        <h1 className="text-2xl font-bold">Contract Analysis Results</h1>
        <EmptyState title="No Analysis" description="Please upload a contract first" />
      </div>
    );
  }

  const isActive = subscriptionStatus.status === "active";

  const handleUpgrade = async () => {
    setLoading(true);
    if (!isActive) {
      try {
        const response = await api.get("/payments/create-checkout-session");
        const stripe = await stripePromise;
        await stripe?.redirectToCheckout({
          sessionId: response.data.sessionId,
        });
      } catch (error) {
        toast.error("Please try again or log in with another account");
      } finally {
        setLoading(false);
      }
    } else {
      toast.error("You are already a premium member");
    }
  };

  return (
    <div className="p-4 bg-blue-50">
      <h1 className="text-2xl font-bold mb-4">Contract Analysis Results</h1>
      {analysisResults.contractType && (
        <h2 className="text-lg font-semibold mb-4">
          Contract Type: {analysisResults.contractType}
        </h2>
      )}
      <ContractAnalysisResults
        analysisResults={analysisResults}
        isActive={isActive}
        onUpgrade={handleUpgrade}
      />
    </div>
  );
}