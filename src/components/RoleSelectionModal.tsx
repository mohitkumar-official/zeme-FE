import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

interface RoleSelectionModalProps {
  open: boolean;
  onClose: () => void;
}

const RoleSelectionModal: React.FC<RoleSelectionModalProps> = ({ open, onClose }) => {
  const navigate = useNavigate();
  const [selectedRole, setSelectedRole] = useState("");

  if (!open) return null;

  const handleContinue = () => {
    if (selectedRole) {
      navigate(`/register?role=${selectedRole}`);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-2xl p-6 w-96 shadow-lg relative">
        <button
          className="absolute top-3 right-3 text-gray-600 hover:text-black"
          onClick={onClose}
        >
          ❌
        </button>

        <h2 className="text-center text-xl font-semibold mb-4">Are you a...</h2>

        <div className="grid grid-cols-3 gap-4 mb-6">
          {[
            { label: "Renter", value: "renter", img: "🏡" },
            { label: "Agent", value: "agent", img: "🔑" },
            { label: "Landlord", value: "landlord", img: "🏠" },
          ].map((role) => (
            <div
              key={role.value}
              className={`flex flex-col items-center p-4 border-2 rounded-xl cursor-pointer ${
                selectedRole === role.value
                  ? "border-blue-500 bg-blue-100"
                  : "border-gray-300"
              }`}
              onClick={() => setSelectedRole(role.value)}
            >
              <span className="text-3xl">{role.img}</span>
              <span
                className={`mt-2 font-medium ${
                  selectedRole === role.value ? "text-blue-600" : "text-gray-700"
                }`}
              >
                {role.label}
              </span>
            </div>
          ))}
        </div>

        <button
          className={`w-full py-2 rounded-lg text-white text-lg font-semibold transition ${
            selectedRole
              ? "bg-blue-500 hover:bg-blue-600"
              : "bg-gray-300 cursor-not-allowed"
          }`}
          onClick={handleContinue}
          disabled={!selectedRole}
        >
          Continue
        </button>
      </div>
    </div>
  );
};

export default RoleSelectionModal;
