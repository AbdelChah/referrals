import { EligibilityCriteria } from "../Models/Campaign";

export const mapEligibilityCriteriaToApi = (
  criteriaList: EligibilityCriteria[],
  rewardAmount: number,
  rewardCurrency: string,
  rewardType: string
) => {
  const rewardCriteria: any = {
    onBoarding: false,
    reward_amount: rewardAmount,
    currency: rewardCurrency,
  };

  // Loop through the eligibility criteria and map them correctly
  criteriaList.forEach((criteria) => {
    // Scenario 1, 4, 5: eKYC-based reward (Onboarding)
    if (criteria.name === "eKYC" && criteria.eligible === true) {
      rewardCriteria.onBoarding = true;
      rewardCriteria.reward_amount = rewardAmount;
      rewardCriteria.currency = rewardCurrency;
    }
    // Scenario 3, 5: Transaction Type (count-based reward)
    if (criteria.name === "Transaction" && criteria.transaction) {
      rewardCriteria.transaction = {
        ...rewardCriteria.transaction,
        // reward_type: rewardType,
        transaction_type: criteria.transaction.transactionType || ["P2P"],
        min_count: criteria.transaction.minCount || 1,
      };
    }
    // Scenario 2, 4: Transaction Flow (amount and flow-based reward)
    if (criteria.name === "TransactionFlow" && criteria.transactionFlow) {
      // Ensure the existing 'transaction' object is properly merged, not overwritten
      rewardCriteria.transaction_flow = {
        ...rewardCriteria.transaction, // Keep existing transaction properties
        min_amount: criteria.transactionFlow.minAmount || 10, // Default to 10 if minAmount is missing
        debitOrCredit: criteria.transactionFlow.debitOrCredit || "debit",
      };
    }
  });

  // Check if the 'onBoarding' object is either undefined or false
  if (
    rewardCriteria.onBoarding === undefined ||
    rewardCriteria.onBoarding === false
  ) {
    delete rewardCriteria.onBoarding;
  }

  // Check if the 'transaction' object is either undefined or empty
  if (
    !rewardCriteria.transaction ||
    Object.keys(rewardCriteria.transaction).length === 0
  ) {
    delete rewardCriteria.transaction;
  }
  return rewardCriteria;
};
