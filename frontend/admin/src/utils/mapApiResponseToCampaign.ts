import { Campaign, EligibilityCriteria, Transaction, TransactionFlow } from "../Models/Campaign";

export const mapApiResponseToCampaign = (apiResponse: any): Campaign => {
  const eligibilityCriterias: EligibilityCriteria[] = [];

  // Check if reward_criteria exists and contains transaction details
  if (apiResponse.reward_criteria) {
    const rewardCriteria = apiResponse.reward_criteria;

    // Check if transaction_type exists
    if (rewardCriteria.transaction && rewardCriteria.transaction.transaction_type && rewardCriteria.transaction.transaction_type.length > 0) {
      const transaction = rewardCriteria.transaction;

      eligibilityCriterias.push({
        name: "Transaction",
        transaction: {
          transactionType: transaction.transaction_type, // Use transaction_type from response
          minCount: transaction.min_count || 0, // Default to 0 if min_count is missing
        } as Transaction,
        reward_amount: rewardCriteria.reward_amount,
        currency: rewardCriteria.currency || "USD", // Default to USD if currency is missing
      });
    }

    // Check if transaction_flow exists
    if (rewardCriteria.transaction_flow) {
      const transactionFlow = rewardCriteria.transaction_flow;

      eligibilityCriterias.push({
        name: "TransactionFlow",
        transactionFlow: {
          debitOrCredit: transactionFlow.debitOrCredit || "credit", // Default to "credit" if missing
          minAmount: transactionFlow.min_amount || 0, // Default to 0 if min_amount is missing
        } as TransactionFlow,
        reward_amount: rewardCriteria.reward_amount,
        currency: rewardCriteria.currency || "USD",
      });
    }

    // Check for Onboarding eligibility
    if (rewardCriteria.onBoarding !== undefined) {
      eligibilityCriterias.push({
        name: "Onboarding",
        onBoarding: rewardCriteria.onBoarding,
        reward_amount: rewardCriteria.reward_amount,
        currency: rewardCriteria.currency || "USD",
      });
    }
  }

  // Return the full mapped Campaign object
  return {
    id: apiResponse._id,
    campaignName: apiResponse.name,
    startDate: new Date(apiResponse.start_date).toISOString(),
    endDate: new Date(apiResponse.end_date).toISOString(),
    rewardType: apiResponse.reward_criteria?.reward_type || "Cashback",
    rewardAmount: apiResponse.reward_criteria?.reward_amount || 0, // Default to 0 if reward_amount is missing
    rewardCurrency: apiResponse.reward_criteria?.currency || "USD", // Default to "USD" if currency is missing
    eligibilityCriteria: eligibilityCriterias,
    status: apiResponse.status,
    min_referees: apiResponse.min_referees || 0, // Default to 0 if min_referees is missing
  };
};

