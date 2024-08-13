import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSignUp, useAuth } from "@clerk/clerk-react";
import { AxiosError } from "axios";

const VerifyEmailPage: React.FC = () => {
  const { signUp } = useSignUp();
  const { signOut } = useAuth();
  const [verificationCode, setVerificationCode] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const navigate = useNavigate();

  // Log when the VerifyEmailPage component is loaded
  useEffect(() => {
    console.log("Loaded VerifyEmailPage");
  }, []);

  // Function to handle email verification process
  const handleVerifyEmail = async () => {
    setIsLoading(true);

    try {
      console.log("Attempting email verification with code:", verificationCode);
      // Attempt to verify the email using the provided code
      const result = await signUp?.attemptVerification({
        strategy: "email_code",
        code: verificationCode,
      });

      if (result?.status === "complete") {
        console.log("Verification successful. Proceeding to sign out...");
        // Sign out the user after successful verification
        await signOut();
        console.log("User signed out. Redirecting to sign-in page...");
        navigate("/sign-in"); // Redirect to the sign-in page
      } else {
        console.error("Verification failed or incomplete. Result:", result);
      }
    } catch (error: unknown) {
      console.error("Error during verification attempt:", error);

      // Check if the error is an AxiosError
      if (error instanceof AxiosError) {
        if (error.response?.status === 429) {
          alert("Too many requests. Please wait before trying again.");
        } else {
          alert("An error occurred. Please try again later.");
        }
      } else if (error instanceof Error) {
        // Handle other types of errors
        alert(`An unexpected error occurred: ${error.message}`);
      } else {
        // Generic error message for unknown error types
        alert("An unexpected error occurred. Please try again later.");
      }
    } finally {
      setIsLoading(false); // Ensure loading state is reset
    }
  };

  // Display a loading message while the verification process is in progress
  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="verify-email-container">
      <h1>Verify Your Email</h1>
      <p>
        Please enter the verification code sent to your email to complete the
        sign-up process.
      </p>
      <input
        type="text"
        value={verificationCode}
        onChange={(e) => setVerificationCode(e.target.value)}
        placeholder="Enter verification code"
        className="verification-input"
      />
      <button onClick={handleVerifyEmail} className="verify-email-button">
        Verify Email
      </button>
    </div>
  );
};

export default VerifyEmailPage;
