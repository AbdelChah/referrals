import React, { useState } from "react";
import {
  Typography,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
} from "@mui/material";
import { Title } from "../../styles/title.styles";
import AddAdminModal from "./AddAdminModal"; // Import the modal component
import { FormikValues } from "formik";
import { toast } from "react-toastify";

const AdminSettings: React.FC = () => {
  const [admins, setAdmins] = useState<{ name: string; email: string }[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

  const handleAddAdmin = (values: FormikValues) => {
    const { name, email } = values;

    setAdmins([...admins, { name, email }]); // Add new admin to the list
    setIsModalOpen(false); // Close the modal after submission
    toast.success(`${name} added successfully`, {
      hideProgressBar: true,
    });

  };

  return (
    <Box>
      <Title>Admin Management</Title>
      <Button
        variant="contained"
        color="primary"
        onClick={handleOpenModal}
        style={{ marginBottom: "20px" }}
      >
        Add Admin
      </Button>
      <AddAdminModal
        open={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleAddAdmin}
      />
      <Typography variant="h6" style={{ marginTop: "20px" }}>
        Admin List
      </Typography>
      {admins.length > 0 ? (
        <TableContainer component={Paper} style={{ marginTop: "10px" }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell><strong>#</strong></TableCell>
                <TableCell><strong>Name</strong></TableCell>
                <TableCell><strong>Email</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {admins.map((admin, index) => (
                <TableRow key={index}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{admin.name}</TableCell>
                  <TableCell>{admin.email}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        <Typography>No admins added yet.</Typography>
      )}
    </Box>
  );
};

export default AdminSettings;
