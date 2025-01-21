import React, { useState } from "react";
import * as Yup from "yup";
import { FormikValues } from "formik";
import FormWrapper from "../../../components/FormWrapper";
import { Link } from "react-router-dom";
// Yup validation schema for email
const validationSchema = Yup.object({
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
});

const RecoverPassword: React.FC = () => {
  const [error, setError] = useState<string>("");

  // Handle submit
  const handleSubmit = (values: FormikValues) => {
    const { email } = values;

    // Handle recover password logic here (e.g., API call)
    setError(""); // Reset error state

    // Log values or make API call
    console.log("Recover Password Info:", { email });

    // Add actual recover password API call here
  };

  const fields = [{ name: "email", label: "Email Address", type: "email" }];

  return (
    <FormWrapper
      title="Recover Password"
      initialValues={{ email: "" }}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
      fields={fields}
      buttonLabel="Send Confirmation"
      errorMessage={error} // Global error message
    >
      <Link
        to="/login"
        style={{ marginTop: "10px", display: "block", textAlign: "center" }}
      >
        Back to Login
      </Link>
    </FormWrapper>
  );
};

export default RecoverPassword;
