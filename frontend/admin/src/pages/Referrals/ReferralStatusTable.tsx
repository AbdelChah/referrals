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
} from "../../styles/table.styles"; // Use shared styles
import {
  TableBody,
  TableHead,
  TableRow,
  TablePagination,
  Typography,
  Box,
} from "@mui/material";
import { Title } from "../../styles/title.styles";

const ReferralStatusTable: React.FC = () => {
  const [referralData, setReferralData] = useState<ReferralsResponse[]>([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [openModal, setOpenModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const referrals = await fetchReferrals();
        setReferralData(referrals); // Set the array directly
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

  if (loading) {
    return <Typography>Loading...</Typography>;
  }

  if (error) {
    return <Typography color="error">{error}</Typography>;
  }

  return (
    <>
      <Title>Referral Status</Title>
      <Container>
        <StyledTable>
          <TableHead>
            <StyledTableRow cursor="default">
              <TableHeaderCell>Referrer Phone</TableHeaderCell>
              <TableHeaderCell>Referees</TableHeaderCell>
              <TableHeaderCell>Campaigns</TableHeaderCell>
            </StyledTableRow>
          </TableHead>
          <TableBody>
            {referralData
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((referrer) => (
                <StyledTableRow
                  key={referrer.referrer_phone}
                  onClick={() => handleOpenModal(referrer)} // Handle row click
                  sx={{ cursor: "pointer" }} // Optionally, add a pointer cursor for better UX
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
                        referrer.campaigns.map((campaign: any, index: number) => (
                          <Typography key={campaign.campaignId || index} variant="body2">
                            {campaign.campaignName}
                          </Typography>
                        ))
                      ) : (
                        <Typography variant="body2">No campaigns</Typography>
                      )}
                    </Box>
                  </StyledTableCell>
                </StyledTableRow>
              ))}
          </TableBody>
        </StyledTable>

        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={referralData.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handlePageChange}
          onRowsPerPageChange={handleRowsPerPageChange}
        />

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
