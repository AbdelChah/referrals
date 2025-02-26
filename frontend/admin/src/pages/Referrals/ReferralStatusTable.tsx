import React, { useState, useEffect } from "react";
import UserDetailModal from "./UserDetailModal";
import { fetchReferrals } from "../../services/referralsService";
import { ReferralsResponse } from "../../Models/Referral";
import {
  Container,
  StyledTable,
  TableHeaderCell,
  StyledTableCell,
  StyledTableRow,
  TableHeaderContainer,
  SortIconContainer,
} from "../../styles/table.styles";
import {
  TableBody,
  TableHead,
  TablePagination,
  Typography,
  Box,
  TextField,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import LoadingView from "../../components/LoadingView";
import { ArrowDownward, ArrowUpward } from "@mui/icons-material";
import { Menu, MenuItem, IconButton } from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import VisibilityIcon from "@mui/icons-material/Visibility";

const ReferralStatusTable: React.FC = () => {
  const [referralData, setReferralData] = useState<ReferralsResponse[]>([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [openModal, setOpenModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [sortConfig, setSortConfig] = useState<{
    key: string;
    direction: "asc" | "desc";
  } | null>(null);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const handleMenuOpen = (
    event: React.MouseEvent<HTMLButtonElement>,
    user: any
  ) => {
    event.stopPropagation(); // Prevent row click event
    setAnchorEl(event.currentTarget);
    setSelectedUser(user);
  };

  const handleMenuClose = (event: React.MouseEvent) => {
    event.stopPropagation();
    setAnchorEl(null);
  };

  const handleViewDetails = () => {
    handleCloseModal();
    setSelectedUser(selectedUser);
    setOpenModal(true);
  };
  useEffect(() => {
    const fetchData = async () => {
      try {
        const referrals = await fetchReferrals();
        setReferralData(referrals);
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch referrals");
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handlePageChange = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleRowsPerPageChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleOpenModal = (user: any) => {
    setSelectedUser(user);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedUser(null);
  };

  const handleSort = (key: string) => {
    setSortConfig((prev) => {
      if (prev && prev.key === key) {
        return { key, direction: prev.direction === "asc" ? "desc" : "asc" };
      }
      return { key, direction: "asc" };
    });
  };

  // Filter function based on search term
  const filteredReferralData = referralData.filter((referrer) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      (referrer.referrer_phone &&
        referrer.referrer_phone.toLowerCase().includes(searchLower)) ||
      referrer.campaigns.some((campaign: any) =>
        campaign.referees.some(
          (referee: any) =>
            referee.referee_phone &&
            referee.referee_phone.toLowerCase().includes(searchLower)
        )
      ) ||
      referrer.campaigns.some(
        (campaign: any) =>
          campaign.campaignName &&
          campaign.campaignName.toLowerCase().includes(searchLower)
      )
    );
  });

  // Sorting logic for campaigns
  const sortedReferralData = [...filteredReferralData].sort((a, b) => {
    if (!sortConfig) return 0;

    const getCampaignName = (referrer: ReferralsResponse) => {
      return referrer.campaigns
        .map((campaign: any) => campaign.campaignName || "")
        .join(", ");
    };

    const aValue = getCampaignName(a);
    const bValue = getCampaignName(b);

    if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1;
    if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1;
    return 0;
  });

  if (loading) {
    return <LoadingView />;
  }

  if (error) {
    return <Typography color="error">{error}</Typography>;
  }

  return (
    <>
      <Container>
        <TextField
          label="Search by Referrer Phone, Referee Phone or Campaign"
          variant="outlined"
          fullWidth
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{ marginBottom: "16px" }}
        />

        <StyledTable>
          <TableHead>
            <StyledTableRow cursor="default">
              <TableHeaderCell>Referrer Phone</TableHeaderCell>
              <TableHeaderCell>Referees</TableHeaderCell>
              <TableHeaderCell>
                <TableHeaderContainer onClick={() => handleSort("campaigns")}>
                  Campaigns
                  {sortConfig?.key === "campaigns" && (
                    <SortIconContainer>
                      {sortConfig?.direction === "asc" ? (
                        <ArrowUpward fontSize="small" />
                      ) : (
                        <ArrowDownward fontSize="small" />
                      )}
                    </SortIconContainer>
                  )}
                </TableHeaderContainer>
              </TableHeaderCell>
              <TableHeaderCell>Actions</TableHeaderCell>
            </StyledTableRow>
          </TableHead>
          <TableBody>
            {sortedReferralData
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((referrer) => (
                <StyledTableRow
                  key={referrer.referrer_phone}
                  onClick={() => handleOpenModal(referrer)}
                  sx={{ cursor: "pointer" }}
                >
                  <StyledTableCell>{referrer.referrer_phone}</StyledTableCell>
                  <StyledTableCell>
                    {referrer.campaigns.flatMap(
                      (campaign: any, campaignIndex: number) =>
                        campaign.referees.length > 0 ? (
                          campaign.referees.map(
                            (referee: any, refereeIndex: number) => (
                              <Box
                                key={`${referee.referralId}-${campaign.campaignId}-${campaignIndex}-${refereeIndex}`}
                                sx={{ mb: 1 }}
                              >
                                <Typography variant="body2">
                                  <strong>Phone:</strong>{" "}
                                  {referee.referee_phone}
                                </Typography>
                              </Box>
                            )
                          )
                        ) : (
                          <Typography
                            key={`${campaign.campaignId}-${campaignIndex}`}
                            variant="body2"
                          >
                            No referees
                          </Typography>
                        )
                    )}
                  </StyledTableCell>
                  <StyledTableCell>
                    <Box>
                      {referrer.campaigns.length > 0 ? (
                        referrer.campaigns.map(
                          (campaign: any, index: number) => (
                            <Typography
                              key={campaign.campaignId || index}
                              variant="body2"
                            >
                              {campaign.campaignName}
                            </Typography>
                          )
                        )
                      ) : (
                        <Typography variant="body2">No campaigns</Typography>
                      )}
                    </Box>
                  </StyledTableCell>
                  <StyledTableCell>
                    <IconButton onClick={(e) => handleMenuOpen(e, referrer)}>
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
                          handleViewDetails();
                        }}
                      >
                        <ListItemIcon>
                          <VisibilityIcon fontSize="small" />
                        </ListItemIcon>
                        <ListItemText primary="View Details" />
                      </MenuItem>
                    </Menu>
                  </StyledTableCell>
                </StyledTableRow>
              ))}
          </TableBody>
        </StyledTable>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={sortedReferralData.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handlePageChange}
          onRowsPerPageChange={handleRowsPerPageChange}
        />

        {/* User Detail Modal */}
        <UserDetailModal
          open={openModal}
          onClose={handleCloseModal}
          user={selectedUser}
        />
      </Container>
    </>
  );
};

export default ReferralStatusTable;
