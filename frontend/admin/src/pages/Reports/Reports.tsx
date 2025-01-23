import React from "react";
// import { StyledTable, StyledTableRow, TableHeaderCell, StyledTableCell, StyledButton } from "../../styles/table.styles";
// import { Title } from "../../styles/title.styles";
// import campaignsJson from "../../Models/Mock/campaigns.json";
// import { Campaign } from "../../Models/Campaign";
// import { TablePagination, Select, MenuItem, InputLabel, FormControl, SelectChangeEvent } from "@mui/material"; // Add SelectChangeEvent here

const Reports: React.FC = () => {
  // const [campaigns, setCampaigns] = useState<Campaign[]>(campaignsJson as Campaign[]);
  // const [filteredCampaigns, setFilteredCampaigns] = useState<Campaign[]>(campaignsJson as Campaign[]);
  // const [statusFilter, setStatusFilter] = useState<string>("All");
  // const [page, setPage] = useState(0); // Pagination state
  // const [rowsPerPage, setRowsPerPage] = useState(5); // Rows per page

  // // Filter campaigns based on status
  // const filterCampaigns = (status: string) => {
  //   if (status === "All") {
  //     setFilteredCampaigns(campaigns);
  //   } else {
  //     setFilteredCampaigns(campaigns.filter((campaign) => {
  //       // Check if the status matches (for demo, use eligibility)
  //       const isEligible = campaign.eligibilityCriterias.some(criteria => criteria.name === "eKYC" && criteria.eligible);
  //       return isEligible ? status === "Active" : status === "Expired";
  //     }));
  //   }
  // };

  // const handleStatusFilterChange = (event: SelectChangeEvent<string>) => { // Updated type here
  //   const status = event.target.value;
  //   setStatusFilter(status);
  //   filterCampaigns(status);
  // };

  // const handlePageChange = (event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => {
  //   setPage(newPage);
  // };

  // const handleRowsPerPageChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
  //   setRowsPerPage(parseInt(event.target.value, 10));
  //   setPage(0); // Reset to first page when rows per page change
  // };

  // const handleExportReport = () => {
  //   // Step 1: Prepare the data for export (filteredCampaigns in this case)
  //   const headers = [
  //     "Campaign Name",
  //     "Start Date",
  //     "End Date",
  //     "Reward Type",
  //     "Status",
  //   ];
  
  //   const rows = filteredCampaigns.map((campaign) => [
  //     campaign.campaignName,
  //     campaign.startDate,
  //     campaign.endDate,
  //     campaign.rewardType,
  //     // For demo, show "Active" or "Expired" based on eKYC eligibility
  //     campaign.eligibilityCriterias.some(
  //       (criteria) => criteria.name === "eKYC" && criteria.eligible
  //     )
  //       ? "Active"
  //       : "Expired",
  //   ]);
  
  //   // Step 2: Convert data to CSV format
  //   const csvContent = [
  //     headers.join(","),
  //     ...rows.map((row) => row.join(",")),
  //   ].join("\n");
  
  //   // Step 3: Create a Blob from the CSV content
  //   const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  
  //   // Step 4: Create a download link and trigger the download
  //   const link = document.createElement("a");
  //   link.href = URL.createObjectURL(blob);
  //   link.download = "campaign_report.csv";
  //   link.click();
  
  //   // Log export message
  //   console.log("Exporting report data...");
  // };
  

  // const paginatedCampaigns = filteredCampaigns.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  return (
    <> NO REPORTS YET</>
  //     <Title>Campaign Reports</Title>
  //     <div>
  //       <FormControl>
  //         <InputLabel>Filter by Status</InputLabel>
  //         <Select
  //           value={statusFilter}
  //           onChange={handleStatusFilterChange}
  //           label="Filter by Status"
  //         >
  //           <MenuItem value="All">All</MenuItem>
  //           <MenuItem value="Active">Active</MenuItem>
  //           <MenuItem value="Expired">Expired</MenuItem>
  //         </Select>
  //       </FormControl>

  //       <StyledTable>
  //         <thead>
  //           <StyledTableRow>
  //             <TableHeaderCell>Campaign Name</TableHeaderCell>
  //             <TableHeaderCell>Start Date</TableHeaderCell>
  //             <TableHeaderCell>End Date</TableHeaderCell>
  //             <TableHeaderCell>Reward Type</TableHeaderCell>
  //             <TableHeaderCell>Status</TableHeaderCell>
  //           </StyledTableRow>
  //         </thead>
  //         <tbody>
  //           {paginatedCampaigns.map((campaign) => (
  //             <StyledTableRow key={campaign.id}>
  //               <StyledTableCell>{campaign.campaignName}</StyledTableCell>
  //               <StyledTableCell>{campaign.startDate}</StyledTableCell>
  //               <StyledTableCell>{campaign.endDate}</StyledTableCell>
  //               <StyledTableCell>{campaign.rewardType}</StyledTableCell>
  //               <StyledTableCell>
  //                 {/* For demo, we show "Active" if eKYC is eligible, otherwise "Expired" */}
  //                 {campaign.eligibilityCriterias.some(criteria => criteria.name === "eKYC" && criteria.eligible) ? "Active" : "Expired"}
  //               </StyledTableCell>
  //             </StyledTableRow>
  //           ))}
  //         </tbody>
  //       </StyledTable>

  //       <TablePagination
  //         rowsPerPageOptions={[5, 10, 25]}
  //         component="div"
  //         count={filteredCampaigns.length}
  //         rowsPerPage={rowsPerPage}
  //         page={page}
  //         onPageChange={handlePageChange}
  //         onRowsPerPageChange={handleRowsPerPageChange}
  //       />

  //       <StyledButton onClick={handleExportReport}>Export Report</StyledButton>
  //     </div>
  //   </>
  );
};

export default Reports;
