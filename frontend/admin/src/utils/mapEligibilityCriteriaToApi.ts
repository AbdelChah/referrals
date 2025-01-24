import { EligibilityCriteria } from "../Models/Campaign";

export const mapEligibilityCriteriaToApi = (
  criteriaList: EligibilityCriteria[],
  rewardAmount: number,
  rewardCurrency: string
) => {
  const rewardCriteria: any = {
    onBoarding: {},
    transaction: {},
  };
  // Loop through the eligibility criteria and map them correctly
  criteriaList.forEach((criteria) => {
    if (criteria.name === "eKYC" && criteria.eligible == true) {
      rewardCriteria.onBoarding = { reward: rewardAmount }; // to be 0 for now.
    }

    if (criteria.name === "Transaction" && criteria.transaction) {
      rewardCriteria.transaction = {
        reward: rewardAmount, // Example reward
        currency: "USD", // Default currency
        transaction_type: criteria.transaction?.type || "CASH_IN",
        count: criteria.transaction?.count // Default transaction type
      };
    }

    if (criteria.name === "TransactionFlow" && criteria.transactionFlow) {
      rewardCriteria.transaction = {
        ...rewardCriteria.transaction,
        minAmount: criteria.transactionFlow.amount || 10, // Default amount if not provided
        reward: rewardAmount,
        currency: rewardCurrency || "USD",
        debitOrCredit:
          criteria.transactionFlow.flow === "Credit" ? "credit" : "debit",
      };
    }
  });

// Check if the 'onBoarding' object is either undefined or empty
if (rewardCriteria.onBoarding === undefined || Object.keys(rewardCriteria.onBoarding).length === 0) {
  delete rewardCriteria.onBoarding;
}

// Check if the 'transaction' object is either undefined or empty
if (rewardCriteria.transaction === undefined || Object.keys(rewardCriteria.transaction).length === 0) {
  delete rewardCriteria.transaction;
}

  return rewardCriteria;
};
