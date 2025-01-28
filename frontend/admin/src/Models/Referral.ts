export interface Referee {
  referralId: string;
  referee_phone: string;
  date: string;
  qualified: boolean;
}

export interface Campaign {
  campaignId: string;
  campaignName: string;
  totalQualifiedReferees: number;
  min_referees: number;
  campaignComplete: boolean;
  status: string;
  referees: Referee[];
}

export interface Referrer {
  referrer_phone: string;
campaigns: Campaign[];
}

export interface ReferralsResponse {
    referrer_phone: string;
    campaigns: Campaign[];
  }

  
