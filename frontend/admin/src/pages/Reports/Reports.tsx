import React, { useState, useEffect } from "react";
import { ListItemIcon, ListItemText } from "@mui/material";
import {
  StyledTable as Table,
  StyledTableRow as TableRow,
  TableHeaderCell as TableHead,
  StyledTableCell as TableCell,
  Container,
  StyledFab,
} from "../../styles/table.styles";
import ReportsDetailsModal from "./ReportsDetailsModal";
import { fetchReferralsReport } from "../../services/referralsService";
import { ReferralReport, Campaign } from "../../Models/Reports";
import { exportToCSV } from "../../utils/exportReportsToCSV";
import { Menu, MenuItem, IconButton } from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import DownloadIcon from "@mui/icons-material/Download";
import VisibilityIcon from "@mui/icons-material/Visibility";
import LoadingView from "../../components/LoadingView";
import { Tooltip } from "@mui/material";

const Reports = () => {
  const [referralReport, setReferralReport] = useState<ReferralReport | null>(
    null
  );
  const [openModal, setOpenModal] = useState(false);
  const [loading, setLoading] = useState(true); // Loading state
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedCampaign, setSelectedCampaign] = useState<any>(null);

  const handleMenuOpen = (
    event: React.MouseEvent<HTMLButtonElement>,
    campaign: Campaign
  ) => {
    event.stopPropagation(); // Prevent row click event
    setAnchorEl(event.currentTarget);
    setSelectedCampaign(campaign);
  };

  const handleMenuClose = (event: React.MouseEvent) => {
    event.stopPropagation();
    setAnchorEl(null);
  };

  useEffect(() => {
    setLoading(true); // Set loading to true before fetching data
    fetchReferralsReport()
      .then((data) => {
        setReferralReport(data);
        setLoading(false); // Set loading to false once data is fetched
      })
      .catch((error) => {
        console.error("Error fetching referral report:", error);
        setLoading(false); // Set loading to false in case of error as well
      });
  }, []);

  const handleRowClick = (campaign: Campaign) => {
    setSelectedCampaign(campaign);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedCampaign(null);
  };

  if (loading) {
    return <LoadingView />;
  }

  return (
    <Container>
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
        <tbody>
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
                <IconButton onClick={(e) => handleMenuOpen(e, campaign)}>
                  <MoreVertIcon />
                </IconButton>

                <Menu
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl)}
                  onClose={handleMenuClose}
                >
                  <MenuItem
                    onClick={(e) => {
                      handleMenuClose(e);
                      handleRowClick(campaign);
                    }}
                  >
                    <ListItemIcon>
                      <VisibilityIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText primary="View Details" />
                  </MenuItem>
                  <MenuItem
                    onClick={(e) => {
                      e.stopPropagation();
                      exportToCSV([selectedCampaign]);
                      handleMenuClose(e);
                    }}
                  >
                    <DownloadIcon style={{ marginRight: 8 }} /> Export to CSV
                  </MenuItem>
                </Menu>
              </TableCell>
            </TableRow>
          ))}
        </tbody>
      </Table>
      <Tooltip title="Export All to CSV" arrow>
        <StyledFab
          color="primary"
          aria-label="export"
          onClick={() => exportToCSV(referralReport)}
        >
          <DownloadIcon />
        </StyledFab>
      </Tooltip>
      <ReportsDetailsModal
        open={openModal}
        onClose={handleCloseModal}
        campaign={selectedCampaign}
      />
    </Container>
  );
};

export default Reports;
