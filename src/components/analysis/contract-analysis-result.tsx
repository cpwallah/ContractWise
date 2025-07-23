// "use client";

// import { useState, useMemo } from "react";
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
// import { motion, AnimatePresence, Variants } from "framer-motion";
// import { Badge } from "@/components/ui/badge";
// import { Button } from "@/components/ui/button";
// import OverallScoreChart from "./chart";

// interface IRisk {
//   risk: string;
//   explanation: string;
//   severity: string;
//   id: string;
// }

// interface IOpportunity {
//   opportunity: string;
//   explanation: string;
//   impact: string;
//   id: string;
// }

// interface IContractAnalysis {
//   companyName?: string;
//   overallScore: number;
//   summary?: string;
//   risks?: IRisk[];
//   opportunities?: IOpportunity[];
//   keyClauses?: string[];
//   recommendations?: string[];
//   contractDuration?: string;
//   terminationConditions?: string;
//   legalCompliance?: string;
//   negotiationPoints?: string[];
// }

// interface IContractAnalysisResultsProps {
//   analysisResults: IContractAnalysis | null;
//   isActive: boolean;
//   contractId?: string;
//   onUpgrade: () => void;
// }

// export default function ContractAnalysisResults({
//   analysisResults,
//   isActive,
//   contractId,
//   onUpgrade,
// }: IContractAnalysisResultsProps) {
//   const [activeSection, setActiveSection] = useState("summary");
//   const [isNavOpen, setIsNavOpen] = useState(false);

//   const sections = ["summary", "risks", "opportunities", "details", "negotiation"];

//   const buttonVariants: Variants = {
//     initial: { scale: 1, boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)" },
//     hover: { scale: 1.05, boxShadow: "0 6px 12px rgba(0, 0, 0, 0.15)" },
//     tap: { scale: 0.95, boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)" },
//   };

//   const pulseVariants: Variants = {
//     initial: { scale: 1, opacity: 0 },
//     animate: { scale: 1.5, opacity: 0.3, transition: { duration: 0.3, ease: "easeOut" } },
//     exit: { scale: 1, opacity: 0, transition: { duration: 0.3 } },
//   };

//   const navVariants: Variants = {
//     hidden: { opacity: 0, y: "-100%" },
//     visible: {
//       opacity: 1,
//       y: 0,
//       transition: {
//         duration: 0.4,
//         when: "beforeChildren",
//         staggerChildren: 0.1,
//       },
//     },
//     exit: { opacity: 0, y: "-100%", transition: { duration: 0.4 } },
//   };

//   const navItemVariants: Variants = {
//     hidden: { opacity: 0, y: 20 },
//     visible: { opacity: 1, y: 0 },
//   };

//   if (!analysisResults) {
//     return (
//       <div className="w-full min-h-[calc(100vh-4rem)] bg-gradient-to-b from-blue-50 to-white overflow-y-auto">
//         <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
//           <Card className="bg-white border border-blue-200 rounded-lg shadow-sm max-w-3xl mx-auto">
//             <CardContent className="pt-8 pb-10">
//               <p className="text-base font-semibold text-gray-900">No analysis results available</p>
//             </CardContent>
//           </Card>
//         </div>
//       </div>
//     );
//   }

//   const rawScore = analysisResults.overallScore;
//   const getScore = useMemo(() => {
//     const parsedScore = Number(rawScore);
//     return Number.isNaN(parsedScore) ? 0 : Math.max(0, Math.min(100, parsedScore));
//   }, [rawScore]);

//   const scoreTrend = useMemo(() => {
//     if (getScore > 70) {
//       return { icon: () => <svg className="w-6 h-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" /></svg>, color: "text-green-500", text: "Excellent" };
//     } else if (getScore < 50 && getScore >= 0) {
//       return { icon: () => <svg className="w-6 h-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>, color: "text-red-500", text: "Critical" };
//     } else {
//       return { icon: () => <svg className="w-6 h-6 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 12H6" /></svg>, color: "text-yellow-500", text: "Stable" };
//     }
//   }, [getScore]);

//   const getImpactColor = (impact?: string) => {
//     switch (impact?.toLowerCase()) {
//       case "high":
//         return "bg-green-100 text-green-800 border-green-200";
//       case "medium":
//         return "bg-yellow-100 text-yellow-800 border-yellow-200";
//       case "low":
//         return "bg-red-100 text-red-800 border-red-200";
//       default:
//         return "bg-gray-100 text-gray-800 border-gray-200";
//     }
//   };

//   const truncateText = (text: string | undefined, maxLength: number) => {
//     if (!text) return "";
//     if (text.length <= maxLength) return text;
//     return text.slice(0, maxLength) + "...";
//   };

//   const renderRisksAndOpportunities = (
//     items: Array<IRisk | IOpportunity> | undefined,
//     type: "risk" | "opportunity"
//   ) => {
//     if (!items || items.length === 0) {
//       return <p className="text-sm text-gray-600">No {type}s identified</p>;
//     }
//     const displayItems = isActive ? items : items.slice(0, 5);

//     return (
//       <ul className="space-y-4">
//         <AnimatePresence>
//           {displayItems.map((item, index) => (
//             <motion.li
//               key={item.id || `${type}-${index}`}
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//               exit={{ opacity: 0, y: -20 }}
//               transition={{ duration: 0.4, delay: index * 0.1 }}
//               className="bg-white border border-blue-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow"
//             >
//               <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-2">
//                 <span className="text-sm font-medium text-gray-900">
//                   {type === "risk" ? (item as IRisk).risk : (item as IOpportunity).opportunity}
//                 </span>
//                 <Badge
//                   className={`mt-2 sm:mt-0 px-2.5 py-0.5 ${getImpactColor(type === "risk" ? (item as IRisk).severity : (item as IOpportunity).impact)} text-xs`}
//                 >
//                   {(type === "risk" ? (item as IRisk).severity : (item as IOpportunity).impact)?.toUpperCase()}
//                 </Badge>
//               </div>
//               <p className="text-sm text-gray-600">{truncateText(item.explanation, 100)}</p>
//             </motion.li>
//           ))}
//           {!isActive && items.length > 5 && (
//             <motion.li
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ duration: 0.4 }}
//               className="bg-white border border-blue-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow"
//             >
//               <p className="text-sm text-gray-600">
//                 Upgrade to premium to view {items.length - 5} more {type}s
//               </p>
//               <Button
//                 className="mt-3 bg-blue-600 text-white hover:bg-blue-700 text-xs rounded-md px-4 py-1.5"
//                 onClick={onUpgrade}
//               >
//                 Unlock Premium
//               </Button>
//             </motion.li>
//           )}
//         </AnimatePresence>
//       </ul>
//     );
//   };

//   const renderPremiumContent = (content: React.ReactNode) => {
//     if (isActive) {
//       return content;
//     }
//     return (
//       <div className="relative">
//         <div className="absolute inset-0 bg-white/80 flex items-center justify-center rounded-lg z-10">
//           <Button
//             className="bg-blue-600 text-white hover:bg-blue-700 text-xs rounded-md px-4 py-1.5"
//             onClick={onUpgrade}
//           >
//             Unlock Premium
//           </Button>
//         </div>
//         <div className="opacity-40 pointer-events-none">{content}</div>
//       </div>
//     );
//   };

//   const renderSectionContent = () => {
//     switch (activeSection) {
//       case "summary":
//         return (
//           <motion.div
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.4 }}
//           >
//             <Card className="bg-white border border-blue-200 rounded-lg shadow-sm">
//               <CardHeader>
//                 <CardTitle className="text-xl font-semibold text-gray-900">Contract Summary</CardTitle>
//                 <CardDescription className="text-sm text-gray-600">High-level insights into the contract</CardDescription>
//               </CardHeader>
//               <CardContent>
//                 <p className="text-sm text-gray-600">{analysisResults.summary || "Not available"}</p>
//               </CardContent>
//             </Card>
//           </motion.div>
//         );
//       case "risks":
//         return (
//           <motion.div
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.4 }}
//           >
//             <Card className="bg-white border border-blue-200 rounded-lg shadow-sm">
//               <CardHeader>
//                 <CardTitle className="text-xl font-semibold text-gray-900">Identified Risks</CardTitle>
//                 <CardDescription className="text-sm text-gray-600">Potential challenges in the contract</CardDescription>
//               </CardHeader>
//               <CardContent>
//                 {renderRisksAndOpportunities(analysisResults.risks, "risk")}
//               </CardContent>
//             </Card>
//           </motion.div>
//         );
//       case "opportunities":
//         return (
//           <motion.div
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.4 }}
//           >
//             <Card className="bg-white border border-blue-200 rounded-lg shadow-sm">
//               <CardHeader>
//                 <CardTitle className="text-xl font-semibold text-gray-900">Identified Opportunities</CardTitle>
//                 <CardDescription className="text-sm text-gray-600">Strategic advantages in the contract</CardDescription>
//               </CardHeader>
//               <CardContent>
//                 {renderRisksAndOpportunities(analysisResults.opportunities, "opportunity")}
//               </CardContent>
//             </Card>
//           </motion.div>
//         );
//       case "details":
//         return (
//           <motion.div
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.4 }}
//           >
//             <Card className="bg-white border border-blue-200 rounded-lg shadow-sm">
//               <CardHeader>
//                 <CardTitle className="text-xl font-semibold text-gray-900">Contract Details</CardTitle>
//                 <CardDescription className="text-sm text-gray-600">Key clauses, recommendations, and compliance</CardDescription>
//               </CardHeader>
//               <CardContent>
//                 {renderPremiumContent(
//                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                     <div>
//                       <h4 className="text-sm font-medium text-gray-900 mb-2">Key Clauses</h4>
//                       <ul className="space-y-2">
//                         {analysisResults.keyClauses?.length ? (
//                           analysisResults.keyClauses.slice(0, isActive ? undefined : 2).map((clause, index) => (
//                             <motion.li
//                               key={`clause-${index}`}
//                               className="text-sm text-gray-600"
//                               initial={{ opacity: 0, x: -10 }}
//                               animate={{ opacity: 1, x: 0 }}
//                               transition={{ delay: index * 0.1 }}
//                             >
//                               {truncateText(clause, 100)}
//                             </motion.li>
//                           ))
//                         ) : (
//                           <li className="text-sm text-gray-600">No key clauses identified</li>
//                         )}
//                       </ul>
//                     </div>
//                     <div>
//                       <h4 className="text-sm font-medium text-gray-900 mb-2">Recommendations</h4>
//                       <ul className="space-y-2">
//                         {analysisResults.recommendations?.length ? (
//                           analysisResults.recommendations.slice(0, isActive ? undefined : 2).map((rec, index) => (
//                             <motion.li
//                               key={`rec-${index}`}
//                               className="text-sm text-gray-600"
//                               initial={{ opacity: 0, x: -10 }}
//                               animate={{ opacity: 1, x: 0 }}
//                               transition={{ delay: index * 0.1 }}
//                             >
//                               {truncateText(rec, 100)}
//                             </motion.li>
//                           ))
//                         ) : (
//                           <li className="text-sm text-gray-600">No recommendations available</li>
//                         )}
//                       </ul>
//                     </div>
//                     <div>
//                       <h4 className="text-sm font-medium text-gray-900 mb-2">Contract Terms</h4>
//                       <div className="space-y-2">
//                         <div>
//                           <h5 className="text-sm font-medium text-gray-900">Duration</h5>
//                           <p className="text-sm text-gray-600">{truncateText(analysisResults.contractDuration, 100)}</p>
//                         </div>
//                         <div>
//                           <h5 className="text-sm font-medium text-gray-900">Termination Conditions</h5>
//                           <p className="text-sm text-gray-600">{truncateText(analysisResults.terminationConditions, 100)}</p>
//                         </div>
//                       </div>
//                     </div>
//                     <div>
//                       <h4 className="text-sm font-medium text-gray-900 mb-2">Legal Compliance</h4>
//                       <p className="text-sm text-gray-600">{truncateText(analysisResults.legalCompliance, 100)}</p>
//                     </div>
//                   </div>
//                 )}
//               </CardContent>
//             </Card>
//           </motion.div>
//         );
//       case "negotiation":
//         return (
//           <motion.div
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.4 }}
//           >
//             <Card className="bg-white border border-blue-200 rounded-lg shadow-sm">
//               <CardHeader>
//                 <CardTitle className="text-xl font-semibold text-gray-900">Negotiation Points</CardTitle>
//                 <CardDescription className="text-sm text-gray-600">Key areas for strategic discussion</CardDescription>
//               </CardHeader>
//               <CardContent>
//                 {renderPremiumContent(
//                   <ul className="space-y-2">
//                     {analysisResults.negotiationPoints?.length ? (
//                       analysisResults.negotiationPoints.slice(0, isActive ? undefined : 1).map((point, index) => (
//                         <motion.li
//                           key={`point-${index}`}
//                           className="text-sm text-gray-600"
//                           initial={{ opacity: 0, x: -10 }}
//                           animate={{ opacity: 1, x: 0 }}
//                           transition={{ delay: index * 0.1 }}
//                         >
//                           {truncateText(point, 100)}
//                         </motion.li>
//                       ))
//                     ) : (
//                       <li className="text-sm text-gray-600">No negotiation points identified</li>
//                     )}
//                   </ul>
//                 )}
//               </CardContent>
//             </Card>
//           </motion.div>
//         );
//       default:
//         return null;
//     }
//   };

//   return (
//     <div className="w-full min-h-[calc(100vh-4rem)] bg-gradient-to-b from-blue-50 to-white overflow-y-auto">
//       <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
//         <Button
//           variant="ghost"
//           className="sm:hidden fixed top-4 right-4 z-50 bg-white/90 text-gray-900 hover:bg-gray-100 rounded-lg p-2 shadow-md"
//           onClick={() => setIsNavOpen(!isNavOpen)}
//         >
//           {isNavOpen ? (
//             <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
//             </svg>
//           ) : (
//             <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
//             </svg>
//           )}
//         </Button>

//         <motion.nav
//           initial={{ opacity: 0, y: -20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.4 }}
//           className="sticky top-16 z-20 bg-white/95 shadow-sm rounded-b-lg mb-6 mt-16 backdrop-blur-sm"
//         >
//           <div className="hidden sm:flex flex-row gap-2 p-3 max-w-7xl mx-auto">
//             {sections.map((section) => (
//               <motion.div
//                 key={section}
//                 className="relative"
//                 whileHover={{ scale: 1.05 }}
//                 whileTap={{ scale: 0.95 }}
//               >
//                 <motion.div
//                   className="absolute inset-0 bg-blue-100 rounded-md"
//                   variants={pulseVariants}
//                   initial="initial"
//                   animate={activeSection === section ? "animate" : "initial"}
//                 />
//                 <Button
//                   variant="ghost"
//                   className={`relative px-3 py-1.5 text-sm font-medium text-gray-900 hover:bg-blue-100 rounded-md ${
//                     activeSection === section ? "bg-blue-100 text-blue-800" : ""
//                   }`}
//                   onClick={() => setActiveSection(section)}
//                 >
//                   {section.charAt(0).toUpperCase() + section.slice(1)}
//                 </Button>
//               </motion.div>
//             ))}
//           </div>
//         </motion.nav>

//         <AnimatePresence>
//           {isNavOpen && (
//             <motion.nav
//               variants={navVariants}
//               initial="hidden"
//               animate="visible"
//               exit="exit"
//               className="sm:hidden fixed top-16 left-0 w-full bg-white/95 shadow-lg z-40 p-4 mt-16 backdrop-blur-sm"
//             >
//               <div className="flex flex-col gap-2">
//                 {sections.map((section) => (
//                   <motion.div
//                     key={section}
//                     variants={navItemVariants}
//                     className="relative"
//                   >
//                     <motion.div
//                       className="absolute inset-0 bg-blue-100 rounded-md"
//                       variants={pulseVariants}
//                       initial="initial"
//                       animate={activeSection === section ? "animate" : "initial"}
//                     />
//                     <Button
//                       variant="ghost"
//                       className={`w-full text-left px-3 py-1.5 text-sm font-medium text-gray-900 hover:bg-blue-100 rounded-md ${
//                         activeSection === section ? "bg-blue-100 text-blue-800" : ""
//                       }`}
//                       onClick={() => {
//                         setActiveSection(section);
//                         setIsNavOpen(false);
//                       }}
//                     >
//                       {section.charAt(0).toUpperCase() + section.slice(1)}
//                     </Button>
//                   </motion.div>
//                 ))}
//               </div>
//             </motion.nav>
//           )}
//         </AnimatePresence>

//         <div className="max-w-4xl mx-auto space-y-6 pb-16">
//           {activeSection === "summary" && (
//             <motion.div
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ duration: 0.4 }}
//             >
//               <Card className="bg-white border border-blue-200 rounded-lg shadow-sm">
//                 <CardContent className="pt-6 pb-8">
//                   <div className="flex flex-col md:flex-row items-center gap-6">
//                     <div className="flex-1 text-center md:text-left">
//                       <h1 className="text-2xl font-semibold text-gray-900">
//                         Contract Analysis for {truncateText(analysisResults.companyName, 50)} {contractId ? `(${contractId})` : ""}
//                       </h1>
//                       <p className="text-sm text-gray-600 mt-2">
//                         Actionable insights and recommendations
//                       </p>
//                       {!isActive && (
//                         <Button
//                           className="mt-4 bg-blue-600 text-white hover:bg-blue-700 text-xs rounded-md px-4 py-1.5"
//                           onClick={onUpgrade}
//                         >
//                           Unlock Premium
//                         </Button>
//                       )}
//                     </div>
//                     <div className="flex-1 flex justify-center">
//                       <OverallScoreChart overallScore={getScore} />
//                     </div>
//                   </div>
//                   <div className="mt-6 flex items-center justify-between">
//                     <div className="flex items-center gap-3">
//                       <span className="text-2xl font-semibold text-gray-900">{getScore}</span>
//                       <div className={`flex items-center ${scoreTrend.color} gap-2`}>
//                         <scoreTrend.icon />
//                         <span className="text-sm font-medium">{scoreTrend.text}</span>
//                       </div>
//                     </div>
//                     <span className="text-sm text-gray-600">Confidence: {getScore}%</span>
//                   </div>
//                 </CardContent>
//               </Card>
//             </motion.div>
//           )}

//           {renderSectionContent()}
//         </div>
//       </div>
//     </div>
//   );
// }


"use client";

import { useState, useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Header } from "../header";

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
  analysisResults: IContractAnalysis | null;
  isActive: boolean;
  contractId?: string;
  onUpgrade: () => void;
}

// Placeholder for OverallScoreChart
const OverallScoreChart = ({ overallScore }: { overallScore: number }) => {
  return (
    <div className="relative w-20 h-20 sm:w-24 sm:h-24 md:w-32 md:h-32">
      <svg className="w-full h-full" viewBox="0 0 100 100">
        <circle
          className="text-gray-200"
          strokeWidth="10"
          stroke="currentColor"
          fill="transparent"
          r="45"
          cx="50"
          cy="50"
        />
        <circle
          className="text-blue-600"
          strokeWidth="10"
          strokeDasharray={`${overallScore * 2.83}, 283`}
          strokeDashoffset="0"
          strokeLinecap="round"
          stroke="currentColor"
          fill="transparent"
          r="45"
          cx="50"
          cy="50"
        />
        <text
          x="50"
          y="50"
          textAnchor="middle"
          dy=".3em"
          className="text-base sm:text-lg md:text-xl font-semibold text-gray-900"
        >
          {overallScore}
        </text>
      </svg>
    </div>
  );
};

export default function ContractAnalysisResults({
  analysisResults,
  isActive,
  contractId,
  onUpgrade,
}: IContractAnalysisResultsProps) {
  const [activeSection, setActiveSection] = useState("summary");

  const sections = ["summary", "risks", "opportunities", "details", "negotiation"];

  const buttonVariants: Variants = {
    initial: { scale: 1, boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)" },
    hover: { scale: 1.05, boxShadow: "0 6px 12px rgba(0, 0, 0, 0.15)" },
    tap: { scale: 0.95, boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)" },
  };

  const pulseVariants: Variants = {
    initial: { scale: 1, opacity: 0 },
    animate: { scale: 1.5, opacity: 0.3, transition: { duration: 0.3, ease: "easeOut" } },
    exit: { scale: 1, opacity: 0, transition: { duration: 0.3 } },
  };

  if (!analysisResults) {
    return (
      <div className="w-full min-h-[calc(100vh-4rem)] bg-gradient-to-b from-blue-50 to-white overflow-y-auto">
        {/* <Header  /> */}
        <div className="container mx-auto px-2 sm:px-4 lg:px-6 pt-16 sm:pt-20">
          <Card className="bg-white border border-blue-200 rounded-lg shadow-sm max-w-3xl mx-auto">
            <CardContent className="pt-6 pb-8">
              <p className="text-sm sm:text-base font-semibold text-gray-900">No analysis results available</p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const rawScore = analysisResults.overallScore;
  const getScore = useMemo(() => {
    const parsedScore = Number(rawScore);
    return Number.isNaN(parsedScore) ? 0 : Math.max(0, Math.min(100, parsedScore));
  }, [rawScore]);

  const scoreTrend = useMemo(() => {
    if (getScore > 70) {
      return { icon: () => <svg className="w-4 h-4 sm:w-5 sm:h-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" /></svg>, color: "text-green-500", text: "Excellent" };
    } else if (getScore < 50 && getScore >= 0) {
      return { icon: () => <svg className="w-4 h-4 sm:w-5 sm:h-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>, color: "text-red-500", text: "Critical" };
    } else {
      return { icon: () => <svg className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 12H6" /></svg>, color: "text-yellow-500", text: "Stable" };
    }
  }, [getScore]);

  const getImpactColor = (impact?: string) => {
    switch (impact?.toLowerCase()) {
      case "high":
        return "bg-green-100 text-green-800 border-green-200";
      case "medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "low":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const truncateText = (text: string | undefined, maxLength: number) => {
    if (!text) return "";
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength) + "...";
  };

  const renderRisksAndOpportunities = (
    items: Array<IRisk | IOpportunity> | undefined,
    type: "risk" | "opportunity"
  ) => {
    if (!items || items.length === 0) {
      return <p className="text-xs sm:text-sm text-gray-600">No {type}s identified</p>;
    }
    const displayItems = isActive ? items : items.slice(0, 5);

    return (
      <ul className="space-y-3">
        <AnimatePresence>
          {displayItems.map((item, index) => (
            <motion.li
              key={item.id || `${type}-${index}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className="bg-white border border-blue-200 rounded-lg p-3 sm:p-4 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-2">
                <span className="text-xs sm:text-sm font-medium text-gray-900">
                  {type === "risk" ? (item as IRisk).risk : (item as IOpportunity).opportunity}
                </span>
                <Badge
                  className={`mt-2 sm:mt-0 px-2 py-0.5 ${getImpactColor(type === "risk" ? (item as IRisk).severity : (item as IOpportunity).impact)} text-xs`}
                >
                  {(type === "risk" ? (item as IRisk).severity : (item as IOpportunity).impact)?.toUpperCase()}
                </Badge>
              </div>
              <p className="text-xs sm:text-sm text-gray-600">{truncateText(item.explanation, 100)}</p>
            </motion.li>
          ))}
          {!isActive && items.length > 5 && (
            <motion.li
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="bg-white border border-blue-200 rounded-lg p-3 sm:p-4 shadow-sm hover:shadow-md transition-shadow"
            >
              <p className="text-xs sm:text-sm text-gray-600">
                Upgrade to premium to view {items.length - 5} more {type}s
              </p>
              <Button
                className="mt-2 bg-blue-600 text-white hover:bg-blue-700 text-xs rounded-md px-3 py-1.5 sm:px-4 sm:py-2"
                onClick={onUpgrade}
              >
                Unlock Premium
              </Button>
            </motion.li>
          )}
        </AnimatePresence>
      </ul>
    );
  };

  const renderPremiumContent = (content: React.ReactNode) => {
    if (isActive) {
      return content;
    }
    return (
      <div className="relative">
        <div className="absolute inset-0 bg-white/80 flex items-center justify-center rounded-lg z-10">
          <Button
            className="bg-blue-600 text-white hover:bg-blue-700 text-xs rounded-md px-3 py-1.5 sm:px-4 sm:py-2"
            onClick={onUpgrade}
          >
            Unlock Premium
          </Button>
        </div>
        <div className="opacity-40 pointer-events-none">{content}</div>
      </div>
    );
  };

  const renderSectionContent = () => {
    switch (activeSection) {
      case "summary":
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <Card className="bg-white border border-blue-200 rounded-lg shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg sm:text-xl font-semibold text-gray-900">Contract Summary</CardTitle>
                <CardDescription className="text-xs sm:text-sm text-gray-600">High-level insights into the contract</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-xs sm:text-sm text-gray-600">{analysisResults.summary || "Not available"}</p>
              </CardContent>
            </Card>
          </motion.div>
        );
      case "risks":
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <Card className="bg-white border border-blue-200 rounded-lg shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg sm:text-xl font-semibold text-gray-900">Identified Risks</CardTitle>
                <CardDescription className="text-xs sm:text-sm text-gray-600">Potential challenges in the contract</CardDescription>
              </CardHeader>
              <CardContent>
                {renderRisksAndOpportunities(analysisResults.risks, "risk")}
              </CardContent>
            </Card>
          </motion.div>
        );
      case "opportunities":
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <Card className="bg-white border border-blue-200 rounded-lg shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg sm:text-xl font-semibold text-gray-900">Identified Opportunities</CardTitle>
                <CardDescription className="text-xs sm:text-sm text-gray-600">Strategic advantages in the contract</CardDescription>
              </CardHeader>
              <CardContent>
                {renderRisksAndOpportunities(analysisResults.opportunities, "opportunity")}
              </CardContent>
            </Card>
          </motion.div>
        );
      case "details":
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <Card className="bg-white border border-blue-200 rounded-lg shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg sm:text-xl font-semibold text-gray-900">Contract Details</CardTitle>
                <CardDescription className="text-xs sm:text-sm text-gray-600">Key clauses, recommendations, and compliance</CardDescription>
              </CardHeader>
              <CardContent>
                {renderPremiumContent(
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                    <div>
                      <h4 className="text-sm sm:text-base font-medium text-gray-900 mb-2">Key Clauses</h4>
                      <ul className="space-y-2">
                        {analysisResults.keyClauses?.length ? (
                          analysisResults.keyClauses.slice(0, isActive ? undefined : 2).map((clause, index) => (
                            <motion.li
                              key={`clause-${index}`}
                              className="text-xs sm:text-sm text-gray-600"
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: index * 0.1 }}
                            >
                              {truncateText(clause, 100)}
                            </motion.li>
                          ))
                        ) : (
                          <li className="text-xs sm:text-sm text-gray-600">No key clauses identified</li>
                        )}
                      </ul>
                    </div>
                    <div>
                      <h4 className="text-sm sm:text-base font-medium text-gray-900 mb-2">Recommendations</h4>
                      <ul className="space-y-2">
                        {analysisResults.recommendations?.length ? (
                          analysisResults.recommendations.slice(0, isActive ? undefined : 2).map((rec, index) => (
                            <motion.li
                              key={`rec-${index}`}
                              className="text-xs sm:text-sm text-gray-600"
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: index * 0.1 }}
                            >
                              {truncateText(rec, 100)}
                            </motion.li>
                          ))
                        ) : (
                          <li className="text-xs sm:text-sm text-gray-600">No recommendations available</li>
                        )}
                      </ul>
                    </div>
                    <div>
                      <h4 className="text-sm sm:text-base font-medium text-gray-900 mb-2">Contract Terms</h4>
                      <div className="space-y-2">
                        <div>
                          <h5 className="text-xs sm:text-sm font-medium text-gray-900">Duration</h5>
                          <p className="text-xs sm:text-sm text-gray-600">{truncateText(analysisResults.contractDuration, 100)}</p>
                        </div>
                        <div>
                          <h5 className="text-xs sm:text-sm font-medium text-gray-900">Termination Conditions</h5>
                          <p className="text-xs sm:text-sm text-gray-600">{truncateText(analysisResults.terminationConditions, 100)}</p>
                        </div>
                      </div>
                    </div>
                    <div>
                      <h4 className="text-sm sm:text-base font-medium text-gray-900 mb-2">Legal Compliance</h4>
                      <p className="text-xs sm:text-sm text-gray-600">{truncateText(analysisResults.legalCompliance, 100)}</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        );
      case "negotiation":
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <Card className="bg-white border border-blue-200 rounded-lg shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg sm:text-xl font-semibold text-gray-900">Negotiation Points</CardTitle>
                <CardDescription className="text-xs sm:text-sm text-gray-600">Key areas for strategic discussion</CardDescription>
              </CardHeader>
              <CardContent>
                {renderPremiumContent(
                  <ul className="space-y-2">
                    {analysisResults.negotiationPoints?.length ? (
                      analysisResults.negotiationPoints.slice(0, isActive ? undefined : 1).map((point, index) => (
                        <motion.li
                          key={`point-${index}`}
                          className="text-xs sm:text-sm text-gray-600"
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                        >
                          {truncateText(point, 100)}
                        </motion.li>
                      ))
                    ) : (
                      <li className="text-xs sm:text-sm text-gray-600">No negotiation points identified</li>
                    )}
                  </ul>
                )}
              </CardContent>
            </Card>
          </motion.div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="w-full min-h-[calc(100vh-4rem)] bg-gradient-to-b from-blue-50 to-white overflow-y-auto">
      <Header  />
      <div className="container mx-auto px-2 sm:px-4 lg:px-6 pt-16 sm:pt-20">
        <motion.nav
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="sticky top-12 sm:top-14 z-40 bg-white/95 shadow-sm rounded-b-lg mb-4 backdrop-blur-sm overflow-x-auto"
        >
          <div className="flex flex-row gap-1 sm:gap-2 p-2 max-w-7xl mx-auto">
            {sections.map((section) => (
              <motion.div
                key={section}
                className="relative flex-shrink-0"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <motion.div
                  className="absolute inset-0 bg-blue-100 rounded-md"
                  variants={pulseVariants}
                  initial="initial"
                  animate={activeSection === section ? "animate" : "initial"}
                />
                <Button
                  variant="ghost"
                  className={`relative px-2 py-1 sm:px-3 sm:py-1.5 text-xs sm:text-sm font-medium text-gray-900 hover:bg-blue-100 rounded-md whitespace-nowrap ${
                    activeSection === section ? "bg-blue-100 text-blue-800" : ""
                  }`}
                  onClick={() => setActiveSection(section)}
                >
                  {section.charAt(0).toUpperCase() + section.slice(1)}
                </Button>
              </motion.div>
            ))}
          </div>
        </motion.nav>

        <div className="max-w-4xl mx-auto space-y-4 sm:space-y-6 pb-12 sm:pb-16">
          {activeSection === "summary" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              <Card className="bg-white border border-blue-200 rounded-lg shadow-sm">
                <CardContent className="pt-4 sm:pt-6 pb-6 sm:pb-8">
                  <div className="flex flex-col md:flex-row items-center gap-4 sm:gap-6">
                    <div className="flex-1 text-center md:text-left">
                      <h1 className="text-lg sm:text-xl md:text-2xl font-semibold text-gray-900">
                        Contract Analysis for {truncateText(analysisResults.companyName, 50)} {contractId ? `(${contractId})` : ""}
                      </h1>
                      <p className="text-xs sm:text-sm text-gray-600 mt-2">
                        Actionable insights and recommendations
                      </p>
                      {!isActive && (
                        <Button
                          className="mt-3 bg-blue-600 text-white hover:bg-blue-700 text-xs rounded-md px-3 py-1.5 sm:px-4 sm:py-2"
                          onClick={onUpgrade}
                        >
                          Unlock Premium
                        </Button>
                      )}
                    </div>
                    <div className="flex-1 flex justify-center">
                      <OverallScoreChart overallScore={getScore} />
                    </div>
                  </div>
                  <div className="mt-4 sm:mt-6 flex flex-col sm:flex-row items-center sm:justify-between gap-3 sm:gap-0">
                    <div className="flex items-center gap-2 sm:gap-3">
                      <span className="text-xl sm:text-2xl font-semibold text-gray-900">{getScore}</span>
                      <div className={`flex items-center ${scoreTrend.color} gap-2`}>
                        <scoreTrend.icon />
                        <span className="text-xs sm:text-sm font-medium">{scoreTrend.text}</span>
                      </div>
                    </div>
                    <span className="text-xs sm:text-sm text-gray-600">Confidence: {getScore}%</span>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {renderSectionContent()}
        </div>
      </div>
    </div>
  );
}