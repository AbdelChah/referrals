import React, { useState, useEffect, useCallback } from "react";
import {
  StyledTable as Table,
  StyledTableRow as TableRow,
  TableHeaderCell as TableHeader,
  StyledTableCell as TableCell,
  Container,
  StyledFab,
  MessageContainer,
  Message,
  SortIconContainer,
  TableHeaderContainer,
} from "../../styles/table.styles";
import { Link } from "react-router-dom";
import { Campaign } from "../../Models/Campaign";
import { fetchCampaigns, deleteCampaign, pauseCampaign, resumeCampaign } from "../../services/campaignService";
import CampaignModal from "./CampaignDetailsModal";
import {
  TablePagination,
  Tooltip,
  Typography,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  TextField,
  Box,
  Menu,
  IconButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import { formatDate } from "../../utils/dateUtils";
import LoadingView from "../../components/LoadingView";
import AddIcon from "@mui/icons-material/Add";
import { capitalizeFirstLetter } from "../../utils/capitalizeFirstLetter";
import { toast } from "react-toastify";
import { getStatusColor } from "../../helpers/statusColorHelper";
import { ArrowDownward, ArrowUpward } from "@mui/icons-material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import DeleteIcon from "@mui/icons-material/Delete";
import PauseIcon from "@mui/icons-material/Pause";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { SelectChangeEvent } from "@mui/material";

const CampaignList: React.FC = () => {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [loading, setLoading] = useState(true);
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(
    null
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [sortConfig, setSortConfig] = useState<{
    key: keyof Campaign;
    direction: "asc" | "desc";
  }>({
    key: "campaignName",
    direction: "asc",
  });

  const [statusFilter, setStatusFilter] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [anchorEl, setAnchorEl] = useState<{
    [key: string]: null | HTMLElement;
  }>({});

  const handleMenuOpen = (
    event: React.MouseEvent<HTMLButtonElement>,
    campaignId: string
  ) => {
    setAnchorEl((prev) => ({ ...prev, [campaignId]: event.currentTarget }));
  };

  const handleMenuClose = (campaignId: string) => {
    setAnchorEl((prev) => ({ ...prev, [campaignId]: null }));
  };

  const loadCampaigns = useCallback(async () => {
    try {
      const fetchedCampaigns = await fetchCampaigns();
      console.log({fetchedCampaigns});
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
    loadCampaigns();
  };

  const handleDelete = async (campaignId: string) => {
    try {
      await deleteCampaign(campaignId);
      loadCampaigns();
    } catch (error) {
      console.error("Error deleting campaign:", error);
      toast.error("Failed to delete the campaign. Please try again.");
    }
  };

  const handlePause = async (campaignId: string) => {
    try {
      await pauseCampaign(campaignId);
      loadCampaigns();
      toast.success("Campaign paused successfully ");
    } catch (error) {
      console.error("Error pausing campaign:", error);
      toast.error("Failed to pause the campaign. Please try again.");
    }
  };

  const handleResume = async (campaignId: string) => {
    try {
      await resumeCampaign(campaignId);
      loadCampaigns();
      toast.success("Campaign resumed successfully ");
    } catch (error) {
      console.error("Error pausing campaign:", error);
      toast.error("Failed to pause the campaign. Please try again.");
    }
  };
  const handleSort = (key: keyof Campaign) => {
    let direction: "asc" | "desc" = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc"; // Toggle direction if the same column is clicked
    }
    setSortConfig({ key, direction });
  };

  const handleStatusFilterChange = (event: SelectChangeEvent<string>) => {
    setStatusFilter(event.target.value);
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  const filteredCampaigns = campaigns
    .filter((campaign) =>
      statusFilter ? campaign.status === statusFilter : true
    )
    .filter((campaign) =>
      campaign.campaignName.toLowerCase().includes(searchQuery.toLowerCase())
    );

  const sortedCampaigns = [...filteredCampaigns].sort((a, b) => {
    const getValue = (campaign: Campaign, key: keyof Campaign) => {
      const value = campaign[key];

      if (Array.isArray(value)) {
        return value
          .map((v) => (typeof v === "string" ? v : JSON.stringify(v)))
          .join(", ");
      }

      return typeof value === "string" || typeof value === "number"
        ? value
        : "";
    };

    const aValue = getValue(a, sortConfig.key);
    const bValue = getValue(b, sortConfig.key);

    if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1;
    if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1;
    return 0;
  });

  const paginatedCampaigns = sortedCampaigns.slice(
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
    return <LoadingView />;
  }

  if (campaigns.length === 0) {
    return (
      <MessageContainer>
        <Message>No campaigns available. Please create a campaign.</Message>
        <Link to="/create-campaign">
          <Tooltip title="Create new campaign" arrow>
            <StyledFab color="primary" aria-label="create">
              <AddIcon />
            </StyledFab>
          </Tooltip>
        </Link>
      </MessageContainer>
    );
  }

  return (
    <>
      <Container>
        <Box display="flex" gap={2} mb={2} alignItems="center">
          <Box flex="3">
            <TextField
              label="Search by Campaign Name"
              variant="outlined"
              fullWidth
              value={searchQuery}
              onChange={handleSearchChange}
            />
          </Box>

          <Box flex="1">
            <FormControl fullWidth>
              <InputLabel>Status Filter</InputLabel>
              <Select
                value={statusFilter}
                onChange={handleStatusFilterChange}
                label="Status Filter"
              >
                <MenuItem value="">All</MenuItem>
                <MenuItem value="active">Active</MenuItem>
                <MenuItem value="inactive">Inactive</MenuItem>
                <MenuItem value="pending">Pending</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </Box>

        <Table>
          <thead>
            <TableRow cursor="default">
              <TableHeader>
                <TableHeaderContainer
                  onClick={() => handleSort("campaignName")}
                >
                  Campaign Name
                  {sortConfig.key === "campaignName" && (
                    <SortIconContainer>
                      {sortConfig.direction === "asc" ? (
                        <ArrowUpward fontSize="small" />
                      ) : (
                        <ArrowDownward fontSize="small" />
                      )}
                    </SortIconContainer>
                  )}
                </TableHeaderContainer>
              </TableHeader>

              <TableHeader>
                <TableHeaderContainer onClick={() => handleSort("status")}>
                  Status
                  {sortConfig.key === "status" && (
                    <SortIconContainer>
                      {sortConfig.direction === "asc" ? (
                        <ArrowUpward fontSize="small" />
                      ) : (
                        <ArrowDownward fontSize="small" />
                      )}
                    </SortIconContainer>
                  )}
                </TableHeaderContainer>
              </TableHeader>

              <TableHeader>
                <TableHeaderContainer onClick={() => handleSort("startDate")}>
                  Start Date
                  {sortConfig.key === "startDate" && (
                    <SortIconContainer>
                      {sortConfig.direction === "asc" ? (
                        <ArrowUpward fontSize="small" />
                      ) : (
                        <ArrowDownward fontSize="small" />
                      )}
                    </SortIconContainer>
                  )}
                </TableHeaderContainer>
              </TableHeader>

              <TableHeader>
                <TableHeaderContainer onClick={() => handleSort("endDate")}>
                  End Date
                  {sortConfig.key === "endDate" && (
                    <SortIconContainer>
                      {sortConfig.direction === "asc" ? (
                        <ArrowUpward fontSize="small" />
                      ) : (
                        <ArrowDownward fontSize="small" />
                      )}
                    </SortIconContainer>
                  )}
                </TableHeaderContainer>
              </TableHeader>

              <TableHeader>
                <TableHeaderContainer onClick={() => handleSort("rewardType")}>
                  Reward Type
                  {sortConfig.key === "rewardType" && (
                    <SortIconContainer>
                      {sortConfig.direction === "asc" ? (
                        <ArrowUpward fontSize="small" />
                      ) : (
                        <ArrowDownward fontSize="small" />
                      )}
                    </SortIconContainer>
                  )}
                </TableHeaderContainer>
              </TableHeader>

              <TableHeader>
                <TableHeaderContainer>
                  Eligibility Criteria
                </TableHeaderContainer>
              </TableHeader>

              <TableHeader>
                <TableHeaderContainer>Actions</TableHeaderContainer>
              </TableHeader>
            </TableRow>
          </thead>

          <tbody>
            {paginatedCampaigns.map((campaign) => (
              <TableRow
                key={campaign.id}
                onClick={() => handleRowClick(campaign)}
              >
                <TableCell>{campaign.campaignName}</TableCell>
                <TableCell>
                  <Typography
                    variant="body2"
                    sx={{
                      backgroundColor: getStatusColor(campaign.status),
                      color: "#fff",
                      padding: "4px 8px",
                      borderRadius: "8px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    {capitalizeFirstLetter(campaign.status)}
                  </Typography>
                </TableCell>
                <TableCell>{formatDate(campaign.startDate)}</TableCell>
                <TableCell>{formatDate(campaign.endDate)}</TableCell>
                <TableCell>
                  {Array.isArray(campaign.rewardType)
                    ? campaign.rewardType.join(", ")
                    : campaign.rewardType}
                </TableCell>
                <TableCell>
                  <ul>
                    {campaign.eligibilityCriteria.length > 0 ? (
                      campaign.eligibilityCriteria.map((criterion, index) => (
                        <li key={index}>
                          {criterion.name === "Onboarding"
                            ? `Onboarding: ${
                                criterion.onBoarding ? "Yes" : "No"
                              }`
                            : null}
                          {criterion.name === "Transaction" &&
                          criterion.transaction?.transactionType
                            ? `Transaction: ${criterion.transaction.transactionType.join(
                                ", "
                              )} with count ${criterion.transaction.minCount}`
                            : null}
                          {criterion.name === "TransactionFlow" &&
                          criterion.transactionFlow?.debitOrCredit
                            ? `TransactionFlow: ${criterion.transactionFlow.debitOrCredit} of ${criterion.transactionFlow.minAmount}`
                            : null}
                        </li>
                      ))
                    ) : (
                      <li>No eligibility criteria available</li>
                    )}
                  </ul>
                </TableCell>
                <TableCell>
                  <IconButton
                    onClick={(e) => {
                      e.stopPropagation();
                      handleMenuOpen(e, campaign.id);
                    }}
                    aria-controls={`menu-${campaign.id}`}
                    aria-haspopup="true"
                  >
                    <MoreVertIcon />
                  </IconButton>

                  <Menu
                    id={`menu-${campaign.id}`}
                    anchorEl={anchorEl[campaign.id] || null}
                    open={Boolean(anchorEl[campaign.id])}
                    onClose={(event: React.MouseEvent) => {
                      event.stopPropagation();
                      handleMenuClose(campaign.id);
                    }}
                  >
                    <MenuItem
                      onClick={() => {
                        handleMenuClose(campaign.id);
                        handleRowClick(campaign);
                      }}
                    >
                      <ListItemIcon>
                        <VisibilityIcon fontSize="small" />
                      </ListItemIcon>
                      <ListItemText primary="View Details" />
                    </MenuItem>
                    <MenuItem
                      onClick={() => {
                        handleMenuClose(campaign.id);
                        handleDelete(campaign.id);
                      }}
                      sx={{ color: "red" }} // Highlight delete action
                    >
                      <ListItemIcon>
                        <DeleteIcon fontSize="small" sx={{ color: "red" }} />
                      </ListItemIcon>
                      <ListItemText primary="Delete" />
                    </MenuItem>
                    <MenuItem
                      onClick={(event) => {
                        event.stopPropagation();
                        handlePause(campaign.campaignId)
                        handleMenuClose(campaign.id);
                      }}
                    >
                      <ListItemIcon>
                        <PauseIcon fontSize="small" />
                      </ListItemIcon>
                      <ListItemText primary="Pause" />
                    </MenuItem>
                    <MenuItem
                      onClick={(event) => {
                        console.log("future implementation of pause campaign", campaign);
                        event.stopPropagation();
                        handleResume(campaign.campaignId)
                        handleMenuClose(campaign.id);
                      }}
                    >
                      <ListItemIcon>
                        <PlayArrowIcon fontSize="small" />
                      </ListItemIcon>
                      <ListItemText primary="Resume" />
                    </MenuItem>
                  </Menu>
                </TableCell>
              </TableRow>
            ))}
          </tbody>
        </Table>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={sortedCampaigns.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handlePageChange}
          onRowsPerPageChange={handleRowsPerPageChange}
        />
      </Container>

      <Link to="/create-campaign">
        <Tooltip title="Create new campaign" arrow>
          <StyledFab color="primary" aria-label="create">
            <AddIcon />
          </StyledFab>
        </Tooltip>
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
