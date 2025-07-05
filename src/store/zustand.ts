// store/zustand.ts
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export interface IContractAnalysis {
  _id?: string;
  userId: string;
  contractType: string;
  contractText: string;
  risks: Array<{ risk: string; explanation: string; severity: string }>;
  opportunities: Array<{
    opportunity: string;
    explanation: string;
    impact: string;
  }>;
  summary: string;
  recommendations: string[];
  keyClauses: string[];
  legalCompliance: string[];
  negotiationPoints: string[];
  contractDuration: string;
  terminationConditions: string;
  overallScore: number;
  compensationStructure: {
    baseSalary: string;
    bonuses: string;
    equity: string;
    otherBenefits: string;
  };
  performanceMetrics: string[];
  intellectualPropertyClauses: string | string[];
  createdAt: string;
  version: number;
  userFeedback: { rating: number; comments: string };
  customFields: { [key: string]: string };
  language: string;
  aiModel: string;
}

interface ContractStore {
  analysisResults: IContractAnalysis | null;
  setAnalysisResults: (results: IContractAnalysis) => void;
  clearAnalysisResults: () => void;
}

export const useContractStore = create<ContractStore>()(
  persist(
    (set) => ({
      analysisResults: null,
      setAnalysisResults: (results) => {
        console.log(
          "Setting analysisResults:",
          JSON.stringify(results, null, 2)
        );
        set({ analysisResults: results });
      },
      clearAnalysisResults: () => {
        console.log("Clearing analysisResults");
        set({ analysisResults: null });
      },
    }),
    {
      name: "contract-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
type ModalState = {
  modals: Record<string, boolean>;
  openModal: (key: string) => void;
  closeModal: (key: string) => void;
  isOpen: (key: string) => boolean;
};

export const useModalStore = create<ModalState>((set, get) => ({
  modals: {},
  openModal: (key: string) =>
    set((state) => ({ modals: { ...state.modals, [key]: true } })),
  closeModal: (key: string) =>
    set((state) => ({ modals: { ...state.modals, [key]: false } })),
  isOpen: (key: string) => Boolean(get().modals[key]),
}));
