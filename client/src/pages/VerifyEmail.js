import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { verifyEmailWithCode } from "../services/firebaseAuth";
import { updateEmailVerified } from "../services/api";
import "../styles/ResetPassword.css";

export default function VerifyEmail() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [email, setEmail] = useState("");

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        // Get the action code from URL
        const oobCode = searchParams.get("oobCode");
        const mode = searchParams.get("mode");
        const actionEmail = searchParams.get("email");

        // Check if this is an email verification request
        if (mode !== "verifyEmail" || !oobCode) {
          setError("Invalid verification link. Please check your email for the correct verification link.");
          setLoading(false);
          return;
        }

        // Set email if provided in URL
        if (actionEmail) {
          setEmail(actionEmail);
        }

        console.log("🔄 Verifying email with Firebase...");
        
        // Step 1: Verify email in Firebase
        const verifyResult = await verifyEmailWithCode(oobCode);
        console.log("✅ Email verified in Firebase");
        
        // Get email from verification result or URL parameter
        const emailToUpdate = verifyResult.email || actionEmail;

        // Step 2: Update MongoDB if we have the email
        if (emailToUpdate) {
          const normalizedEmail = emailToUpdate.toLowerCase().trim();
          try {
            console.log("🔄 Updating emailVerified in MongoDB...");
            await updateEmailVerified({
              email: normalizedEmail,
              emailVerified: true,
            });
            console.log("✅ Email verification status updated in MongoDB");
            setMessage("✅ Email verified successfully! Your account is now active. Redirecting to sign in...");
          } catch (mongoError) {
            console.error("❌ MongoDB update error:", mongoError);
            setMessage("✅ Email verified in Firebase, but failed to update MongoDB. You can still sign in.");
          }
        } else {
          setMessage("✅ Email verified successfully! Please sign in to complete the process.");
        }

        // Redirect to sign in after 3 seconds
        setTimeout(() => {
          navigate("/signin", { 
            state: { message: "Email verified successfully! You can now sign in." } 
          });
        }, 3000);
      } catch (err) {
        console.error("❌ Email verification error:", err);
        setError(
          err.message || "Failed to verify email. The link may have expired. Please request a new verification email."
        );
      } finally {
        setLoading(false);
      }
    };

    verifyEmail();
  }, [searchParams, navigate]);

  return (
    <div className="reset-password-container">
      <div className="reset-password-card">
        <h1>Verifying Email</h1>
        
        {loading && (
          <div style={{ textAlign: "center", padding: "20px" }}>
            <div style={{ fontSize: "48px", marginBottom: "10px" }}>⏳</div>
            <p>Please wait while we verify your email...</p>
          </div>
        )}

        {message && <div className="success-message">{message}</div>}
        {error && <div className="error-message">{error}</div>}

        {!loading && !message && !error && (
          <p style={{ textAlign: "center", color: "#666" }}>
            Processing verification...
          </p>
        )}

        {error && (
          <div style={{ marginTop: "20px", textAlign: "center" }}>
            <button
              onClick={() => navigate("/signin")}
              style={{
                padding: "10px 20px",
                backgroundColor: "#667eea",
                color: "white",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
              }}
            >
              Go to Sign In
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

