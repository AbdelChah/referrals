import React, { useState } from "react";
import * as Yup from "yup";
import FormWrapper from "../../../components/FormWrapper";
import { FormikValues } from "formik";
import { useAuthContext } from "../../../hooks/useAuthContext";
import { Link, useNavigate } from "react-router-dom";

const validationSchema = Yup.object({
  username: Yup.string().required("Username is required"),
  password: Yup.string().required("Password is required"),
});

const Login: React.FC = () => {
  const [error, setError] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const authContext = useAuthContext();
  const navigate = useNavigate();

  const { login } = authContext;

  const handleSubmit = async (values: FormikValues) => {
    const { username, password } = values;
    setIsLoading(true);
    setError("");
    try {
      await login(username, password);
    } catch (err) {
      console.error("Unexpected error:", err);
      setError("Invalid username or password.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <FormWrapper
      title="Login"
      initialValues={{ username: "", password: "" }}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
      fields={[
        { name: "username", label: "Username", type: "text" },
        { name: "password", label: "Password", type: "password" },
      ]}
      buttonLabel={isLoading ? "Logging in..." : "Login"}
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
