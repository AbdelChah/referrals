import api from "./axiosInstance";
import { ReferralsResponse } from "../Models/Referral";

// Define the exact structure of the API response
interface ReferralsApiResponse {
  referrals: ReferralsResponse[]; // Adjust this type if needed
}

// Fetch all referrals
export const fetchReferrals = async (): Promise<ReferralsResponse[]> => {
  try {
    const response = await api.get<ReferralsApiResponse>("/api/referrals/getReferrals");
    return response.data.referrals; // Return only the `referrals` array
  } catch (error) {
    console.error("Error fetching referrals:", error);
    throw error;
  }
};