// // src/interfaces/contract.interface.ts
// interface IRisk {
//   risk: string;
//   explanation: string;
//   severity: "low" | "medium" | "high";
// }

// interface IOpportunity {
//   opportunity: string;
//   explanation: string;
//   impact: "low" | "medium" | "high";
// }

// interface ICompensationStructure {
//   baseSalary: string;
//   bonuses: string;
//   equity: string;
//   otherBenefits: string;
// }

// export interface IContractAnalysis {
//   userId: string; // Changed from ObjectId to string
//   contractText: string;
//   risks: IRisk[];
//   opportunities: IOpportunity[];
//   summary: string;
//   recommendations: string[];
//   keyClauses: string[];
//   legalCompliance: string[];
//   negotiationPoints: string[];
//   contractDuration: string;
//   terminationConditions: string;
//   overallScore: number;
//   compensationStructure: ICompensationStructure;
//   performanceMetrics: string[];
//   intellectualPropertyClauses: string | string[];
//   createdAt: Date;
//   version: number;
//   userFeedback: {
//     rating: number;
//     comments: string;
//   };
//   customFields: { [key: string]: string };
//   expirationDate: Date;
//   language: string;
//   aiModel: string;
//   contractType: string;
//   financialTerms?: {
//     description: string;
//     details: string[];
//   };
// }

// src/interfaces/contract.interface.ts

// Interface for risks identified in the contract
interface IRisk {
  risk: string;
  explanation: string;
  severity: "low" | "medium" | "high";
  id?: string; // Optional ID for unique identification
}

// Interface for opportunities identified in the contract
interface IOpportunity {
  opportunity: string;
  explanation: string;
  impact: "low" | "medium" | "high";
  id?: string; // Optional ID for unique identification
}

// Interface for compensation structure details
interface ICompensationStructure {
  baseSalary: string;
  bonuses: string;
  equity: string;
  otherBenefits: string;
}

// Interface for financial terms (optional)
interface IFinancialTerms {
  description: string;
  details: string[];
}

// Interface for user feedback on the contract analysis
interface IUserFeedback {
  rating: number;
  comments: string;
}

// Main interface for contract analysis results
export interface IContractAnalysis {
  // Core fields required for analysis display
  overallScore: number; // Overall score of the contract (0-100), required
  summary: string; // Summary of the contract analysis
  risks: IRisk[]; // List of identified risks
  opportunities: IOpportunity[]; // List of identified opportunities

  // Fields for the "Details" tab and accordion (optional as they may not always be present)
  keyClauses?: string[]; // Key clauses identified in the contract
  recommendations?: string[]; // Recommendations for improving the contract
  legalCompliance?: string[]; // Legal compliance details
  contractDuration?: string; // Duration of the contract
  terminationConditions?: string; // Conditions for terminating the contract

  // Additional fields used in the analysis
  negotiationPoints?: string[]; // Points to negotiate in the contract
  compensationStructure?: ICompensationStructure; // Compensation details
  performanceMetrics?: string[]; // Performance metrics defined in the contract
  intellectualPropertyClauses?: string[]; // Intellectual property clauses
  financialTerms?: IFinancialTerms; // Financial terms of the contract
  userFeedback?: IUserFeedback; // User feedback on the analysis

  // Metadata fields (optional, may be used elsewhere in the app)
  userId?: string; // ID of the user who owns this analysis
  contractText?: string; // Raw text of the contract
  createdAt?: Date; // Date when the analysis was created
  version?: number; // Version of the analysis
  expirationDate?: Date; // Expiration date of the contract or analysis
  language?: string; // Language of the contract
  aiModel?: string; // AI model used for analysis
  contractType?: string; // Type of contract (e.g., "employment", "vendor")
  customFields?: { [key: string]: string }; // Custom fields for additional data
}
