import api from "./axiosInstance";
import { Campaign } from "../Models/Campaign";

import { mapApiResponseToCampaign } from "../utils/mapApiResponseToCampaign";

// Fetch all campaigns
export const fetchCampaigns = async (): Promise<Campaign[]> => {
  try {
    const response = await api.get("/api/campaigns");
    return response.data.response.map(mapApiResponseToCampaign);
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
    const response = await api.post("/api/campaigns", campaignData);
    return response.data;
  } catch (err) {
    throw err;
  }
};