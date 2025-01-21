import React, { useState, useRef, useEffect } from "react";
import * as Yup from "yup";
import { OTPContainer, OTPInput } from "./verifyOTP.styles";
import FormWrapper from "../../../components/FormWrapper";
import { StyledButton } from "../../../components/formWrapper.styles";
import { toast } from "react-toastify";
import { useAuthContext } from "../../../hooks/useAuthContext";

const validationSchema = Yup.object().shape({
  otp: Yup.string()
    .length(6, "OTP must be 6 digits")
    .required("OTP is required"),
});

const VerifyOTP: React.FC = () => {
  const { validateOtp } = useAuthContext();

  const [otp, setOtp] = useState(Array(6).fill(""));
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const [loading, setLoading] = useState(false);

  // Auto-focus on the first input field when the component is mounted
  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
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

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }

    // Handle Enter key press on the last input field (6th OTP input)
    if (e.key === "Enter" && index === 5) {
      e.preventDefault(); // Prevent form from auto-submitting
      handleSubmit(); // Trigger form submission
    }
  };

  const handleSubmit = async () => {
    console.log("OTP button clicked");
    const enteredOTP = otp.join("");
    if (enteredOTP.length < 6) {
      toast.error("OTP must be 6 digits.");
      return;
    }

    setLoading(true);
    try {
      await validateOtp(enteredOTP);
    } catch (error) {
      console.error("Error verifying OTP:", error);
      toast.error("An error occurred while verifying the OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <FormWrapper
      title="Verify OTP"
      initialValues={{ otp: "" }}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
      fields={[]} // No standard fields here, we handle the OTP inputs manually
      buttonLabel={""}
    >
      <OTPContainer>
        {otp.map((digit, index) => (
          <OTPInput
            key={index}
            type="text"
            value={digit}
            onChange={(e) => handleChange(e, index)}
            onKeyDown={(e) => handleKeyDown(e, index)} // Handle Backspace and Enter
            ref={(el) => {
              inputRefs.current[index] = el;
            }}
            maxLength={1}
          />
        ))}
      </OTPContainer>

      {/* The submit button will be triggered via Enter key or click */}
      <StyledButton type="submit" fullWidth>
        {loading ? "Verifying..." : "Verify OTP"}
      </StyledButton>
    </FormWrapper>
  );
};

export default VerifyOTP;
