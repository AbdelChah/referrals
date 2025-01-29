const padColumn = (text: string, length = 20) => {
  return text.padEnd(length, " "); // Adds trailing spaces
};

export const exportToCSV = (data: any[], filename = "campaign_report.csv") => {
  if (!data || data.length === 0) {
    console.warn("No data available for export.");
    return;
  }

  const headers = [
    "Campaign Name",
    "Status",
    "Start Date",
    "End Date",
    "Reward Type",
    "Eligibility Criteria",
    "Total Referrals",
    "Total Referees",
    "Total Completed",
  ];

  const rows = data.map((campaign) => [
    campaign.campaignName,
    campaign.status,
    new Date(campaign.startDate).toLocaleDateString(),
    new Date(campaign.endDate).toLocaleDateString(),
    campaign.rewardType,
    `"${padColumn(
      (typeof campaign.eligibilityCriteria === "string"
        ? campaign.eligibilityCriteria
            .split("|")
            .map((criterion: string) => criterion.trim())
        : Array.isArray(campaign.eligibilityCriteria)
        ? campaign.eligibilityCriteria
        : []
      ).join("\n"),
      100 // Adjust column width (try increasing this)
    ).replace(/"/g, '""')}"`,
    campaign.totalReferrals,
    campaign.totalReferees,
    campaign.totalCompleted,
  ]);

  const csvContent = [
    headers.join(","),
    ...rows.map((row) => row.join(",")),
  ].join("\n");

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
