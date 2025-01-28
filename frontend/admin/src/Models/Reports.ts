export interface ReferralReport {
    res: boolean;
    response: {
      totalCampaigns: number;
      totalReferrers: number;
      totalReferees: number;
      totalRewardClaimed: number;
      totalQualifiedReferees: number;
      campaigns: Campaign[];
    };
  }
  
  export interface Campaign {
    campaign_id: string;
    name: string;
    start_date: string;
    end_date: string;
    min_referees: number;
    reward_criteria: RewardCriteria;
    referrers: Referrer[];
  }
  
  export interface RewardCriteria {
    reward_amount: number;
    currency: string;
    onBoarding: boolean;
    transaction_flow: TransactionFlow;
    transaction: {
      transaction_type: string[];
    };
  }
  
  export interface TransactionFlow {
    debitOrCredit: string;
    min_amount: number;
  }
  
  export interface Referrer {
    referrer_phone: string;
    isClaimed: boolean;
    referees: Referee[];
  }
  
  export interface Referee {
    referee_phone: string;
    status: boolean;
    start_date: string;
    completion_date: string | null;
  }
  