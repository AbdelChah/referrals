import axios from "axios";

// Define the expected response structure
interface MultiValuesApiResponse {
  res: boolean;
  response: {
    currency: {values: {id: string; en: string; ar: string}[] };
    language: {values: {id: string; en: string; ar: string}[] };
    application: {values: {id: string; en: string; ar: string}[] };
    action: {values: {id: string; en: string; ar: string}[] };
    debitOrCredit: {values: {id: string; en: string; ar: string}[] };
    transaction:  {values: {id: string; en: string; ar: string}[] };
  };
}

// Define the request body structure
interface MultiValuesRequestBody {
  application: string;
}

// Create a function to fetch multi-values
export const fetchMultiValues = async (application: string) => {
  const requestBody: MultiValuesRequestBody = { application };

  try {
    // Sending the POST request to the multi-value API
    const response = await axios.post<MultiValuesApiResponse>(
      "https://api-02.bank-juno.com/Click2Pay/api/juno/callbacks/referrals/multivalues",
      requestBody
    );

    // Extracting the values from the response
    const values = response.data.response;

    // Returning the response structure with relevant values
    return {
      currency: values.currency,
      language: values.language,
      application: values.application,
      action: values.action,
      debitOrCredit: values.debitOrCredit,
      transaction: values.transaction,
    };
  } catch (error) {
    console.error("Error fetching multi-values:", error);
    throw error;
  }
};
