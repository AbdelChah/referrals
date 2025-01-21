import React from "react";
import * as Yup from "yup";
import FormWrapper from "../../components/FormWrapper"; // Adjust path as needed
import { FormikValues } from "formik";
import { StyledModal, ModalContent, CloseButton } from "./AddAdminModal.styles"; // Adjust the import path
import CloseIcon from "@mui/icons-material/Close";
import { Fade } from "@mui/material";

interface AddAdminModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (values: FormikValues) => void;
}

const validationSchema = Yup.object({
  name: Yup.string().required("Name is required"),
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
});

const AddAdminModal: React.FC<AddAdminModalProps> = ({ open, onClose, onSubmit }) => {
  return (
    <StyledModal
      open={open}
      onClose={onClose}
      closeAfterTransition
    >
      <Fade in={open}>
        <ModalContent>
          {/* Close Button */}
          <CloseButton onClick={onClose}>
            <CloseIcon />
          </CloseButton>

          {/* FormWrapper inside the Modal */}
          <FormWrapper
            height="30vh"
            initialValues={{ name: "", email: "" }}
            validationSchema={validationSchema}
            onSubmit={onSubmit}
            fields={[
              { name: "name", label: "Admin Name", type: "text" },
              { name: "email", label: "Admin Email", type: "email" },
            ]}
            buttonLabel="Add Admin"
            onClose={onClose} // Close handler passed to FormWrapper
            title={""}          />
        </ModalContent>
      </Fade>
    </StyledModal>
  );
};

export default AddAdminModal;
