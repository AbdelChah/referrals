import React, { useState } from "react";
import * as Yup from "yup";
import FormWrapper from "../../components/FormWrapper";
import { FormikValues } from "formik";
import { StyledModal } from "./AddAdminModal.styles";
import { registerService } from "../../services/authenticationService";
import { RegisterRequest } from "../../Models/Authentication";
import { toast } from "react-toastify";
interface AddAdminModalProps {
  open: boolean;
  onClose: () => void;
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

const AddAdminModal: React.FC<AddAdminModalProps> = ({
  open,
  onClose,
}) => {
  const [loading, setLoading] = useState(false); // State to manage loading status
  const [error, setError] = useState<string | undefined>(undefined);

  // Function to call the register API
  const handleRegisterAdmin = async (values: FormikValues) => {
    setLoading(true);
    setError(undefined);
    try {
      const data: RegisterRequest = {
        username: values.username,
        password: values.password,
        email: values.email,
      };

      // Call the registerService from authenticationService
      await registerService(data);

      // Notify success
      toast.success("Admin registered successfully!");
      onClose(); // Close the modal after successful registration
    } catch (error) {
      console.error("Error registering admin:", error);
      setError("Failed to register admin. Please try again.");
      toast.error("Failed to register admin. Please try again.");
    } finally {
      setLoading(false); // Set loading to false when the request finishes
    }
  };

  return (
    <StyledModal open={open} onClose={onClose} closeAfterTransition>
      <FormWrapper
        height="30vh"
        initialValues={{ username: "", password: "", email: "" }}
        validationSchema={validationSchema}
        onSubmit={handleRegisterAdmin}
        fields={[
          { name: "username", label: "Username", type: "text" },
          { name: "email", label: "Email", type: "email" },
          { name: "password", label: "Password", type: "password" },
        ]}
        buttonLabel={loading ? "Registering..." : "Add Admin"}
        onClose={onClose}
        showCloseButton={true}
        title="Register New Admin"
        errorMessage={error}
      />
    </StyledModal>
  );
};

export default AddAdminModal;
