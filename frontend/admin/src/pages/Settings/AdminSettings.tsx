import React, { useState } from "react";
import { Box, Button, TextField, Typography } from "@mui/material";
import { Title } from "../../styles/title.styles"; // Assuming Title is styled
import * as Yup from "yup";
import { Formik, Field, Form } from "formik"; // Use Formik directly for form handling
import { toast } from "react-toastify";
import { registerService } from "../../services/authenticationService"; // Import registerService
import { RegisterRequest } from "../../Models/Authentication"; // Import the type for the request

// Validation schema for the form
const validationSchema = Yup.object({
  username: Yup.string().required("Username is required"),
  password: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
});

const AdminSettings: React.FC = () => {
  const [admins, setAdmins] = useState<{ username: string; email: string }[]>([]);
  const [loading, setLoading] = useState(false);

  // Handle form submission for registering a new admin
  const handleRegisterAdmin = async (values: { username: string; password: string; email: string }) => {
    setLoading(true);
    try {
      // Create the data object for the API call
      const data: RegisterRequest = {
        username: values.username,
        password: values.password,
        email: values.email,
      };

      // Call the registerService from authenticationService
      await registerService(data);
      setAdmins([...admins, { username: values.username, email: values.email }]); // Add new admin to the list
      toast.success(`${values.username} added successfully`, {
        hideProgressBar: true,
      });
    } catch (error) {
      console.error("Error registering admin:", error);
      toast.error(`Failed to register new admin: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box>
      <Title>Admin Management</Title>

      {/* Form for Registering Admin */}
      <Formik
        initialValues={{ username: "", password: "", email: "" }}
        validationSchema={validationSchema}
        onSubmit={handleRegisterAdmin}
      >
        {({ errors, touched, handleChange, handleBlur, values }) => (
          <Form>
            <Box
              display="flex"
              flexDirection="column"
              gap="20px"
              maxWidth="500px"
              margin="0 auto"
              padding="20px"
              border="1px solid #ccc"
              borderRadius="8px"
            >
              <TextField
                label="Username"
                variant="outlined"
                name="username"
                value={values.username}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.username && Boolean(errors.username)}
                helperText={touched.username && errors.username}
                fullWidth
              />
              <TextField
                label="Email"
                variant="outlined"
                name="email"
                type="email"
                value={values.email}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.email && Boolean(errors.email)}
                helperText={touched.email && errors.email}
                fullWidth
              />
              <TextField
                label="Password"
                variant="outlined"
                name="password"
                type="password"
                value={values.password}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.password && Boolean(errors.password)}
                helperText={touched.password && errors.password}
                fullWidth
              />
              <Button
                variant="contained"
                color="primary"
                type="submit"
                disabled={loading}
                fullWidth
              >
                {loading ? "Registering..." : "Add Admin"}
              </Button>
            </Box>
          </Form>
        )}
      </Formik>
    </Box>
  );
};

export default AdminSettings;
