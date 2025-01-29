import React, { useState, useEffect } from "react";
import {
  StyledTable as Table,
  StyledTableRow as TableRow,
  TableHeaderCell as TableHeader,
  StyledTableCell as TableCell,
  StyledButton,
} from "../../styles/table.styles"; // Reusing styled components
import { Title } from "../../styles/title.styles";
import { Typography } from "@mui/material";
import { getCampaignsMeta } from "../../services/campaignService";
import { CampaignsMeta } from "../../Models/Campaign";
import { exportToCSV } from "../../utils/exportDashboardtoCSV";
const Dashboard: React.FC = () => {
  const [campaigns, setCampaigns] = useState<CampaignsMeta[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getCampaignsMeta()
      .then((data) => {
        const mappedData = data.map((campaign: any) => ({
          id: campaign.campaign_id,
          campaignName: campaign.name,
          startDate: campaign.start_date,
          endDate: campaign.end_date,
          rewardType: campaign.reward_type,
          eligibilityCriteria: campaign.eligibility_criteria
            ? campaign.eligibility_criteria
                .split("|")
                .map((criterion: string) => criterion.trim())
            : [], // Ensure it defaults to an empty array if undefined
          status: campaign.status,
          totalReferrals: campaign.total_referrals,
          totalReferees: campaign.total_referees,
          totalCompleted: campaign.total_completed,
        }));
        setCampaigns(mappedData);
      })
      .catch((error) => console.error("Error fetching campaigns:", error))
      .finally(() => setLoading(false));
  }, []);

  const handleExportCSV = () => {
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

    const rows = campaigns.map((campaign) => [
      campaign.campaignName,
      campaign.status,
      new Date(campaign.startDate).toLocaleDateString(),
      new Date(campaign.endDate).toLocaleDateString(),
      campaign.rewardType,
      Array.isArray(campaign.eligibilityCriteria)
        ? `"${campaign.eligibilityCriteria.join("\n")}"`
        : `"${campaign.eligibilityCriteria}"`,
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
    link.download = "campaign_report.csv";
    link.click();
  };

  return (
    <>
      <Title>Dashboard</Title>
      {loading ? (
        <Typography>Loading campaigns...</Typography>
      ) : campaigns.length === 0 ? (
        <Typography>No campaigns available.</Typography>
      ) : (
        <>
          <Table>
            <thead>
              <TableRow cursor="default">
                <TableHeader>Campaign Name</TableHeader>
                <TableHeader>Status</TableHeader>
                <TableHeader>Start Date</TableHeader>
                <TableHeader>End Date</TableHeader>
                <TableHeader>Reward Type</TableHeader>
                <TableHeader>Eligibility Criteria</TableHeader>
                <TableHeader>Total Referrals</TableHeader>
                <TableHeader>Total Referees</TableHeader>
                <TableHeader>Total Completed</TableHeader>
              </TableRow>
            </thead>
            <tbody>
              {campaigns.map((campaign) => (
                <TableRow cursor="default" key={campaign.id}>
                  <TableCell>{campaign.campaignName}</TableCell>
                  <TableCell>{campaign.status}</TableCell>
                  <TableCell>
                    {new Date(campaign.startDate).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    {new Date(campaign.endDate).toLocaleDateString()}
                  </TableCell>
                  <TableCell>{campaign.rewardType}</TableCell>
                  <TableCell>
                    <ul>
                      {Array.isArray(campaign.eligibilityCriteria) &&
                      campaign.eligibilityCriteria.length > 0 ? (
                        campaign.eligibilityCriteria.map(
                          (criterion: string, index: number) => (
                            <li key={index}>{criterion}</li>
                          )
                        )
                      ) : (
                        <li>No eligibility criteria available</li>
                      )}
                    </ul>
                  </TableCell>

                  <TableCell>{campaign.totalReferrals}</TableCell>
                  <TableCell>{campaign.totalReferees}</TableCell>
                  <TableCell>{campaign.totalCompleted}</TableCell>
                </TableRow>
              ))}
            </tbody>
          </Table>
          <StyledButton
            style={{ marginTop: "16px" }}
            onClick={() => exportToCSV(campaigns)}
          >
            Export All to CSV
          </StyledButton>
        </>
      )}
    </>
  );
};

export default Dashboard;
