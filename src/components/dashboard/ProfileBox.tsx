import React from "react";

interface ProfileBoxProps {
  user: {
    name: string;
    email: string;
    tokenBalance: number;
  };
  handleLogout: () => void;
  setPriceDialogBoxOpen: (open: boolean) => void;
  setProfileBoxOpen: (open: boolean) => void;
}

const ProfileBox: React.FC<ProfileBoxProps> = ({
  user,
  handleLogout,
  setPriceDialogBoxOpen,
    setProfileBoxOpen,
}) => {
  return (
    <div className="absolute top-16 right-6 w-80 p-6 bg-[#1e1e1e] rounded-2xl shadow-xl z-50 border border-[#2c2c2c]">
        <h3 className="text-xl font-semibold text-white mb-4">User Profile</h3>
        <p className="text-sm text-gray-400 mb-2">User ID: <span className="text-gray-300">{user.email}</span></p>
        <p className="text-sm text-gray-400 mb-6">
            Token Balance: <span className="font-semibold text-white">{user.tokenBalance || 0}</span>
        </p>

        <div className="flex justify-between items-center mb-4">
            <button
            onClick={() => {
                setProfileBoxOpen(false)
                setPriceDialogBoxOpen(true)
            }}
            className="text-sm font-medium text-blue-500 hover:text-blue-400 transition duration-200"
            >
            Buy More Tokens
            </button>
            <span className="text-xs text-gray-500">Upgrade your account!</span>
        </div>

        <button
            onClick={handleLogout}
            className="w-full bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-4 rounded-xl transition-all duration-200"
        >
            Logout
        </button>
        </div>

  );
};

export default ProfileBox;
