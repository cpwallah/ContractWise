import { useCurrentUser } from "@/hooks/use-current-user";
import { useSubscription } from "@/hooks/use-subscription";
import { api } from "@/lib/api";
import stripePromise from "@/lib/stripe";
import { toast } from "sonner";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Check, Crown } from "lucide-react";
import { Separator } from "../ui/separator";
import { Button } from "../ui/button";
import { Loader2 } from "lucide-react";
import { useState } from "react";

interface User {
  displayName: string;
  email: string;
  isPremium?: boolean;
}

interface SubscriptionStatus {
  status: string;
  startDate?: string;
}

export default function Settings() {
  const {
    subscriptionStatus,
    isUserLoading,
    isUserError,
    isSubscriptionLoading,
    isSubscriptionError,
    subscriptionError,
    setLoading,
  } = useSubscription();
  const { user } = useCurrentUser();
  const [retryCount, setRetryCount] = useState(0);

  // Debug logging
  console.log("Settings Component - Debug Info:", {
    user,
    subscriptionStatus,
    isUserLoading,
    isUserError,
    isSubscriptionLoading,
    isSubscriptionError,
    subscriptionError: subscriptionError?.message,
    isPremium: user?.isPremium,
    timestamp: new Date().toISOString(),
  });

  // Handle retry
  const handleRetry = async () => {
    if (retryCount >= 3) {
      toast.error("Maximum retry attempts reached. Please contact support.", {
        style: {
          background: "#fef2f2",
          color: "#b91c1c",
          border: "1px solid #fecaca",
          borderRadius: "8px",
        },
        className: "shadow-md",
      });
      return;
    }
    setRetryCount(retryCount + 1);
    try {
      window.location.reload();
    } catch (error) {
      toast.error("Retry failed. Please try again later.", {
        style: {
          background: "#fef2f2",
          color: "#b91c1c",
          border: "1px solid #fecaca",
          borderRadius: "8px",
        },
        className: "shadow-md",
      });
    }
  };

  if (isUserLoading || isSubscriptionLoading) {
    return (
      <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8 flex justify-center items-center min-h-[50vh]">
        <Card className="w-full max-w-md border border-gray-200/50 bg-white/95 backdrop-blur-sm shadow-lg rounded-xl">
          <CardContent className="flex justify-center items-center py-6">
            <Loader2 className="h-6 w-6 animate-spin text-teal-500" aria-label="Loading settings" />
            <span className="ml-2 text-base font-medium text-gray-700">Loading settings...</span>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isUserError || !user) {
    const errorMessage = isUserError ? "Failed to load user details." : "User data not available.";
    return (
      <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8 flex justify-center items-center min-h-[50vh]">
        <Card className="w-full max-w-md border-2 border-red-200 bg-white/95 backdrop-blur-sm shadow-lg rounded-xl">
          <CardHeader className="bg-red-50/90 rounded-t-xl px-4 py-3">
            <CardTitle className="text-lg sm:text-xl font-bold text-red-700">Error Loading Settings</CardTitle>
            <CardDescription className="text-red-600 text-sm">
              {errorMessage} Please try again or contact support.
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-4 px-4 space-y-3">
            <Button
              onClick={handleRetry}
              disabled={retryCount >= 3}
              className="w-full bg-teal-500 text-white hover:bg-teal-600 transition-all duration-200 rounded-lg text-sm font-semibold py-2 focus-visible:ring-2 focus-visible:ring-teal-400 focus-visible:ring-offset-2"
              aria-label="Retry loading settings"
            >
              Retry ({3 - retryCount} attempts left)
            </Button>
            <p className="text-xs text-gray-500 text-center">
              If the issue persists,{" "}
              <a
                href="mailto:support@example.com"
                className="text-teal-500 hover:underline font-medium"
                aria-label="Contact support"
              >
                contact support
              </a>.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isSubscriptionError && user.isPremium !== undefined) {
    toast.warning(
      "Unable to verify subscription status with server. Displaying status based on user data.",
      {
        style: {
          background: "#fefce8",
          color: "#b45309",
          border: "1px solid #fef08a",
          borderRadius: "8px",
        },
        className: "shadow-md",
        duration: 4000,
      }
    );
  }

  const isActive = user.isPremium === true || subscriptionStatus?.status === "active";

  const handleUpgrade = async () => {
    if (isActive) {
      toast.error("You are already a premium member", {
        style: {
          background: "#fef2f2",
          color: "#b91c1c",
          border: "1px solid #fecaca",
          borderRadius: "8px",
        },
        className: "shadow-md",
      });
      return;
    }

    setLoading(true);
    try {
      const response = await api.get("/payments/create-checkout-session");
      const stripe = await stripePromise;
      if (!stripe) {
        throw new Error("Stripe failed to initialize");
      }
      const { error } = await stripe.redirectToCheckout({
        sessionId: response.data.sessionId,
      });
      if (error) {
        throw new Error(error.message);
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to initiate upgrade. Please try again.", {
        style: {
          background: "#fef2f2",
          color: "#b91c1c",
          border: "1px solid #fecaca",
          borderRadius: "8px",
        },
        className: "shadow-md",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8 max-w-5xl">
      <div className="flex flex-col gap-4 sm:gap-6 md:grid md:grid-cols-2">
        <Card className="w-full border-gray-200/50 bg-white/95 backdrop-blur-sm shadow-lg rounded-xl transition-all duration-300 hover:shadow-xl hover:-translate-y-0.5">
          <CardHeader className="bg-gray-50/90 rounded-t-xl px-4 sm:px-5 py-3">
            <CardTitle className="text-lg sm:text-xl font-semibold text-gray-800">
              Personal Information
            </CardTitle>
            <CardDescription className="text-gray-600 text-sm">
              Manage your account details
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-3 sm:pt-4 px-4 sm:px-5 space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="name" className="text-sm font-medium text-gray-700">
                Full Name
              </Label>
              <Input
                id="name"
                value={user.displayName || "Not provided"}
                readOnly
                className="bg-gray-100/50 text-gray-900 border-gray-300 rounded-lg text-sm focus:ring-teal-400 focus:border-teal-400 transition-colors duration-200"
                aria-readonly="true"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                Email
              </Label>
              <Input
                id="email"
                value={user.email || "Not provided"}
                readOnly
                className="bg-gray-100/50 text-gray-900 border-gray-300 rounded-lg text-sm focus:ring-teal-400 focus:border-teal-400 transition-colors duration-200"
                aria-readonly="true"
              />
            </div>
            <p className="text-xs text-gray-500">
              Your account is managed through Google. To change your details,{" "}
              <a
                href="mailto:support@example.com"
                className="text-teal-500 hover:underline font-medium"
                aria-label="Contact support"
              >
                contact support
              </a>.
            </p>
          </CardContent>
        </Card>

        {isActive ? (
          <Card className="w-full border-2 border-teal-200/50 bg-gradient-to-br from-teal-50/90 to-white/95 backdrop-blur-sm shadow-lg rounded-xl transition-all duration-300 hover:shadow-xl hover:-translate-y-0.5">
            <CardHeader className="relative bg-gradient-to-r from-teal-100/90 to-teal-50/90 rounded-t-xl px-4 sm:px-5 py-3">
              <CardTitle className="text-lg sm:text-xl font-semibold text-teal-800 flex items-center gap-2">
                <Crown className="h-4 w-4 sm:h-5 sm:w-5 text-amber-500" />
                Premium Membership
              </CardTitle>
              <CardDescription className="text-teal-600 text-sm">
                Your exclusive benefits
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-3 sm:pt-4 px-4 sm:px-5 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <div className="flex items-center gap-1 rounded-full bg-green-100/90 p-1 pr-2.5 text-xs font-medium text-green-700">
                    <div className="rounded-full bg-green-200/90 p-0.5">
                      <Check size={12} className="text-green-700" />
                    </div>
                    Active
                  </div>
                  <p className="text-xs text-gray-500">Lifetime Membership</p>
                </div>
              </div>
              <Separator className="bg-gray-200/50" />
              <div className="space-y-3">
                <p className="text-xs text-gray-700 leading-relaxed">
                  Thank you for being a premium member! Enjoy unlimited access to advanced contract analysis, AI-powered insights, priority support, and exclusive updates.
                </p>
                {subscriptionStatus?.startDate && (
                  <p className="text-xs text-gray-500">
                    Started:{" "}
                    <span className="font-medium">
                      {new Date(subscriptionStatus.startDate).toLocaleDateString()}
                    </span>
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card className="w-full border-2 border-teal-300/50 bg-white/95 backdrop-blur-sm shadow-lg rounded-xl transition-all duration-300 hover:shadow-xl hover:-translate-y-0.5">
            <CardHeader className="bg-gradient-to-r from-teal-50/90 to-white/95 rounded-t-xl px-4 sm:px-5 py-3">
              <CardTitle className="text-lg sm:text-xl font-semibold text-gray-800">
                Upgrade to Premium
              </CardTitle>
              <CardDescription className="text-gray-600 text-sm">
                Elevate your experience
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-3 sm:pt-4 px-4 sm:px-5 space-y-4">
              <div className="space-y-3">
                <p className="text-xl sm:text-2xl font-bold text-gray-900">$10 Lifetime</p>
                <ul className="list-none space-y-2 text-gray-700 text-xs sm:text-sm">
                  <li className="flex items-center gap-1.5">
                    <Check className="h-4 w-4 text-teal-500" />
                    <span>Unlimited contract analysis</span>
                  </li>
                  <li className="flex items-center gap-1.5">
                    <Check className="h-4 w-4 text-teal-500" />
                    <span>Advanced AI insights</span>
                  </li>
                  <li className="flex items-center gap-1.5">
                    <Check className="h-4 w-4 text-teal-500" />
                    <span>Priority customer support</span>
                  </li>
                  <li className="flex items-center gap-1.5">
                    <Check className="h-4 w-4 text-teal-500" />
                    <span>Exclusive feature updates</span>
                  </li>
                </ul>
              </div>
              <Button
                onClick={handleUpgrade}
                disabled={isSubscriptionLoading}
                className="w-full bg-gradient-to-r from-teal-500 to-teal-400 text-white hover:from-teal-600 hover:to-teal-500 transition-all duration-200 rounded-lg text-sm font-semibold py-2 focus-visible:ring-2 focus-visible:ring-teal-400 focus-visible:ring-offset-2"
                aria-label="Upgrade to Premium"
              >
                {isSubscriptionLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  "Upgrade Now"
                )}
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}