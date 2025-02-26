import api from "./axiosInstance";
import { Campaign, CampaignsMeta } from "../Models/Campaign";

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
export const createCampaign = async (campaignData: any): Promise<any> => {
  try {
    const response = await api.post("/api/campaigns", campaignData);
    return response.data;
  } catch (err) {
    throw err;
  }
};

export const deleteCampaign = async (campaignId: string): Promise<void> => {
  try {
    await api.delete(`/api/campaigns/${campaignId}`);
  } catch (error) {
    console.error(`Error deleting campaign with ID ${campaignId}:`, error);
    throw error;
  }
};

export const getCampaignsMeta = async (): Promise<CampaignsMeta[]> => {
  try {
    const response = await api.get("/api/campaigns/meta");
    return response.data.response;
  } catch (error) {
    console.error("Error fetching campaigns meta:", error);
    throw error;
  }
};
