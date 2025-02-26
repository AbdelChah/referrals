import React, { useState } from "react";
import * as Yup from "yup";
import { FormikValues } from "formik";
import FormWrapper from "../../../components/FormWrapper";
import { resetPasswordService } from "../../../services/authenticationService";
import {
  ResetPasswordRequest,
} from "../../../Models/Authentication";
import { toast } from "react-toastify";

// Yup validation schema
const validationSchema = Yup.object({
  username: Yup.string().required("Username is required"),
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
  newPassword: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .matches(/[0-9]/, "Password must contain at least one number")
    .required("Password is required"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("newPassword")], "Passwords must match")
    .required("Confirm password is required"),
});

const ResetPassword: React.FC = () => {
  const [error, setError] = useState<string>("");

  // Handle submit
  const handleSubmit = async (values: FormikValues) => {
    const { username, email, newPassword } = values;

    try {
      setError("");

      // Call the resetPasswordService API
      await resetPasswordService({
        username,
        email,
        newPassword,
      } as ResetPasswordRequest);
      toast.success("Password reset successfully!");
      // Handle success response (e.g., navigate to login or show success message)
    } catch (err: any) {
      console.error("Reset Password Error:", err);
      setError(
        err.message || "An error occurred while resetting the password."
      );
    }
  };

  const fields = [
    { name: "username", label: "Username", type: "text" },
    { name: "email", label: "Email Address", type: "email" },
    { name: "newPassword", label: "New Password", type: "password" },
    { name: "confirmPassword", label: "Confirm Password", type: "password" },
  ];

  return (
    <FormWrapper
      title="Reset Password"
      initialValues={{
        username: "",
        email: "",
        newPassword: "",
        confirmPassword: "",
      }} // Pass initial values
      validationSchema={validationSchema} // Pass Yup validation schema
      onSubmit={handleSubmit} // Pass submit handler
      fields={fields} // Pass form fields
      buttonLabel="Reset Password"
      errorMessage={error} // Global error message
    />
  );
};

export default ResetPassword;
