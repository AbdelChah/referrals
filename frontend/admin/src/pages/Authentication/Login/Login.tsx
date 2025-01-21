import React, { useState } from "react";
import * as Yup from "yup";
import FormWrapper from "@components/FormWrapper";
import { FormikValues } from "formik";
import { useAuthContext } from "@hooks/useAuthContext";

import { Link } from "react-router-dom";

const validationSchema = Yup.object({
  username: Yup.string().required("username is required"),
  password: Yup.string().required("Password is required"),
});

const Login: React.FC = () => {
  const [error, setError] = useState<string>("");
  const authContext = useAuthContext();

  const { login } = authContext;
  const handleSubmit = async (values: FormikValues) => {
    const { username, password } = values;

    try {
      await login(username, password, setError);
    } catch (err) {
      // This should be unnecessary as the context already handles errors
      console.error("Unexpected error:", err);
    }
  };

  return (
    <FormWrapper
      title="Login"
      initialValues={{ username: "", password: "" }}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
      fields={[
        { name: "username", label: "username", type: "username" },
        { name: "password", label: "Password", type: "password" },
      ]}
      buttonLabel="Login"
      errorMessage={error}
    >
      <Link
        to="/recover-password"
        style={{ marginTop: "10px", display: "block", textAlign: "center" }}
      >
        Forgot Password?
      </Link>
    </FormWrapper>
  );
};

export default Login;
