import api from "./axiosInstance";
import { Campaign } from "@models/Campaign";

import { mapApiResponseToCampaign } from "@utils/mapApiResponseToCampaign";
// import { mapEligibilityCriteriaToApi } from "../utils/mapEligibilityCriteriaToApi";

// Fetch all campaigns
export const fetchCampaigns = async (): Promise<Campaign[]> => {
  try {
    const response = await api.get("/api/campaigns");
    return response.data.response.map(mapApiResponseToCampaign); // Use .response from API response
  } catch (error) {
    console.error("Error fetching campaigns:", error);
    throw error;
  }
};

// Create a new campaign
export const createCampaign = async (campaignData: {
  name: string;
  start_date: string;
  end_date: string;
  reward_criteria: any;
  status: string;
}): Promise<any> => {
  try {
    await api.post("/api/campaigns", campaignData);
  } catch (err) {
    throw err;
  }
};
