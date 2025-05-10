import { useEffect, useRef, useState } from "react";
import { Mail, RefreshCw, Edit } from "lucide-react";

interface EmailVerificationPopupProps {
  verified: boolean;
  currentEmail: string;
  handleResendVerification: () => void;
  handleChangeEmail: (email: string) => void;
}

const EmailVerificationPopup: React.FC<EmailVerificationPopupProps> = ({
  verified,
  currentEmail,
  handleResendVerification,
  handleChangeEmail,
}) => {
  const [showPopup, setShowPopup] = useState(false);
  const popupRef = useRef<HTMLDivElement | null>(null);
  const [showEmail, setShowEmail] = useState(false);
  const [email, setEmail] = useState(currentEmail);
  const [buttonText, setButtonText] = useState("Resend Email");
  const [isResending, setIsResending] = useState(false);

  // Sync email state with prop when it changes
  useEffect(() => {
    setEmail(currentEmail);
  }, [currentEmail]);

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

  const handleResendClick = () => {
    if (buttonText === "Resend Email") {
      setIsResending(true);
      handleResendVerification();
      setTimeout(() => {
        setIsResending(false);
      }, 2000);
    } else {
      handleChangeEmail(email);
      setButtonText("Resend Email");
    }
  };

  return (
    !verified &&
    showPopup && (
      <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-60 backdrop-blur-sm p-4">
        <div
          ref={popupRef}
          className="bg-[#1e1e1e] p-6 rounded-lg w-full max-w-md border border-[#2c2c2c]"
        >
          <div className="flex items-center mb-4">
            <div className="bg-blue-600 bg-opacity-20 p-2 rounded-full mr-3">
              <Mail size={20} className="text-blue-400" />
            </div>
            <h2 className="text-xl font-semibold text-white">Verify Your Email</h2>
          </div>
          
          <p className="text-sm text-gray-300 mb-5">
            We sent a verification link to <span className="font-semibold text-white">{currentEmail}</span>. 
            Please check your inbox or spam folder to complete the verification process.
          </p>
          
          {showEmail ? (
            <div className="mb-4">
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                placeholder="Enter new email"
                className="w-full px-3 py-2 rounded-md bg-[#2a2a2a] text-white placeholder-gray-400 border border-[#3a3a3a] focus:outline-none focus:ring-1 focus:ring-blue-500 mb-4"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    setButtonText("Send Email");
                    setShowEmail(false);
                  }
                }}
              />
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => {
                    setButtonText("Send Email");
                    setShowEmail(false);
                  }}
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm"
                >
                  Apply
                </button>
                <button
                  type="button"
                  onClick={() => setShowEmail(false)}
                  className="px-5 py-2 bg-[#3a3a3a] hover:bg-[#4a4a4a] text-white rounded-md text-sm"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={handleResendClick}
                className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm flex items-center"
                disabled={isResending}
              >
                {isResending ? (
                  <>
                    <RefreshCw size={14} className="mr-2 animate-spin" />
                    Sending...
                  </>
                ) : (
                  buttonText
                )}
              </button>
              <button
                type="button"
                onClick={() => setShowEmail(true)}
                className="px-5 py-2 bg-[#3a3a3a] hover:bg-[#4a4a4a] text-white rounded-md text-sm flex items-center"
              >
                <Edit size={14} className="mr-2" />
                Change Email
              </button>
            </div>
          )}
          
          <p className="mt-4 text-xs text-gray-500">
            Having trouble? Contact <a href="#" className="text-blue-400 hover:text-blue-300">support@zovite.co</a>
          </p>
        </div>
      </div>
    )
  );
};

export default EmailVerificationPopup;