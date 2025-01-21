
export interface Referee {
    referralId: string;
    referee_phone: string;
    date: string;
    status: boolean;
  }
export interface Campaign {
campaignId: string;
campaignName: string;
referees: Referee[];
}

export interface Referrer {
referrer_phone: string;
campaigns: Campaign[];
}

export interface ReferralsResponse {
    referrer_phone: string;
    campaigns: {
      campaignId: string;
      campaignName: string;
      referees: {
        referee_phone: string;
        referralId: string;
      }[];
    }[];
  }