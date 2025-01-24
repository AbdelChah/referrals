import React, { useState } from "react";
import * as Yup from "yup";
import FormWrapper from "../../components/FormWrapper"; // Adjust path as needed
import { FormikValues } from "formik";
import { StyledModal, ModalContent, CloseButton } from "./AddAdminModal.styles"; // Adjust the import path
import CloseIcon from "@mui/icons-material/Close";
import { Fade } from "@mui/material";
import { registerService } from "../../services/authenticationService"; // Import registerService
import { RegisterRequest } from "../../Models/Authentication"; // Import the type for the request

interface AddAdminModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (values: FormikValues) => void;
}

const validationSchema = Yup.object({
  username: Yup.string().required("Username is required"),
  password: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
});

const AddAdminModal: React.FC<AddAdminModalProps> = ({ open, onClose, onSubmit }) => {
  const [loading, setLoading] = useState(false);  // State to manage loading status

  // Function to call the register API
  const handleRegisterAdmin = async (values: FormikValues) => {
    setLoading(true); // Set loading to true when the request starts
    try {
      // Create the data object for the API call
      const data: RegisterRequest = {
        username: values.username,
        password: values.password,
        email: values.email,
      };

      // Call the registerService from authenticationService
      const response = await registerService(data);
      console.log("Admin registered successfully:", response);
      onSubmit(values); // Call onSubmit with the values after successful registration
    } catch (error) {
      console.error("Error registering admin:", error);
      // Handle error if needed (e.g., show an error message)
    } finally {
      setLoading(false); // Set loading to false when the request finishes
    }
  };

  return (
    <StyledModal open={open} onClose={onClose} closeAfterTransition>
      <Fade in={open}>
        <ModalContent>
          {/* Close Button */}
          <CloseButton onClick={onClose}>
            <CloseIcon />
          </CloseButton>

          {/* FormWrapper inside the Modal */}
          <FormWrapper
            height="30vh"  // Adjusted height for the form
            initialValues={{ username: "", password: "", email: "" }}
            validationSchema={validationSchema}
            onSubmit={handleRegisterAdmin}  // Using handleRegisterAdmin instead of onSubmit directly
            fields={[
              { name: "username", label: "Username", type: "text" },
              { name: "password", label: "Password", type: "password" },
              { name: "email", label: "Email", type: "email" },
            ]}
            buttonLabel={loading ? "Registering..." : "Add Admin"} // Button text based on loading state
            onClose={onClose} // Close handler passed to FormWrapper
            title="Register New Admin" // Title of the modal
          />
        </ModalContent>
      </Fade>
    </StyledModal>
  );
};

export default AddAdminModal;
