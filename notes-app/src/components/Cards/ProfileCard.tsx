import { useState } from "react";
import { FiLogOut } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import type { ProfileCardProps } from "../../utils/types";

const ProfileCard: React.FC<ProfileCardProps> = ({
  userInfo,
  handleLogout,
}) => {
  const [open, setOpen] = useState(false);

  const initials = userInfo?.fullName
    .split(" ")
    .map((n: string) => n[0])
    .join("")
    .toUpperCase();

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="w-10 h-10 flex items-center justify-center bg-gray-600 text-white rounded-full font-semibold hover:bg-gray-700 transition"
      >
        {initials}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute right-0 mt-3 w-48 bg-white rounded-xl shadow-lg ring-1 ring-gray-200 overflow-hidden z-50"
          >
            <div className="px-4 py-3 border-b">
              <p className="text-sm font-medium text-gray-800">
                {userInfo?.fullName}
              </p>
              <p className="text-xs text-gray-500">Active user</p>
            </div>
            <button
              onClick={handleLogout}
              className="flex w-full items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-gray-50"
            >
              <FiLogOut size={16} />
              Logout
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ProfileCard;
