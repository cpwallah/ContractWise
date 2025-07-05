import { useQuery } from "@tanstack/react-query";
import { useCurrentUser } from "./use-current-user";
import { api } from "@/lib/api";
import { useState } from "react";

interface SubscriptionStatus {
  status: string;
  startDate?: string;
}

export function useSubscription() {
  const {
    isLoading: isUserLoading,
    isError: isUserError,
    user,
  } = useCurrentUser();
  const [loading, setLoading] = useState<boolean>(false);

  const {
    data: subscriptionStatus,
    isLoading: isSubscriptionLoading,
    isError: isSubscriptionError,
    error: subscriptionError,
  } = useQuery<SubscriptionStatus>({
    queryKey: ["subscriptionStatus"],
    queryFn: async () => {
      try {
        const response = await api.get("/payments/membership-status");
        if (response.status !== 200) {
          throw new Error(
            `Failed to fetch subscription status: HTTP ${response.status}`
          );
        }
        return response.data;
      } catch (error: any) {
        console.error("Subscription fetch error:", {
          message: error.message,
          status: error.response?.status,
          userId: user?._id,
          isPremium: user?.isPremium,
          timestamp: new Date().toISOString(),
        });
        // Fallback to user.isPremium
        return {
          status: user?.isPremium === true ? "active" : "inactive",
          startDate: undefined,
        };
      }
    },
    enabled: !!user && !isUserError,
    retry: (failureCount, error: any) =>
      error.response?.status !== 404 && failureCount < 2,
    retryDelay: 1000,
    staleTime: 5 * 60 * 1000,
  });

  return {
    subscriptionStatus,
    isUserLoading,
    isUserError,
    isSubscriptionLoading: isSubscriptionLoading || loading,
    isSubscriptionError: isSubscriptionError && user?.isPremium === undefined, // Only error if isPremium is undefined
    subscriptionError,
    loading,
    setLoading,
    user,
  };
}
