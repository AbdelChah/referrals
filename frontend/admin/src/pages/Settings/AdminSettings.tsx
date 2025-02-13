import React, { useState, useEffect, useCallback } from "react";
import {
  StyledTable as Table,
  StyledTableRow as TableRow,
  TableHeaderCell as TableHeader,
  StyledTableCell as TableCell,
  StyledButton,
  Container,
  StyledFab,
  SortIconContainer,
  TableHeaderContainer,
} from "../../styles/table.styles";
import { Admin } from "../../Models/Admins"; // Assuming you have an Admin model
import { fetchAdmins, deleteAdmin } from "../../services/authenticationService";
import AdminModal from "./AddAdminModal"; // Assuming this is your modal component
import { TablePagination, Tooltip, TextField, Box } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { ArrowDownward, ArrowUpward } from "@mui/icons-material"; // For sorting icons
import LoadingView from "../../components/LoadingView";
import { FormikValues } from "formik";
import { Menu, MenuItem, IconButton } from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import DeleteIcon from "@mui/icons-material/Delete";

const AdminSettings: React.FC = () => {
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [sortConfig, setSortConfig] = useState<{
    key: keyof Admin;
    direction: "asc" | "desc";
  }>({
    key: "username", // Sort by username by default
    direction: "asc",
  });

  const [searchQuery, setSearchQuery] = useState("");
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedAdmin, setSelectedAdmin] = useState<Admin | null>(null);
  const handleMenuOpen = (
    event: React.MouseEvent<HTMLButtonElement>,
    admin: Admin
  ) => {
    event.stopPropagation(); // Prevent row click event
    setAnchorEl(event.currentTarget);
    setSelectedAdmin(admin);
  };

  const handleMenuClose = (event: React.MouseEvent) => {
    event.stopPropagation();
    setAnchorEl(null);
  };

  const loadAdmins = useCallback(async () => {
    try {
      const fetchedAdmins = await fetchAdmins(); // Fetch admins
      setAdmins(fetchedAdmins);
    } catch (error) {
      console.error("Error loading admins:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadAdmins();
  }, [loadAdmins]);

  const handleCloseModal = () => {
    setIsModalOpen(false);
    loadAdmins();
  };

  const handleDelete = async (adminId: string) => {
    try {
      await deleteAdmin(adminId); // Delete admin
      loadAdmins();
    } catch (error) {
      console.error("Error deleting admin:", error);
    }
  };

  const handleSort = (key: keyof Admin) => {
    let direction: "asc" | "desc" = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  const filteredAdmins = admins.filter(
    (admin) =>
      admin.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      admin.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const sortedAdmins = [...filteredAdmins].sort((a, b) => {
    const getValue = (admin: Admin, key: keyof Admin) => admin[key] ?? ""; // Use an empty string if value is undefined

    const aValue = getValue(a, sortConfig.key);
    const bValue = getValue(b, sortConfig.key);

    if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1;
    if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1;
    return 0;
  });

  const paginatedAdmins = sortedAdmins.slice(
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

  const handleFabClick = () => {
    setIsModalOpen(true); // Open the modal
  };

  return (
    <>
      <Container>
        <Box display="flex" gap={2} mb={2} alignItems="center">
          <Box flex="3">
            <TextField
              label="Search by Username or Email"
              variant="outlined"
              fullWidth
              value={searchQuery}
              onChange={handleSearchChange}
            />
          </Box>
        </Box>

        <Table>
          <thead>
            <TableRow cursor="default">
              <TableHeader>
                <TableHeaderContainer onClick={() => handleSort("username")}>
                  Username
                  {sortConfig.key === "username" && (
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
                <TableHeaderContainer onClick={() => handleSort("email")}>
                  Email
                  {sortConfig.key === "email" && (
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
                <TableHeaderContainer>Actions</TableHeaderContainer>
              </TableHeader>
            </TableRow>
          </thead>

          <tbody>
            {paginatedAdmins.map((admin) => (
              <TableRow key={admin.id}>
                <TableCell>{admin.username}</TableCell>
                <TableCell>{admin.email}</TableCell>
                <TableCell>
                  {/* More Actions Button */}
                  <IconButton onClick={(e) => handleMenuOpen(e, admin)}>
                    <MoreVertIcon />
                  </IconButton>

                  {/* Actions Menu */}
                  <Menu
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={handleMenuClose}
                  >
                    <MenuItem
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(selectedAdmin!.id); // Delete action
                        handleMenuClose(e);
                      }}
                    >
                      <DeleteIcon style={{ marginRight: 8, color: "red" }} />{" "}
                      Delete
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
          count={sortedAdmins.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handlePageChange}
          onRowsPerPageChange={handleRowsPerPageChange}
        />
      </Container>

      {/* Floating action button for adding an admin */}
      <Tooltip title="Add new admin" arrow>
        <StyledFab color="primary" aria-label="add" onClick={handleFabClick}>
          <AddIcon />
        </StyledFab>
      </Tooltip>

      {isModalOpen && (
        <AdminModal
          open={isModalOpen}
          onClose={handleCloseModal}
          onSubmit={function (values: FormikValues): void {
            throw new Error("Function not implemented.");
          }}
        />
      )}
    </>
  );
};

export default AdminSettings;
