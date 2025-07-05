"use client";

import { useSubscription } from "@/hooks/use-subscription";
import { api } from "@/lib/api";
import { notFound } from "next/navigation";
import { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ContractAnalysisResults from "@/components/analysis/contract-analysis-result";
import stripePromise from "@/lib/stripe";

// Define interfaces
interface IRisk {
  risk: string;
  explanation: string;
  severity: string;
  id: string;
}

interface IOpportunity {
  opportunity: string;
  explanation: string;
  impact: string;
  id: string;
}

interface IContractAnalysis {
  companyName?: string;
  overallScore: number;
  summary?: string;
  risks?: IRisk[];
  opportunities?: IOpportunity[];
  keyClauses?: string[];
  recommendations?: string[];
  contractDuration?: string;
  terminationConditions?: string;
  legalCompliance?: string;
  negotiationPoints?: string[];
}

interface IContractAnalysisResultsProps {
  contractId: string;
}

export default function ContractResults({ contractId }: IContractAnalysisResultsProps) {
  const { subscriptionStatus, isUserLoading, isUserError, isSubscriptionLoading, isSubscriptionError, subscriptionError, user } = useSubscription();
  const [analysisResults, setAnalysisResults] = useState<IContractAnalysis | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isActive, setIsActive] = useState<boolean>(false);

  const handleUpgrade = async () => {
    try {
      const response = await api.get("/payments/create-checkout-session");
      const stripe = await stripePromise;
      await stripe?.redirectToCheckout({
        sessionId: response.data.sessionId,
      });
    } catch (error) {
      console.error("Error initiating checkout:", error);
      setError("Failed to initiate subscription. Please try again.");
    }
  };

  const fetchAnalysisResults = useCallback(async (id: string) => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get(`/contracts/contract/${id}`);
      if (!response.data) {
        throw new Error("No data returned from API");
      }
      console.log("Fetch API Response:", {
        contractId: id,
        userId: user?._id || "none",
        data: response.data,
        timestamp: new Date().toISOString(),
      });
      setAnalysisResults(response.data as IContractAnalysis);
    } catch (err: unknown) {
      const error = err as { response?: { status: number; data?: any } };
      console.error("Error fetching contract analysis:", {
        error: err,
        status: error.response?.status,
        data: error.response?.data,
        userId: user?._id || "none",
        contractId: id,
        timestamp: new Date().toISOString(),
      });
      if (error.response?.status === 404) {
        setError("Contract not found");
        notFound();
      } else {
        setError("Failed to fetch contract analysis. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  }, [user]);

  const triggerAnalysis = useCallback(async (id: string, retries = 3) => {
    if (!isActive) {
      console.log("Skipping analysis: User is not premium", {
        userId: user?._id || "none",
        contractId: id,
        timestamp: new Date().toISOString(),
      });
      await fetchAnalysisResults(id); // Fallback to fetch existing results
      return;
    }
    try {
      setIsAnalyzing(true);
      setError(null);
      console.log("Triggering analysis for contract:", {
        contractId: id,
        userId: user?._id || "none",
        email: user?.email || "none",
        timestamp: new Date().toISOString(),
      });
      const response = await api.post(`/contracts/analyze/${id}`);
      if (!response.data) {
        throw new Error("No analysis data returned");
      }
      console.log("Analysis Response:", {
        contractId: id,
        userId: user?._id || "none",
        data: response.data,
        timestamp: new Date().toISOString(),
      });
      setAnalysisResults(response.data as IContractAnalysis);
    } catch (err: unknown) {
      const error = err as { response?: { status: number; data?: any } };
      console.error("Error triggering analysis:", {
        error: err,
        status: error.response?.status,
        data: error.response?.data,
        userId: user?._id || "none",
        contractId: id,
        timestamp: new Date().toISOString(),
      });
      if (error.response?.status === 403) {
        setError("Analysis not authorized. Please verify your premium subscription.");
      } else if (error.response?.status === 404) {
        setError("Contract not found. Please check the contract ID.");
      } else if (retries > 0) {
        console.log(`Retrying analysis (${retries} attempts left)...`, {
          userId: user?._id || "none",
          contractId: id,
        });
        await new Promise(resolve => setTimeout(resolve, 1000));
        await triggerAnalysis(id, retries - 1);
      } else {
        setError("Failed to analyze contract. Loading existing data...");
        await fetchAnalysisResults(id);
      }
    } finally {
      setIsAnalyzing(false);
    }
  }, [isActive, user, fetchAnalysisResults]);

  useEffect(() => {
    if (isUserLoading || isSubscriptionLoading) {
      setLoading(true);
      return;
    }

    if (isUserError) {
      setLoading(false);
      setError("User authentication failed. Click retry to attempt loading results.");
      console.log("User authentication error", {
        timestamp: new Date().toISOString(),
        userId: user?._id || "none",
      });
      return;
    }

    if (isSubscriptionError) {
      console.warn("Subscription status error:", {
        message: subscriptionError?.message,
        userId: user?._id || "none",
        timestamp: new Date().toISOString(),
      });
      setError("Failed to verify subscription status. Click retry to attempt loading results.");
    }

    const isPremium = subscriptionStatus?.status === "active" || user?.isPremium || false;
    console.log("Subscription check:", {
      subscriptionStatus: subscriptionStatus?.status,
      userIsPremium: user?.isPremium,
      isActive: isPremium,
      userId: user?._id || "none",
      email: user?.email || "none",
      timestamp: new Date().toISOString(),
    });
    setIsActive(isPremium);

    let isMounted = true;

    const loadResults = async () => {
      if (isMounted) {
        if (isPremium) {
          await triggerAnalysis(contractId);
        } else {
          await fetchAnalysisResults(contractId);
        }
      }
    };

    loadResults().catch(err => {
      console.error("Error loading results:", err);
      setError("An unexpected error occurred. Please try again.");
      setLoading(false);
    });

    return () => {
      isMounted = false;
    };
  }, [user, isUserLoading, isUserError, subscriptionStatus, isSubscriptionLoading, isSubscriptionError, subscriptionError, contractId, fetchAnalysisResults, triggerAnalysis]);

  return (
    <div className="w-full min-h-screen bg-gradient-to-b from-blue-50 to-white overflow-y-auto">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <AnimatePresence>
          {loading || isAnalyzing ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="flex items-center justify-center min-h-[calc(100vh-4rem)]"
            >
              <motion.div
                animate={{ scale: [1, 1.2, 1], rotate: [0, 360] }}
                transition={{ repeat: Infinity, duration: 1.2, ease: "easeInOut" }}
              >
                <svg className="h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 12a8 8 0 0116 0" />
                </svg>
              </motion.div>
              <motion.span
                initial={{ opacity: 0, x: -15 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2, duration: 0.4 }}
                className="ml-3 text-base font-semibold text-gray-900"
              >
                {isAnalyzing ? "Analyzing contract..." : "Loading contract analysis..."}
              </motion.span>
            </motion.div>
          ) : error ? (
            <motion.div
              key="error"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.4 }}
              className="flex items-center justify-center min-h-[calc(100vh-4rem)]"
            >
              <div className="bg-white p-6 rounded-lg shadow-sm text-center max-w-sm w-full border border-blue-200">
                <p className="text-base font-semibold text-gray-900">{error}</p>
                {error !== "Contract not found" && (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => fetchAnalysisResults(contractId)}
                    className="mt-4 px-5 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-all duration-300 shadow-sm"
                  >
                    Retry
                  </motion.button>
                )}
              </div>
            </motion.div>
          ) : !analysisResults ? (
            <motion.div
              key="no-results"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.4 }}
              className="flex items-center justify-center min-h-[calc(100vh-4rem)]"
            >
              <div className="bg-white p-6 rounded-lg shadow-sm text-center max-w-sm w-full border border-blue-200">
                <p className="text-base font-semibold text-gray-900">No analysis results available.</p>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => fetchAnalysisResults(contractId)}
                  className="mt-4 px-5 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-all duration-300 shadow-sm"
                >
                  Retry
                </motion.button>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="results"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4 }}
              className="w-full"
            >
              <ContractAnalysisResults
                contractId={contractId}
                analysisResults={analysisResults}
                isActive={isActive}
                onUpgrade={handleUpgrade}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}