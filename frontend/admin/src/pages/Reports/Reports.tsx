import React, { useState, useEffect } from "react";
import { Paper } from "@mui/material";
import {
  StyledTable as Table,
  StyledTableRow as TableRow,
  TableHeaderCell as TableHead,
  StyledTableCell as TableCell,
  StyledButton,
} from "../../styles/table.styles";
import ReportsDetailsModal from "./ReportsDetailsModal"; // Assuming the modal is in this path
import { fetchReferralsReport } from "../../services/referralsService";
import { ReferralReport, Campaign } from "../../Models/Reports";
import { exportToCSV } from "../../utils/exportReportsToCSV";
import { Download } from "lucide-react";
import { Title } from "../../styles/title.styles";

const Reports = () => {
  const [referralReport, setReferralReport] = useState<ReferralReport | null>(
    null
  );
  const [openModal, setOpenModal] = useState(false);
  const [selectedCampaign, setSelectedCampaign] = useState<any>(null);

  useEffect(() => {
    fetchReferralsReport()
      .then((data) => setReferralReport(data))
      .catch((error) =>
        console.error("Error fetching referral report:", error)
      );
  }, []);

  const handleRowClick = (campaign: Campaign) => {
    setSelectedCampaign(campaign);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedCampaign(null);
  };

  return (
    <>
      <Title>Referral Report</Title>
      <Table>
        <thead>
          <TableRow cursor="default">
            <TableHead>Campaign Name</TableHead>
            <TableHead>Total Referrers</TableHead>
            <TableHead>Total Referees</TableHead>
            <TableHead>Total Reward Claimed</TableHead>
            <TableHead>Total Qualified Referees</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </thead>
        {referralReport?.response?.campaigns.map((campaign) => (
          <TableRow
            key={campaign.campaign_id}
            onClick={() => handleRowClick(campaign)}
          >
            <TableCell>{campaign.name}</TableCell>
            <TableCell>{campaign.referrers.length}</TableCell>
            <TableCell>
              {campaign.referrers.reduce(
                (acc, referrer) => acc + referrer.referees.length,
                0
              )}
            </TableCell>
            <TableCell>{campaign.reward_criteria.reward_amount}</TableCell>
            <TableCell>
              {campaign.referrers.reduce(
                (acc, referrer) =>
                  acc + referrer.referees.filter((r) => r.status).length,
                0
              )}
            </TableCell>
            <TableCell>
              <StyledButton
                onClick={(e) => {
                  e.stopPropagation();
                  exportToCSV([campaign]);
                }}
              >
                <Download />
              </StyledButton>
            </TableCell>
          </TableRow>
        ))}
      </Table>
      <StyledButton
        style={{ marginTop: "16px" }}
        onClick={() => exportToCSV(referralReport)}
      >
        Export All to CSV
      </StyledButton>
      <ReportsDetailsModal
        open={openModal}
        onClose={handleCloseModal}
        campaign={selectedCampaign}
      />
    </>
  );
};

export default Reports;
