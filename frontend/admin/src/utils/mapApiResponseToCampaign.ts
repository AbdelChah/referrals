import { Campaign, EligibilityCriteria, Transaction, TransactionFlow } from "../Models/Campaign";

export const mapApiResponseToCampaign = (apiResponse: any): Campaign => {
    const eligibilityCriterias: EligibilityCriteria[] = [];
  
    // Check if reward_criteria.transaction exists and map Transaction eligibility
    if (apiResponse.reward_criteria?.transaction) {
      const transaction = apiResponse.reward_criteria.transaction;
  
      // Add Transaction eligibility
      if (transaction.transaction_type && transaction.minAmount) {
        eligibilityCriterias.push({
          name: "Transaction",
          transaction: {
            type: transaction.transaction_type,
            count: transaction.minAmount, // This seems to be the minimum number of transactions, assuming it's the correct field
            currency: transaction.currency || "USD", // Default to USD if no currency provided
          } as Transaction,
        });
      }
  
      // Add TransactionFlow eligibility if present
      if (transaction.debitOrCredit && transaction.minAmount) {
        eligibilityCriterias.push({
          name: "TransactionFlow",
          transactionFlow: {
            flow: transaction.debitOrCredit === "credit" ? "Credit" : "Debit", // Convert to correct flow type
            amount: transaction.minAmount,
          } as TransactionFlow,
        });
      }
    }
  
    // Return the full mapped Campaign object
    return {
      id: apiResponse._id,
      campaignName: apiResponse.name,
      startDate: new Date(apiResponse.start_date).toISOString(), // Format date to ISO string
      endDate: new Date(apiResponse.end_date).toISOString(),
      rewardType: apiResponse.reward_criteria?.transaction?.transaction_type || "Unknown", // Default to "Unknown"
      rewardAmount: apiResponse.reward_criteria?.transaction?.reward || 0,  // Default to 0 if missing
      rewardCurrency: apiResponse.reward_criteria?.transaction?.currency || "USD", // Default to "USD" if missing
      eligibilityCriteria: eligibilityCriterias, // Populate eligibility criteria,
      status: apiResponse.status,
    min_referees: apiResponse.min_referees
    };
  };