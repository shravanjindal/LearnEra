import React from "react";

interface BuyTokensDialogBoxProps {
  tokenCount: number;
  amount: number;
  handleTokenChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleConfirm: () => void;
  setPriceDialogBoxOpen: (open: boolean) => void;
}

const BuyTokensDialogBox: React.FC<BuyTokensDialogBoxProps> = ({
  tokenCount,
  amount,
  handleTokenChange,
  handleConfirm,
  setPriceDialogBoxOpen,
}) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-60 backdrop-blur-sm">
      <div className="bg-[#1e1e1e] p-6 rounded-lg w-96 max-w-md border border-[#2c2c2c] text-white">
        <h2 className="text-xl font-semibold mb-4">Buy Tokens</h2>

        <label className="block mb-2 text-sm font-medium text-gray-300">
          Select number of tokens:{" "}
          <span className="font-semibold text-white">{tokenCount}</span>
        </label>
        <input
          type="range"
          min="100"
          max="10000"
          step="50"
          value={tokenCount}
          onChange={handleTokenChange}
          className="w-full mb-4 accent-blue-600"
        />

        <p className="mb-6 text-sm text-gray-300">
          Total Amount:{" "}
          <span className="font-semibold text-white">₹{amount}</span>
        </p>

        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={() => setPriceDialogBoxOpen(false)}
            className="px-5 py-2 bg-[#3a3a3a] hover:bg-[#4a4a4a] text-white rounded-md text-sm"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm"
          >
            Confirm Purchase
          </button>
        </div>
      </div>
    </div>
  );
};

export default BuyTokensDialogBox;
