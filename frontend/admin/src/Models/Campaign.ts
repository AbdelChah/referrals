// New Campaign model
export interface Campaign {
  id: string;
  campaignName: string;
  startDate: string;
  endDate: string;
  rewardType: string; // Example: "Cash", "Discount", etc.
  rewardAmount: number; // Reward amount
  rewardCurrency: string; // Reward currency (e.g., USD)
  eligibilityCriteria: EligibilityCriteria[]; // Array of eligibility criteria
  status?: string;
  min_referees?: number;
}

export interface EligibilityCriteria {
  name: "eKYC" | "Transaction" | "TransactionFlow"; // Type of eligibility
  eligible?: boolean; // For eKYC eligibility
  transaction?: Transaction; // For Transaction eligibility
  transactionFlow?: TransactionFlow; // For TransactionFlow eligibility
}

export interface Transaction {
  type: "P2P" | "QR Code" | "Cards" | "POS"; // Transaction type
  count: number; // Minimum number of transactions
  minAmount?: number; // Optional minimum amount for transaction
  currency?: string; // Optional currency for the transaction
}

export interface TransactionFlow {
  flow: "Debit" | "Credit"; // Flow type (e.g., Debit or Credit)
  amount: number; // Minimum amount required
}
