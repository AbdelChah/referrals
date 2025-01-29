import { Campaign, ReferralReport } from "../Models/Reports";

export const exportToCSV = (data: Campaign[] | ReferralReport | null) => {
  if (!data) {
    console.error("No data available to export.");
    return;
  }

  const generateDate = (dateString: string) =>
    new Date(dateString).toISOString().slice(0, 19).replace("T", " ");

  const escapeCSV = (str: string) => `"${str.replace(/"/g, '""')}"`;

  let headers: string[];
  let rows: string[][];

  if (Array.isArray(data)) {
    // Individual Campaigns (row for each referrer-referee combination)
    headers = [
      "Campaign Name",
      "Start Date",
      "End Date",
      "Minimum Referees",
      "Reward Amount",
      "Currency",
      "Referrer Phone",
      "Referee Phone",
      "Referral Status",
      "Start Date",
      "Completion Date",
      "Total Referrers",
      "Total Referees",
      "Total Reward Claimed",
      "Total Qualified Referees",
    ];

    rows = data.flatMap(
      (campaign) =>
        campaign.referrers?.flatMap(
          (referrer) =>
            referrer.referees.map((referee) => [
              escapeCSV(campaign.name),
              escapeCSV(generateDate(campaign.start_date)),
              escapeCSV(generateDate(campaign.end_date)),
              escapeCSV(campaign.min_referees.toString()),
              escapeCSV(String(campaign.reward_criteria.reward_amount)),
              escapeCSV(campaign.reward_criteria.currency),
              escapeCSV(referrer.referrer_phone),
              escapeCSV(referee.referee_phone),
              escapeCSV(referee.status ? "Completed" : "Not Completed"),
              escapeCSV(generateDate(referee.start_date)),
              escapeCSV(
                referee.completion_date
                  ? generateDate(referee.completion_date)
                  : "N/A"
              ),
              escapeCSV(campaign.referrers.length.toString()),
              escapeCSV(
                campaign.referrers
                  .flatMap((referrer) => referrer.referees)
                  .length.toString()
              ),
              escapeCSV(
                campaign.referrers
                  .flatMap((referrer) => referrer.referees)
                  .filter((referee) => referee.status) // Only count completed referrals
                  .length.toString()
              ),
              escapeCSV(
                campaign.referrers
                  .flatMap((referrer) => referrer.referees)
                  .filter((referee) => referee.status) // Only count qualified (completed) referees
                  .length.toString()
              ),
            ]) || []
        ) || []
    );
  } else {
    // Full Referral Report (This will add totals for the entire report)
    headers = [
      "Campaign Name",
      "Start Date",
      "End Date",
      "Minimum Referees",
      "Reward Amount",
      "Currency",
      "Referrer Phone",
      "Referee Phone",
      "Referral Status",
      "Start Date",
      "Completion Date",
      "Total Referrers",
      "Total Referees",
      "Total Reward Claimed",
      "Total Qualified Referees",
    ];

    rows = (data.response?.campaigns || []).flatMap(
      (campaign) =>
        campaign.referrers?.flatMap(
          (referrer) =>
            referrer.referees?.map((referee) => [
              escapeCSV(campaign.name),
              escapeCSV(generateDate(campaign.start_date)),
              escapeCSV(generateDate(campaign.end_date)),
              escapeCSV(campaign.min_referees.toString()),
              escapeCSV(String(campaign.reward_criteria.reward_amount)),
              escapeCSV(campaign.reward_criteria.currency),
              escapeCSV(referrer.referrer_phone),
              escapeCSV(referee.referee_phone),
              escapeCSV(referee.status ? "Completed" : "Not Completed"),
              escapeCSV(generateDate(referee.start_date)),
              escapeCSV(
                referee.completion_date
                  ? generateDate(referee.completion_date)
                  : "N/A"
              ),
              escapeCSV(data.response.totalReferrers.toString()),
              escapeCSV(data.response.totalReferees.toString()),
              escapeCSV(data.response.totalRewardClaimed.toString()),
              escapeCSV(data.response.totalQualifiedReferees.toString()),
            ]) || []
        ) || []
    );
  }

  const csvContent = [
    headers.join(","),
    ...rows.map((row) => row.join(",")),
  ].join("\n");

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = `referral_report_${new Date()
    .toISOString()
    .slice(0, 10)}.csv`;
  link.click();
};
