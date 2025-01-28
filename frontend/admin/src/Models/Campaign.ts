export interface Campaign {
  id: string;
  campaignName: string;
  startDate: string;
  endDate: string;
  rewardType: string; // Add this field to the Campaign type
  rewardAmount: number;
  rewardCurrency: string;
  eligibilityCriteria: EligibilityCriteria[];
  status: string;
  min_referees: number;
}

export interface Transaction {
  transactionType: string[];
  minCount: number;
}

export interface EligibilityCriteria {
  name: "eKYC" | "Transaction" | "TransactionFlow" | "Onboarding";
  eligible?: boolean;
  transaction?: Transaction;
  transactionFlow?: TransactionFlow;
  onBoarding?: boolean;
  reward_amount: number;
  currency: string;
}

export interface TransactionFlow {
  debitOrCredit: "debit" | "credit";
  minAmount: number;
}


export interface CampaignsMeta {
  id: string;
  campaignName: string;
  startDate: string;
  endDate: string;
  rewardType: string;
  eligibilityCriteria: string;
  status: string;
  totalReferrals: number;
  totalReferees: number;
  totalCompleted: number;
}