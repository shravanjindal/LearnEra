import { useEffect, useRef, useState } from "react";

interface EmailVerificationPopupProps {
  verified: boolean;
  handleResendVerification: () => void;
}

const EmailVerificationPopup: React.FC<EmailVerificationPopupProps> = ({
  verified,
  handleResendVerification,
}) => {
  const [showPopup, setShowPopup] = useState(false);
  const popupRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!verified) {
      setShowPopup(true);
    }
  }, [verified]);

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (popupRef.current && !popupRef.current.contains(e.target as Node)) {
        setShowPopup(false);
      }
    };

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setShowPopup(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  return (
    !verified &&
    showPopup && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div
          ref={popupRef}
          className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full text-center animate-fadeIn"
        >
          <h2 className="text-xl font-bold mb-4 text-gray-800">Email Verification Required</h2>
          <p className="mb-6 text-gray-600">
            We have sent an email for verification. Please verify it to unlock full access.
          </p>
          <div className="flex justify-center space-x-4">
            <button
              onClick={handleResendVerification}
              className="bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition"
            >
              Resend Email
            </button>
            <button
              onClick={handleResendVerification}
              className="bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition"
            >
              Change Email
            </button>
          </div>
        </div>
      </div>
    )
  );
};

export default EmailVerificationPopup;
