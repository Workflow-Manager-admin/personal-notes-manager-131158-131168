import React from "react";

interface FabProps {
  onClick: () => void;
  ariaLabel?: string;
}

const Fab: React.FC<FabProps> = ({ onClick, ariaLabel = "Add note" }) => (
  <button
    className="fixed right-6 bottom-6 z-50 w-14 h-14 bg-[#ffb300] text-white rounded-full flex items-center justify-center shadow-lg hover:bg-[#ffa000] transition"
    onClick={onClick}
    aria-label={ariaLabel}
    title="Add note"
    style={{ fontSize: 28, fontWeight: "bold" }}
  >
    +
  </button>
);

export default Fab;
