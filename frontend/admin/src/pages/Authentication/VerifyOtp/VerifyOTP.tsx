import React, { useEffect, useRef, useState } from "react";
import {
  FormContainer,
  FormBox,
  FormTitle,
  StyledButton,
  StyledTextField,
  FormError,
} from "../../../components/formWrapper.styles";
import { useAuthContext } from "../../../hooks/useAuthContext";
import { toast } from "react-toastify";
import { Box } from "@mui/material";

const VerifyOtp: React.FC = () => {
  const { validateOtp } = useAuthContext();
  const [otp, setOtp] = useState(Array(6).fill(""));
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    inputRefs.current[0]?.focus(); // Auto-focus on the first input when the component mounts
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const value = e.target.value;
    if (!isNaN(Number(value)) && value.length <= 1) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      // Move focus to the next input field
      if (value && index < 5) {
        inputRefs.current[index + 1]?.focus();
      }
    }
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number
  ) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }

    if (e.key === "Enter" && index === 5) {
      e.preventDefault();
      handleSubmit(); // Trigger form submission when Enter is pressed on the last input
    }
  };

  const handleSubmit = async () => {
    const enteredOTP = otp.join("");
    if (enteredOTP.length < 6) {
      setError("OTP must be 6 digits.");
      return;
    }

    setLoading(true);
    try {
      await validateOtp(enteredOTP);
      toast.success("OTP verified successfully!");
    } catch (err) {
      console.error(err);
      setError("Invalid OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <FormContainer>
      <Box
        component="form" // ✅ Use a standard Box here
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit();
        }}
      >
        <FormBox>
          <FormTitle variant="h5">Verify OTP</FormTitle>
          {error && <FormError>{error}</FormError>}
          <div
            style={{ display: "flex", justifyContent: "center", gap: "10px" }}
          >
            {otp.map((digit, index) => (
              <input
                key={index}
                type="text"
                value={digit}
                onChange={(e) => handleChange(e, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                ref={(el) => {
                  inputRefs.current[index] = el;
                }}
                maxLength={1}
                style={{
                  width: "40px",
                  height: "40px",
                  fontSize: "20px",
                  textAlign: "center",
                  margin: "5px",
                  borderRadius: "8px",
                  border: "1px solid #ccc",
                }}
              />
            ))}
          </div>
          {/* Add margin-top here */}
          <StyledButton
            type="submit"
            fullWidth
            disabled={loading}
            sx={{ mt: 3 }}
          >
            {loading ? "Verifying..." : "Verify OTP"}
          </StyledButton>
        </FormBox>
      </Box>
    </FormContainer>
  );
};

export default VerifyOtp;
