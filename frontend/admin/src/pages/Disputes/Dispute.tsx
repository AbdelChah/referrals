import React, { useState } from "react";
import {
  Container,
  StyledTable,
  TableHeaderCell,
  StyledTableCell,
  StyledTableRow,
} from "../../styles/table.styles"; // Use shared styles
import { StyledButton } from "../../styles/button.styles";

import { TableBody, TableHead, TableRow, TablePagination } from "@mui/material";
import { Title } from "../../styles/title.styles";
import disputes from "../../Models/Mock/disputes.json";

const Dispute: React.FC = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

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

  const handleResolve = (id: string) => {
    console.log(`Resolving dispute with ID: ${id}`);
  };

  const paginatedDisputes = disputes.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  return (
    <>
      <Container>
        <StyledTable>
          <TableHead>
            <TableRow>
              <TableHeaderCell>Dispute ID</TableHeaderCell>
              <TableHeaderCell>Referrer</TableHeaderCell>
              <TableHeaderCell>Date</TableHeaderCell>
              <TableHeaderCell>Status</TableHeaderCell>
              <TableHeaderCell>Issue</TableHeaderCell>
              <TableHeaderCell>Action</TableHeaderCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedDisputes.map((dispute) => (
              <StyledTableRow key={dispute.id}>
                <StyledTableCell>{dispute.id}</StyledTableCell>
                <StyledTableCell>{dispute.referrer}</StyledTableCell>
                <StyledTableCell>{dispute.date}</StyledTableCell>
                <StyledTableCell>{dispute.status}</StyledTableCell>
                <StyledTableCell>{dispute.issue}</StyledTableCell>
                <StyledTableCell>
                  <StyledButton
                    disabled={dispute.status === "Resolved"}
                    onClick={() => handleResolve(dispute.id)}
                  >
                    Resolve
                  </StyledButton>
                </StyledTableCell>
              </StyledTableRow>
            ))}
          </TableBody>
        </StyledTable>

        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={disputes.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handlePageChange}
          onRowsPerPageChange={handleRowsPerPageChange}
        />
      </Container>
    </>
  );
};

export default Dispute;
