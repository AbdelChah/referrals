import React, { useState, useEffect } from "react";
import {
  StyledTable as Table,
  StyledTableRow as TableRow,
  TableHeaderCell as TableHeader,
  StyledTableCell as TableCell,
  Container,
  StyledFab,
  TableHeaderContainer,
  SortIconContainer,
} from "../../styles/table.styles";
import { Tooltip, Typography, TextField, Select, MenuItem, InputLabel, FormControl, Box } from "@mui/material";
import { getCampaignsMeta } from "../../services/campaignService";
import { CampaignsMeta } from "../../Models/Campaign";
import { exportToCSV } from "../../utils/exportDashboardtoCSV";
import LoadingView from "../../components/LoadingView";
import { Download } from "@mui/icons-material";
import { getStatusColor } from "../../helpers/statusColorHelper";
import { capitalizeFirstLetter } from "../../utils/capitalizeFirstLetter";
import { ArrowDownward, ArrowUpward } from "@mui/icons-material";
import { SelectChangeEvent } from "@mui/material";

const Dashboard: React.FC = () => {
  const [campaigns, setCampaigns] = useState<CampaignsMeta[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortConfig, setSortConfig] = useState<{
    key: keyof CampaignsMeta;
    direction: "asc" | "desc";
  }>({
    key: "campaignName",
    direction: "asc",
  });

  const [statusFilter, setStatusFilter] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

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
            : [],
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

  const sortData = (key: keyof CampaignsMeta) => {
    let direction: "asc" | "desc" = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }

    const sortedData = [...filteredCampaigns].sort((a, b) => {
      if (a[key] < b[key]) return direction === "asc" ? -1 : 1;
      if (a[key] > b[key]) return direction === "asc" ? 1 : -1;
      return 0;
    });

    setSortConfig({ key, direction });
    setCampaigns(sortedData);
  };

  return (
    <>
      {loading ? (
        <LoadingView />
      ) : campaigns.length === 0 ? (
        <Typography>No campaigns available.</Typography>
      ) : (
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
                      onClick={() => sortData("campaignName")}
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
                    <TableHeaderContainer onClick={() => sortData("status")}>
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
                    <TableHeaderContainer onClick={() => sortData("startDate")}>
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
                    <TableHeaderContainer onClick={() => sortData("endDate")}>
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
                    <TableHeaderContainer
                      onClick={() => sortData("rewardType")}
                    >
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
                    <TableHeaderContainer
                      onClick={() => sortData("eligibilityCriteria")}
                    >
                      Eligibility Criteria
                      {sortConfig.key === "eligibilityCriteria" && (
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
                    <TableHeaderContainer
                      onClick={() => sortData("totalReferrals")}
                    >
                      Total Referrals
                      {sortConfig.key === "totalReferrals" && (
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
                    <TableHeaderContainer
                      onClick={() => sortData("totalReferees")}
                    >
                      Total Referees
                      {sortConfig.key === "totalReferees" && (
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
                    <TableHeaderContainer
                      onClick={() => sortData("totalCompleted")}
                    >
                      Total Completed
                      {sortConfig.key === "totalCompleted" && (
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
                </TableRow>
              </thead>
              <tbody>
                {filteredCampaigns.map((campaign) => (
                  <TableRow cursor="default" key={campaign.id}>
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
                    <TableCell>{new Date(campaign.startDate).toLocaleDateString()}</TableCell>
                    <TableCell>{new Date(campaign.endDate).toLocaleDateString()}</TableCell>
                    <TableCell>{campaign.rewardType}</TableCell>
                    <TableCell>
                      <ul>
                        {Array.isArray(campaign.eligibilityCriteria) &&
                        campaign.eligibilityCriteria.length > 0 ? (
                          campaign.eligibilityCriteria.map((criterion: string, index: number) => (
                            <li key={index}>{criterion}</li>
                          ))
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
          </Container>

          <Tooltip title="Export All to CSV" arrow>
            <StyledFab
              color="primary"
              aria-label="export"
              onClick={() => exportToCSV(filteredCampaigns)}
            >
              <Download />
            </StyledFab>
          </Tooltip>
        </>
      )}
    </>
  );
};

export default Dashboard;
