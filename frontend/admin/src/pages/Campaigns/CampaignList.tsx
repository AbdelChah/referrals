import React, { useState, useEffect, useCallback } from "react";
import {
  StyledTable as Table,
  StyledTableRow as TableRow,
  TableHeaderCell as TableHeader,
  StyledTableCell as TableCell,
  StyledButton,
} from "../../styles/table.styles";
import { Link } from "react-router-dom";
import { Title } from "../../styles/title.styles";
import { Campaign } from "../../Models/Campaign";
import { fetchCampaigns } from "../../services/campaignService";
import CampaignModal from "./CampaignDetailsModal";
import { TablePagination } from "@mui/material";
import { formatDate } from "../../utils/dateUtils";

const CampaignList: React.FC = () => {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [loading, setLoading] = useState(true);
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(
    null
  );
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Function to load campaigns (refactored to allow re-fetching after changes)
  const loadCampaigns = useCallback(async () => {
    try {
      const fetchedCampaigns = await fetchCampaigns();
      setCampaigns(fetchedCampaigns);
    } catch (error) {
      console.error("Error loading campaigns:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadCampaigns();
  }, [loadCampaigns]);

  const handleRowClick = (campaign: Campaign) => {
    setSelectedCampaign(campaign);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedCampaign(null);
    loadCampaigns(); // Refetch campaigns when the modal is closed
  };

  const paginatedCampaigns = campaigns.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  const handlePageChange = (
    event: React.MouseEvent<HTMLButtonElement> | null,
    newPage: number
  ) => {
    setPage(newPage);
  };

  const handleRowsPerPageChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  if (loading) {
    return <div>Loading campaigns...</div>;
  }

  return (
    <>
      <Title>Campaigns List</Title>
      <div>
        <Table>
          <thead>
            <TableRow>
              <TableHeader>Campaign Name</TableHeader>
              <TableHeader>Start Date</TableHeader>
              <TableHeader>End Date</TableHeader>
              <TableHeader>Reward Type</TableHeader>
              <TableHeader>Eligibility Criteria</TableHeader>
            </TableRow>
          </thead>
          <tbody>
            {paginatedCampaigns.map((campaign) => (
              <TableRow
                key={campaign.id}
                onClick={() => handleRowClick(campaign)}
                style={{ cursor: "pointer" }}
              >
                <TableCell>{campaign.campaignName}</TableCell>
                <TableCell>{formatDate(campaign.startDate)}</TableCell>
                <TableCell>{formatDate(campaign.endDate)}</TableCell>
                <TableCell>{campaign.rewardType}</TableCell>
                <TableCell>
                  <ul>
                    {campaign.eligibilityCriteria.map((criterion, index) => (
                      <li key={index}>
                        {criterion.name === "eKYC" &&
                          `eKYC: ${criterion.eligible}`}
                        {criterion.name === "Transaction" && criterion.transaction?.type &&
                          `Transaction: ${criterion.transaction.type} with count ${criterion.transaction.count}`}
                        {criterion.name === "TransactionFlow" && criterion.transactionFlow?.flow &&
                          `TransactionFlow: ${criterion.transactionFlow.flow} of ${criterion.transactionFlow.amount}`}
                      </li>
                    ))}
                  </ul>
                </TableCell>
              </TableRow>
            ))}
          </tbody>
        </Table>

        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={campaigns.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handlePageChange}
          onRowsPerPageChange={handleRowsPerPageChange}
        />
      </div>
      <Link to="/create-campaign">
        <StyledButton>Create New Campaign</StyledButton>
      </Link>
      {selectedCampaign && (
        <CampaignModal
          open={isModalOpen}
          campaign={selectedCampaign}
          onClose={handleCloseModal}
        />
      )}
    </>
  );
};

export default CampaignList;
