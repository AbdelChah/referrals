import { EligibilityCriteria } from "../Models/Campaign";


export const mapEligibilityCriteriaToApi = (criteriaList: EligibilityCriteria[]) => {
  const rewardCriteria: any = {
    onBoarding: {},
    transaction: {}
  };
console.log({criteriaList});
  // Loop through the eligibility criteria and map them correctly
  criteriaList.forEach((criteria) => {
    console.log({criteria});
    if (criteria.name === "eKYC" && criteria.eligible !== undefined) {
        console.log({criteria})
      rewardCriteria.onBoarding = { reward: 0}; // to be 0 for now.
    }

    if (criteria.name === "Transaction" && criteria.transaction) {
      rewardCriteria.transaction = {
        minAmount: criteria.transaction.count || 10, // Default to 10 if not specified
        reward: 10, // Example reward
        currency: "USD", // Default currency
        transaction_type: "CASH_IN", // Default transaction type
        debitOrCredit: "credit", // Default flow type
      };
    }

    if (criteria.name === "TransactionFlow" && criteria.transactionFlow) {
      rewardCriteria.transaction = {
        ...rewardCriteria.transaction,
        minAmount: criteria.transactionFlow.amount || 10, // Default amount if not provided
        reward: 10, // Example reward
        currency: "USD", // Default currency
        transaction_type: "CASH_IN", // Example type
        debitOrCredit: criteria.transactionFlow.flow === "Credit" ? "credit" : "debit",
      };
    }
  });

  return rewardCriteria;
};
